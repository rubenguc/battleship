import { useEffect, useMemo } from "react";
import { useGameState } from "@/state/gameState";
import { useAuthContext } from "@/providers/AuthProvider";
import { useNavigate } from "@tanstack/react-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function useWaitingRoom() {
  const { t } = useTranslation("waitingRoom");
  const { user } = useAuthContext();
  const { room, startGame: _startGame } = useGameState();
  const navigate = useNavigate();

  const players = useMemo(() => {
    const data = [room.player1];

    if (room.player2?.id) data.push(room.player2);

    return data;
  }, [room]);

  const isRoomMaster = user.id === room.roomMasterId;
  const isGameStarted = room.isStarted;
  const canStartGame = !!room.player2?.id;

  const startGame = async () => {
    try {
      const docRef = doc(db, "room", room.id);

      await updateDoc(docRef, {
        isStarted: true,
      });
      _startGame();
    } catch (error) {
      console.error(error);
      toast.error(t("failed_to_start_game"));
    }
  };

  useEffect(() => {
    if (!room.id) navigate({ to: "/" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    if (isGameStarted) navigate({ to: "/fleetFormation" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameStarted]);

  return {
    roomId: room.id,
    players,
    isRoomMaster,
    startGame,
    canStartGame,
  };
}
