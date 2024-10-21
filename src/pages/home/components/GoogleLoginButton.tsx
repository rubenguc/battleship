import { useTranslation } from "react-i18next";
import { ProviderLoginButton } from "../../../components";

interface GoogleLoginButtonProps {
  onClick: () => void;
}

export default function GoogleLoginButton({ onClick }: GoogleLoginButtonProps) {
  const { t } = useTranslation("home")

  return (
    <ProviderLoginButton
      buttonClassName="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
      onClick={onClick}
      imgSrc="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="google logo"
      text={t("login_with_google")}
      spanClassName="text-black"
    />
  );
}
