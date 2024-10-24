import { ButtonWithModal } from "../../components";
import { useTranslation } from "react-i18next";
import useFleetFormation from "./hooks/useFleetFormation";
import { useEffect } from "react";
import toast from "react-hot-toast"
import { useNavigate } from "@tanstack/react-router";
import Grid from "../../components/Grid";

const Board = () => {
  const { t } = useTranslation("fleetFormation");
  const navigate = useNavigate()
  const { handleDragEnd, sendFleetFormation, placedShips, playerIsReady, otherPlayerIsReady } = useFleetFormation()

  useEffect(() => {
    if (playerIsReady && !otherPlayerIsReady) toast.loading(t("waiting_for_other_player"));

    if (playerIsReady && otherPlayerIsReady) {
      navigate({ to: '/game' })
    }

    return () => {
      toast.dismiss();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerIsReady, otherPlayerIsReady])

  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      <h2 className="font-semibold text-xl mb-10">{t("fleet_formation")}</h2>

      <Grid
        placedShips={placedShips}
        handleDragEnd={handleDragEnd}
        areFloatsDraggable
      />
      <div className="flex justify-center mt-10 py-4">
        <ButtonWithModal
          isDisabled={playerIsReady}
          text={t("finish")}
          confirmButtonText={t("confirm")}
          modalTitle={t("confirm_fleet_formation")}
          onConfirmAction={sendFleetFormation}
        />
      </div>
    </div>
  );
};

export default Board;
