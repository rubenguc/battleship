import { Player, } from "@/interfaces"
import { RxAvatar } from "react-icons/rx"


export default function WaitingPlayer({ data: { name }, id }: Player) {

  if (!id) return null

  return (
    <div className="flex items-center gap-2">
      <RxAvatar size={30} color="#55" />
      <p>{name}</p>
    </div>
  )
}
