import { useTranslation } from "react-i18next";
import Grid from "@/components/Grid";
import useGame from "./hooks/useGame";
import { FaCrown } from "react-icons/fa";

export default function Game() {
  const { t } = useTranslation("game")
  const { moves, placedShips, rivalMoves, onSelectCell, canMakeMove, winner, exit, isPlayerTurn } = useGame()

  if (winner) {
    return (
      <div className="flex flex-1 items-center gap-10 justify-center w-full">
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-4 mb-7">
            <FaCrown size={30} color="#ffcc25" />
            <h2 className="text-3xl">{t("winner")}</h2>
          </div>
          <p data-testid="winner" className="text-4xl text-center font-bold mb-12">{winner}</p>
          <button className="btn-primary mx-auto w-full" onClick={exit}>{t("exit")}</button>
        </div>
      </div>
    )
  }


  return (
    <div className="flex flex-1 flex-col gap-10 justify-center items-center -mt-20">
      <h2 data-testid="player-turn" className={`rounded-xl border p-2 ${isPlayerTurn ? "text-rose-600 border-rose-600" : "text-sky-600 border-sky-600"}`}>{t(isPlayerTurn ? "your_turn" : "opponent_turn")}</h2>
      <div className="flex   gap-10">
        <div className="flex flex-col gap-2 items-center justify-center w-fit">
          <h3 className="py-2 bg-rose-600 text-white w-full text-center rounde md">{t("your_fleet")}</h3>
          <Grid
            placedShips={placedShips}
            selectedCells={rivalMoves}
          />
        </div>

        <div className="flex flex-col gap-2 items-center justify-center w-fit">
          <h3 className="py-2 bg-sky-600 text-white w-full text-center rounded">{t("opponent_fleet")}</h3>
          <Grid
            cellCanBeSelected={canMakeMove}
            selectedCells={moves}
            onSelectCell={onSelectCell}
          />
        </div>
      </div>

    </div>
  )
}
