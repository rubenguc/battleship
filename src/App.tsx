import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import useGame from "./hooks/useGame";
import { Toaster } from "react-hot-toast";
import { useGameState } from "./state/gameState";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  useGame()

  const { room } = useGameState()

  return (
    <div className="flex flex-col flex-1 h-full">
      <RouterProvider router={router} context={{ room }} />
      <Toaster />
    </div>
  );
}
