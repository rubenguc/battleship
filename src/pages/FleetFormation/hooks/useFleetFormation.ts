import { useMemo, useState } from "react";
import { ShipFormation } from "../../../interfaces";
import { initShips } from "../../../constants";
import { DragEndEvent } from "@dnd-kit/core";
import { useAuthContext } from "../../../providers/AuthProvider";
import { useGameState } from "../../../state/gameState";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
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

    if (over && ship) {
      const [row, col] = over.id.toString().split("-").map(Number);

      const isInsideGrid = col + ship.size <= 10;

      if (!isInsideGrid) {
        // TODO: toast error El barco no cabe en esta posición.
        return null;
      }

      const canPlaceShip = !checkOverlap({
        row,
        col,
        size: ship.size,
      });

      if (!canPlaceShip) {
        // TODO: toast error No se puede colocar el barco aquí, hay una superposición.
        return null;
      }

      setPlacedShips((prevShips) => ({
        ...prevShips,
        [active.id]: { ...prevShips[shipId], row, col },
      }));
    }
  };

  const checkOverlap = ({
    size,
    row,
    col,
  }: {
    size: number;
    col: number;
    row: number;
  }) => {
    for (let i = 0; i < size; i++) {
      if (isCellOccupied({ row, col: col + i })) {
        return true; // Hay superposición
      }
    }
    return false; // No hay superposición
  };

  const isCellOccupied = ({ row, col }: { col: number; row: number }) => {
    return Object.keys(placedShips).some((key) => {
      const ship = placedShips[Number(key)];

      return ship.row === row && col >= ship.col && col < ship.col + ship.size;
    });
  };

  const sendFleetFormation = async () => {
    try {
      //
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
    isCellOccupied,
    placedShips,
    playerIsReady,
    otherPlayerIsReady,
  };
}
