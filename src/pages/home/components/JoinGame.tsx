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
import { useAuthContext } from "../../../providers/AuthProvider";
import { useGameState } from "../../../state/gameState";
import { CustomDialog } from "../../../components";



export default function JoinGame() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { setRoomId } = useGameState();
  const [isOpen, toggle] = useToggle(false);

  const [search, setSearch] = useState("");

  const searchGame = async () => {
    try {
      //

      const docRef = doc(db, "room", search);

      const snapshot = await getDoc(docRef);
      const roomExists = snapshot.exists();

      if (!roomExists) return; // TODO: throw error

      const data = snapshot.data() as Room;

      const alreadyHasTwoPlayers = !!data.player2.id;

      if (alreadyHasTwoPlayers) return; // TODO: throw error

      const isEnded = data.isOver;

      if (isEnded) return; // TODO: throw error

      await updateDoc(docRef, {
        player2: {
          isFleetReady: false,
          id: user.id,
          data: {
            name: user.name,
            image: user.photoURL,
          },
          moves: [],
          fleeFormation: [],
        },
      });

      setRoomId({
        id: search,
      });

      navigate({
        to: "/waiting-room",
      });
    } catch (error) {
      // TODO: catch error
      console.log(error);
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
