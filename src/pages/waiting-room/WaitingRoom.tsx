import { useTranslation } from "react-i18next";
import useWaitingRoom from "./hooks/useWaitingRoom";
import WaitingPlayer from "./components/WaitingPlayer";
import { Button } from "@headlessui/react";
import ExitButton from "./components/ExitButton";

export default function WaitingRoom() {
  const { t } = useTranslation("waitingRoom");
  const { roomId, players, isRoomMaster } = useWaitingRoom();


  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="rounded shadow p-2">
        <p>
          {t("room_code")}: {roomId}
        </p>

        <div className="flex flex-col gap-5 mt-10">
          {players.map((player) => (
            <WaitingPlayer key={player.id} {...player} />
          ))}
        </div>

        <div className="flex items-center gap-4 mt-5">
          <ExitButton
            isRoomMaster={isRoomMaster}
          />
          {isRoomMaster && <Button className="btn-primary">{t("start_game")}</Button>}
        </div>
      </div>
    </div>
  );
}
