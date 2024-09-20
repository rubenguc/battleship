import { PropsWithChildren } from "react"
import { Player, } from "../../../interfaces"


export default function WaitingPlayer({ data: { image, name } }: PropsWithChildren<Player>) {
  return (
    <div className="flex items-center gap-2">
      <img className="rounded-full" src={image} alt={`player ${name} image`} width={40} height={40} />
      <p>{name}</p>
    </div>
  )
}
