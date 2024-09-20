import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes";
import useGame from "./hooks/useGame";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  useGame()

  return (
    <div className="flex flex-col flex-1 h-full">
      <RouterProvider router={router} />
    </div>
  );
}
