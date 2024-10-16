import { CSSProperties, PropsWithChildren } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { SHIP_POSITION } from '../constants';

interface ShipProps extends PropsWithChildren {
  isDraggable?: boolean;
  id: string;
  size: number;
  position: {
    col: number;
    row: number;
    position: SHIP_POSITION
  }
}

export default function Ship({ isDraggable = true, id, size, position }: ShipProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    disabled: !isDraggable,

  });

  const isVertical = position.position === SHIP_POSITION.VERTICAL

  const style: CSSProperties = {
    width: !isVertical ? `${size * 44}px` : "40px",
    height: isVertical ? `${size * 44}px` : "40px",
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
      className="bg-gray-300 border border-black flex items-center justify-center z-10 rounded-full"
    >
      {id}
    </div>
  );
}
