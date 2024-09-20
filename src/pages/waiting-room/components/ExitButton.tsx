import { Button } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { useToggle } from "react-use";
import { CustomDialog } from "../../../components";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useGameState } from "../../../state/gameState";
import { db } from "../../../services/firebase";
import { useNavigate } from "@tanstack/react-router";

interface ExitButtonProps {
  isRoomMaster: boolean;
}

export default function ExitButton({ isRoomMaster }: ExitButtonProps) {
  const { t } = useTranslation("waitingRoom");
  const navigate = useNavigate();

  const [isOpen, toggle] = useToggle(false);

  const { room } = useGameState();

  const onExit = async () => {
    try {
      const docRef = doc(db, "room", room.id);

      if (!isRoomMaster) {
        await updateDoc(docRef, {
          player2: {},
        });
      } else {
        await deleteDoc(docRef)
      }
      //

      navigate({
        to: "/",
      });
    } catch (error) {
      // TODO: catch error
      console.log(error);
    }
  };

  return (
    <>
      <Button className="btn-outlined" onClick={toggle}>
        {t(isRoomMaster ? "close_room" : "exit")}
      </Button>
      <CustomDialog
        isOpen={isOpen}
        onClose={toggle}
        title={t("confirm")}
        Footer={
          <Button className="btn-primary" onClick={onExit}>
            {t("confirm")}
          </Button>
        }
      />
    </>
  );
}
