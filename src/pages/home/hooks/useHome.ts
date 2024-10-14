import { useNavigate } from "@tanstack/react-router";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, db, getProvider } from "../../../services/firebase";
import { useAuthContext } from "../../../providers/AuthProvider";
import { customAlphabet } from "nanoid";
import { doc, setDoc } from "firebase/firestore";
import { useGameState } from "../../../state/gameState";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function useHome() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { setRoomId } = useGameState();

  const onLogin = async (provider: string) => {
    try {
      await signInWithPopup(auth, getProvider(provider));
    } catch (error) {
      console.error(error);
      toast.error(t("failed_to_login"));
    }
  };

  const onLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      toast.error(t("failed_to_logout"));
    }
  };

  const onCreateGame = async () => {
    try {
      const nanoid = customAlphabet("1234567890", 6);
      const roomId = nanoid();

      const playerTurn = Math.random() < 0.5 ? "player1" : "player2";

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
        playerTurn,
        playerIdCreated: user.id,
        isOver: false,
        isStarted: false,
      });

      setRoomId({
        id: roomId,
        roomMasterId: user.id,
      });

      navigate({
        to: "/waiting-room",
      });
    } catch (error) {
      console.error(error);
      toast.error(t("failed_to_create_game"));
    }
  };

  return {
    onLogin,
    onLogout,
    onCreateGame,
  };
}
