import { useMemo, useState } from "react";
import { ShipFormation } from "@/interfaces";
import { initShips, SHIP_POSITION } from "@/constants";
import { DragEndEvent } from "@dnd-kit/core";
import { useAuthContext } from "@/providers/AuthProvider";
import { useGameState } from "@/state/gameState";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function useFleetFormation() {
  const { t } = useTranslation("fleetFormation");

  const { user } = useAuthContext();
  const { room } = useGameState();

  const [placedShips, setPlacedShips] = useState<ShipFormation>(initShips());

  const isRoomMaster = user.id === room.roomMasterId;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const shipId = active.id as number;

    const ship = placedShips[shipId];

    if (!over || !ship) return null;

    const [row, col] = over.id.toString().split("-").map(Number);

    let isInSamePlace = false;

    for (let index = 0; index < ship.size; index++) {
      const rowOccupiedByShip =
        ship.row + (ship.position === SHIP_POSITION.VERTICAL ? index : 0);
      const colOccupiedByShip =
        ship.col + (ship.position === SHIP_POSITION.HORIZONTAL ? index : 0);

      const isOccupied =
        ship.position === SHIP_POSITION.VERTICAL
          ? row <= rowOccupiedByShip && row >= ship.row
          : col <= colOccupiedByShip && col >= ship.col;

      isInSamePlace = isOccupied;
    }

    if (isInSamePlace) {
      const newPosition =
        ship.position === SHIP_POSITION.HORIZONTAL
          ? SHIP_POSITION.VERTICAL
          : SHIP_POSITION.HORIZONTAL;

      const canPlaceShip = !checkOverlap({
        row,
        col,
        size: ship.size,
        shipId: ship.id,
        position: newPosition,
      });

      if (!canPlaceShip) {
        // TODO: toast error No se puede colocar el barco aquí, hay una superposición.
        return null;
      }

      setPlacedShips((prevShips) => ({
        ...prevShips,
        [active.id]: { ...prevShips[shipId], position: newPosition },
      }));

      return undefined;
    }

    const isInsideGrid = col + ship.size <= 10;

    if (!isInsideGrid) {
      // TODO: toast error El barco no cabe en esta posición.
      return null;
    }

    const canPlaceShip = !checkOverlap({
      row,
      col,
      size: ship.size,
      position: ship.position,
    });

    if (!canPlaceShip) {
      // TODO: toast error No se puede colocar el barco aquí, hay una superposición.
      return null;
    }

    setPlacedShips((prevShips) => ({
      ...prevShips,
      [active.id]: { ...prevShips[shipId], row, col },
    }));
  };

  const checkOverlap = ({
    size,
    row,
    col,
    position,
    shipId,
  }: {
    size: number;
    col: number;
    row: number;
    position: SHIP_POSITION;
    shipId?: number;
  }) => {
    for (let i = 0; i < size; i++) {
      if (isCellOccupied({ row, col, index: i, position, shipId })) {
        return true;
      }
    }
    return false;
  };

  const isCellOccupied = ({
    row,
    col,
    position,
    index,
    shipId,
  }: {
    col: number;
    row: number;
    position: SHIP_POSITION;
    index: number;
    shipId?: number;
  }) => {
    const _row = row + (position === SHIP_POSITION.VERTICAL ? index : 0);
    const _col = col + (position === SHIP_POSITION.HORIZONTAL ? index : 0);

    return Object.keys(placedShips).some((key) => {
      const ship = placedShips[key];

      if (shipId && ship.id === shipId) return false;

      return (
        ship.row === _row && _col >= ship.col && _col < ship.col + ship.size
      );
    });
  };

  const sendFleetFormation = async () => {
    try {
      const playerKey = isRoomMaster ? "player1" : "player2";
      const docRef = doc(db, "room", room.id);

      await updateDoc(docRef, {
        [`${playerKey}.fleetFormation`]: placedShips,
        [`${playerKey}.isFleetReady`]: true,
      });
    } catch (error) {
      console.error(error);
      toast.error(t("failed_to_send_fleet_formaiton"));
    }
  };

  const playerIsReady = useMemo(() => {
    const playerKey = isRoomMaster ? "player1" : "player2";

    return room[playerKey].isFleetReady;
  }, [room, isRoomMaster]);

  const otherPlayerIsReady = useMemo(() => {
    const playerKey = !isRoomMaster ? "player1" : "player2";

    return room[playerKey].isFleetReady;
  }, [room, isRoomMaster]);

  return {
    handleDragEnd,
    sendFleetFormation,
    placedShips,
    playerIsReady,
    otherPlayerIsReady,
  };
}
