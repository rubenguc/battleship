import {
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth/web-extension";
import { useAuthContext } from "../../providers/AuthProvider";
import { GithubLoginButton, GoogleLoginButton } from "./components";
import { Button } from "@headlessui/react";
import { useHome } from "./hooks";
import { useTranslation } from "react-i18next";
import JoinGame from "./components/JoinGame";

export default function Home() {
  const { t } = useTranslation("home")
  const { userIsLogged } = useAuthContext();
  const { onCreateGame, onLogin, onLogout } = useHome()

  return (
    <div className="flex flex-1 justify-center items-center">
      {userIsLogged ? (
        <div className="flex flex-col gap-3">
          <Button className="btn-primary" onClick={onCreateGame}>{t("create_game")}</Button>
          <JoinGame />
          <Button className="btn-outlined" onClick={onLogout}>{t("logout")}</Button>

        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <GoogleLoginButton
            onClick={() => onLogin(GoogleAuthProvider.PROVIDER_ID)}
          />
          <GithubLoginButton
            onClick={() => onLogin(GithubAuthProvider.PROVIDER_ID)}
          />
        </div>
      )}
    </div>
  );
}
