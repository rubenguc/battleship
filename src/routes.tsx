import { createRootRoute, createRoute, createRouter, Link, Outlet } from "@tanstack/react-router";
import { FleetFormation, Game, Home, WaitingRoom } from "./pages";
import { useAuthContext } from "./providers/AuthProvider";


const rootRoute = createRootRoute({
  component: () => {
    const { user, userIsLogged } = useAuthContext()

    return (
      <>
        <div className="p-2 flex justify-between">
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
          {
            userIsLogged && (
              <div className="flex items-center gap-2">
                <img src={user!.photoURL} width={40} height={40} className="rounded-full" />
                <span>{user!.name}</span>
              </div>
            )
          }
        </div>
        <hr />
        <Outlet />
      </>
    )

  }
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home
});

const waitingRoomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/waiting-room",
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
