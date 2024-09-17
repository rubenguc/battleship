import { createRootRoute, createRoute, createRouter, Link, Outlet } from "@tanstack/react-router";
import { FleetFormation, Game, Home, WaitingRoom } from "./pages";


const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-3">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
        <Link to="/fleeFormation" className="[&.active]:font-bold">
          Flee
        </Link>
        <Link to="/game" className="[&.active]:font-bold">
          Game
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  )
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home
});

const waitingRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: WaitingRoom
})

const fleeFormationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fleeFormation',
  component: FleetFormation
})

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: Game
})

const routeTree = rootRoute.addChildren([homeRoute, waitingRoomRoute, fleeFormationRoute, gameRoute])

export const router = createRouter({ routeTree })
