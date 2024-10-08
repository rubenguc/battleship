import { useDroppable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";

interface Cell extends PropsWithChildren {
  isDroppable?: boolean;
  id: string;
  isOccupied: boolean;
}

export default function Cell({
  id,
  isOccupied,
  isDroppable = false,
  children,
}: Cell) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: !isDroppable,
  });

  const style = {
    backgroundColor: isOver
      ? "lightgreen"
      : isOccupied
        ? "lightcoral"
        : "white",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-10 h-10 border border-gray-300 flex items-center justify-center relative"
    >
      {children}
    </div>
  );
}
