import { PropsWithChildren } from "react"
import { Player, } from "../../../interfaces"


export default function WaitingPlayer({ data: { image, name }, id }: PropsWithChildren<Player>) {

  if (!id) return null

  return (
    <div className="flex items-center gap-2">
      <img className="rounded-full h-10" src={image} alt={`player ${name} image`} width={40} height={40} />
      <p>{name}</p>
    </div>
  )
}
