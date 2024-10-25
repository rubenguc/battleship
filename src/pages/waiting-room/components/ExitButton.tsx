import { useTranslation } from "react-i18next";
import { ButtonWithModal } from "../../../components";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useGameState } from "../../../state/gameState";
import { db } from "../../../services/firebase";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { catchError } from "@/services/errors";

interface ExitButtonProps {
  isRoomMaster: boolean;
}

export default function ExitButton({ isRoomMaster }: ExitButtonProps) {
  const { t } = useTranslation("waitingRoom");
  const navigate = useNavigate();

  const { room } = useGameState();

  const onExit = async () => {
    try {
      const docRef = doc(db, "room", room.id);

      if (!isRoomMaster) {
        await updateDoc(docRef, {
          player2: {},
        });
      } else {
        await deleteDoc(docRef);
      }

      navigate({
        to: "/",
      });
    } catch (error) {
      catchError(error);
      toast.error(t("failed_to_exit"));
    }
  };

  return (
    <ButtonWithModal
      text={t(isRoomMaster ? "close_room" : "exit")}
      modalTitle={t("confirm")}
      confirmButtonText={t("confirm")}
      onConfirmAction={onExit}
    />
  );
}
