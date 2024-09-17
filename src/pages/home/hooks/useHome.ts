import { useNavigate } from "@tanstack/react-router";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, getProvider } from "../../../services/firebase";

export default function useHome() {
  const navigate = useNavigate();

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
