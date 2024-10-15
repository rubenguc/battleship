// import { Link } from '@tanstack/react-router'
import { useAuthContext } from '../providers/AuthProvider'

export default function Header() {
  const { user, userIsLogged } = useAuthContext()

  return (
    <>
      <div className="p-2 flex justify-between">
        <img src="/icon.svg" width={40} />
        {/* <div className="p-2 flex gap-3">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{' '}
          <Link to="/waiting-room" className="[&.active]:font-bold">
            waiting room
          </Link>
          <Link to="/fleetFormation" className="[&.active]:font-bold">
            Flee
          </Link>
          <Link to="/game" className="[&.active]:font-bold">
            Game
          </Link>
        </div> */}
        {
          userIsLogged && (
            <div className="flex items-center gap-2">
              <img src={user!.photoURL} width={40} height={40} className="rounded-full" />
              <span>{user!.name}</span>
            </div>
          )
        }
      </div>
    </>
  )
}
