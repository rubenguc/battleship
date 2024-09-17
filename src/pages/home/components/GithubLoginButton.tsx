import { useTranslation } from "react-i18next";

interface GithubLoginButtonProps {
  onClick: () => void;
}

export default function GithubLoginButton({ onClick }: GithubLoginButtonProps) {
  const { t } = useTranslation("home");

  return (
    <button
      className="px-4 py-2 border flex gap-2 bg-black border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
      onClick={onClick}
    >
      <img
        className="w-6 h-6"
        src="/assets/github-logo.svg"
        loading="lazy"
        alt="github logo"
      />
      <span>{t("login_with_github")}</span>
    </button>
  );
}
