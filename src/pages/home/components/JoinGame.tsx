import {
  Button,
  Input,
} from "@headlessui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToggle } from "react-use";
import { db } from "../../../services/firebase";
import { Room } from "../../../interfaces";
import { useNavigate } from "@tanstack/react-router";
import { useAuthContext } from "@/providers/AuthProvider";
import { useGameState } from "../../../state/gameState";
import { CustomDialog } from "../../../components";
import toast from "react-hot-toast";
import { catchError } from "@/services/errors";


export default function JoinGame() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { setRoomId } = useGameState();
  const [isOpen, toggle] = useToggle(false);

  const [search, setSearch] = useState("");

  const searchGame = async () => {
    try {
      const docRef = doc(db, "room", search);

      const snapshot = await getDoc(docRef);
      const roomExists = snapshot.exists();

      if (!roomExists) return toast.error(t("room_dont_exist"));

      const data = snapshot.data() as Room;

      const alreadyHasTwoPlayers = !!data.player2.id;

      if (alreadyHasTwoPlayers) return toast.error(t("room_is_full"));

      const isEnded = data.isOver;

      if (isEnded) return toast.error(t("room_already_ended"));

      await updateDoc(docRef, {
        player2: {
          isFleetReady: false,
          id: user.id,
          data: {
            name: user.name,
            image: user.photoURL,
          },
          moves: [],
          fleetFormation: [],
        },
      });

      setRoomId({
        id: search,
      });

      navigate({
        to: "/waiting-room",
      });
    } catch (error) {
      catchError(error);
      toast.error(t("failed_to_find_room"))
    }
  };

  const fieldIsEmpty = search.trim() === "";

  return (
    <>
      <Button className="btn-primary" onClick={toggle}>
        {t("join_game")}
      </Button>

      <CustomDialog
        isOpen={isOpen}
        onClose={toggle}
        title={t("set_room_code")}
        Body={
          <Input
            data-testid="code-input"
            className="border border-gray-600 w-full p-2 rounded"
            value={search}
            onChange={({ target }) => setSearch(target.value)}
          />
        }
        Footer={
          <Button
            disabled={fieldIsEmpty}
            className="btn-primary"
            onClick={searchGame}
          >
            {t("search_room")}
          </Button>
        }
      />
    </>
  );
}
