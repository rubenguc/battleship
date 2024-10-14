import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useWaitingRoom from "./hooks/useWaitingRoom";
import WaitingPlayer from "./components/WaitingPlayer";
import { Button } from "@headlessui/react";
import ExitButton from "./components/ExitButton";
import { BsCopy } from "react-icons/bs";
import { useCopyToClipboard } from "react-use";
import toast from "react-hot-toast";

export default function WaitingRoom() {
  const { t } = useTranslation("waitingRoom");
  const { roomId, players, isRoomMaster, startGame } = useWaitingRoom();

  const [state, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (state.error) {
      toast.error(t("failed_to_copy_code"));
    }

    if (state.value) {
      toast.success(t("room_code_copied"));
    }
  }, [state]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="rounded shadow border p-4">
        <p className="flex item-center gap-2">
          {t("room_code")}:{" "}
          <button
            className="flex items-center gap-2"
            onClick={() => copyToClipboard(roomId)}
          >
            <span className="font-bold">{roomId}</span>
            <BsCopy />
          </button>
        </p>

        <div className="flex flex-col gap-5 mt-10">
          {players.map((player) => (
            <WaitingPlayer key={player.id} {...player} />
          ))}
        </div>

        <div className="flex items-center gap-4 mt-5">
          <ExitButton isRoomMaster={isRoomMaster} />
          {isRoomMaster && (
            <Button onClick={startGame} className="btn-primary">
              {t("start_game")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
