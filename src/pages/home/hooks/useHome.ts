import { useNavigate } from "@tanstack/react-router";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, db, getProvider } from "../../../services/firebase";
import { useAuthContext } from "../../../providers/AuthProvider";
import { customAlphabet } from "nanoid";
import { doc, setDoc } from "firebase/firestore";
import { useGameState } from "../../../state/gameState";

export default function useHome() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { setRoomId } = useGameState();

  const onLogin = async (provider: string) => {
    try {
      await signInWithPopup(auth, getProvider(provider));
    } catch (error) {
      // TODO: missing catch
      console.log("error:", error);
    }
  };

  const onLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      // TODO: missing catch
      console.log("error:", error);
    }
  };

  const onCreateGame = async () => {
    try {
      const nanoid = customAlphabet("1234567890", 6);
      const roomId = nanoid();

      await setDoc(doc(db, "room", roomId), {
        turn: 0,
        player1: {
          isFleetReady: false,
          id: user.id,
          data: {
            name: user.name,
            image: user.photoURL,
          },
          moves: [],
          fleeFormation: [],
        },
        player2: {
          isFleetReady: false,
          id: "",
          data: {},
          moves: [],
          fleeFormation: [],
        },
        playerTurn: "",
        playerIdCreated: user.id,
        isOver: false,
        isStarted: false,
      });

      setRoomId({
        id: roomId,
        roomMasterId: user.id,
      });

      // TODO: firebase logic
      navigate({
        to: "/waiting-room",
      });
    } catch (error) {
      // TODO: missing catch
      console.log("error:", error);
    }
  };

  return {
    onLogin,
    onLogout,
    onCreateGame,
  };
}
