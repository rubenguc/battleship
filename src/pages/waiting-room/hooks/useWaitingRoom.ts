import { useEffect, useMemo } from "react";
import { useGameState } from "../../../state/gameState";
import { useAuthContext } from "../../../providers/AuthProvider";
import { useNavigate } from "@tanstack/react-router";

export default function useWaitingRoom() {
  const { user } = useAuthContext();
  const { room } = useGameState();
  const navigate = useNavigate();

  const players = useMemo(() => {
    const data = [room.player1];

    if (room.player2.id) data.push(room.player2);

    return data;
  }, [room]);

  const isRoomMaster = user.id === room.roomMasterId;

  useEffect(() => {
    if (!room.id) navigate({ to: "/" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return {
    roomId: room.id,
    players,
    isRoomMaster,
  };
}
