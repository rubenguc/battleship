import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { FleetFormation, Game, Home, WaitingRoom } from "./pages";
import Header from "./components/Header";
import { getRoomStatus } from "./utils/room";
import { Room } from "./interfaces";

const rootRoute = createRootRoute({
  component: () => {
    return (
      <>
        <Header />
        <hr />
        <Outlet />
      </>
    );
  },
});

const homeRoute = createRoute({
  beforeLoad: async ({ context }) => {
    const { room } = context as { room: Room };

    const { isCreated, fleetsAreReady, isOver, isStarted } =
      getRoomStatus(room);


    if (isCreated && !isOver) {
      if (!isStarted) {
        throw redirect({
          to: "/waiting-room",
        });
      } else if (isStarted && !fleetsAreReady) {
        throw redirect({
          to: "/fleetFormation",
        });
      } else {
        throw redirect({
          to: "/game",
        });
      }
    }
  },
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const waitingRoomRoute = createRoute({
  beforeLoad: ({ context }) => {
    const { room } = context as { room: Room };

    const { isCreated, fleetsAreReady, isOver, isStarted } =
      getRoomStatus(room);

    if (!isCreated || isOver) {
      throw redirect({
        to: "/",
      });
    } else if (isStarted && !fleetsAreReady) {
      throw redirect({
        to: "/fleetFormation",
      });
    } else if (fleetsAreReady) {
      throw redirect({
        to: "/game",
      });
    }
  },
  getParentRoute: () => rootRoute,
  path: "/waiting-room",
  component: WaitingRoom,
});

const fleetFormationRoute = createRoute({
  beforeLoad: ({ context }) => {
    const { room } = context as { room: Room };

    const { isCreated, fleetsAreReady, isOver, isStarted } =
      getRoomStatus(room);

    if (!isCreated || isOver) {
      throw redirect({
        to: "/",
      });
    } else if (isStarted && fleetsAreReady) {
      throw redirect({
        to: "/game",
      });
    }
  },
  getParentRoute: () => rootRoute,
  path: "/fleetFormation",
  component: FleetFormation,
});

const gameRoute = createRoute({
  beforeLoad: ({ context }) => {
    const { room } = context as { room: Room };

    const { isCreated, isOver, fleetsAreReady, isStarted } =
      getRoomStatus(room);

    if (!isCreated || isOver) {
      throw redirect({
        to: "/",
      });
    } else if (isStarted && !fleetsAreReady) {
      throw redirect({
        to: "/fleetFormation",
      });
    } else if (!isStarted) {
      throw redirect({
        to: "/waiting-room",
      });
    }
  },
  getParentRoute: () => rootRoute,
  path: "/game",
  component: Game,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  waitingRoomRoute,
  fleetFormationRoute,
  gameRoute,
]);

export const router = createRouter({
  routeTree
});
