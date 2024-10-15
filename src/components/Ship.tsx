import { CSSProperties, PropsWithChildren } from 'react';
import { useDraggable } from '@dnd-kit/core';

interface ShipProps extends PropsWithChildren {
  isDraggable?: boolean;
  id: string;
  size: number;
  position: {
    col: number;
    row: number
  }
}

export default function Ship({ isDraggable = true, id, size, position }: ShipProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    disabled: !isDraggable
  });

  const style: CSSProperties = {
    width: `${size * 44}px`,
    height: "40px",
    position: "absolute",
    left: position ? `${position.col * 45}px` : "initial",
    top: position ? `${position.row * 45}px` : "initial",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-blue-300 border border-black flex items-center justify-center z-10"
    >
      {id}
    </div>
  );
}
