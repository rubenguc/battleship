import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../../../providers/AuthProvider";
import { useGameState } from "../../../state/gameState";
import { db } from "../../../services/firebase";
import { Move, ShipFormation } from "../../../interfaces";
import { useEffect, useMemo } from "react";
import { useToggle } from "react-use";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const hasPlayerWon = (fleetFormation: ShipFormation, playerMoves: Move[]) => {
  const allPlayerMoves = playerMoves.map((pm) => pm.cell);

  return Object.keys(fleetFormation).every((key) => {
    const fleet = fleetFormation[Number(key)];

    const occupiedCellByFleet = [];

    for (let index = 0; index < fleet.size; index++) {
      occupiedCellByFleet.push(`${fleet.row}-${fleet.col + index}`);
    }

    return occupiedCellByFleet.every((cell) => allPlayerMoves.includes(cell));
  });
};

export default function useGame() {
  const { t } = useTranslation("game");
  const navigate = useNavigate();
  const { room, clear } = useGameState();
  const { user } = useAuthContext();

  const [isLoading, toggleLoading] = useToggle(false);

  const isRoomCreator = user.id === room.roomMasterId;
  const player = isRoomCreator ? "player1" : "player2";
  const rivalPlayer = !isRoomCreator ? "player1" : "player2";

  const placedShips = room[player].fleetFormation;
  const moves = room[player].moves;
  const rivalMoves = room[rivalPlayer].moves;

  const onSelectCell = async (cellKey: string) => {
    toggleLoading();
    try {
      const isHit = Object.keys(room[rivalPlayer].fleetFormation).some(
        (key) => {
          const position = room[rivalPlayer].fleetFormation[Number(key)];

          const [row, col] = cellKey.split("-");

          const move = {
            row: Number(row),
            col: Number(col),
          };

          return (
            move.row === position.row &&
            move.col >= position.col &&
            move.col < position.col + position.size
          );
        }
      );

      const docRef = doc(db, "room", room.id);

      await updateDoc(docRef, {
        [`${player}.moves`]: arrayUnion({
          cell: cellKey,
          result: isHit ? "hit" : "miss",
        } as Move),
        playerTurn: isHit ? player : rivalPlayer,
      });
    } catch (error) {
      console.error("error:", error);
      toast.error(t("failed_selecting_cell"));
    }
    toggleLoading();
  };

  const canMakeMove = useMemo(() => {
    const isPlayerTurn = room.playerTurn === player;

    return isPlayerTurn && !isLoading;
  }, [room, isLoading, player]);

  const exit = () => {
    clear();
    navigate({
      to: "/",
    });
  };

  const winner = room.winner;

  useEffect(() => {
    (async () => {
      try {
        const player1Moves = room.player1.moves;
        const player2Moves = room.player2.moves;
        const player1Fleet = room.player1.fleetFormation;
        const player2Fleet = room.player2.fleetFormation;

        const player1Won = hasPlayerWon(player2Fleet, player1Moves);
        const player2Won = hasPlayerWon(player1Fleet, player2Moves);

        if (player1Won || player2Won) {
          const docRef = doc(db, "room", room.id);

          await updateDoc(docRef, {
            [`isOver`]: true,
            ["winner"]: player1Won ? "player1" : "player2",
          });
        }
      } catch (error) {
        console.error("error:", error);
        toast.error(t("failed_to_determine_winner"));
      }
    })();
  }, [room]);

  return {
    placedShips,
    moves,
    rivalMoves,
    onSelectCell,
    canMakeMove,
    winner,
    exit,
  };
}
