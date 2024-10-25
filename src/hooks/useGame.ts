import { useEffect } from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import { DEFAULT_ROOM, useGameState } from "@/state/gameState";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Room } from "@/interfaces";

export default function useGame() {
  const { user } = useAuthContext();
  const { room, updateRoom } = useGameState();

  useEffect(() => {
    const roomId = room.id;

    if (!user || !roomId) return;

    const q = doc(db, "room", roomId);

    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      const room = querySnapshot.data() as Room;

      updateRoom(room || DEFAULT_ROOM);
    });
    return () => {
      unsuscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id, user]);

  return {};
}
