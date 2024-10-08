import { COLUMNS, LETTERS, ROWS, SHIPS } from "../constants";
import Ship from "./Ship";
import Cell from "./Cell";
import SelectedTableCell from "./SelectedTableCell";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

interface GridProps {
  placedShips: any;
  cellCanBeSelected?: boolean;
  handleDragEnd?: (event: DragEndEvent) => void;
  areFloatsDraggable?: boolean;
}

export default function Grid({
  placedShips,
  cellCanBeSelected,
  handleDragEnd,
  areFloatsDraggable = false,
}: GridProps) {
  // TODO: move to utils
  const isCellOccupied = ({ row, col }: { col: number; row: number }) => {
    return Object.keys(placedShips).some((key) => {
      const ship = placedShips[key];

      return ship.row === row && col >= ship.col && col < ship.col + ship.size;
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-11 relative">
        <div className="h-10  col-span-11 grid grid-cols-11 w-full" >
          {
            Object.keys(LETTERS).map(key => (
              <span className="flex items-center justify-center">{LETTERS[key]}</span>
            ))
          }
        </div>
        <div className="h-full  col-row-11 grid grid-col-1 w-10" >
          {
            COLUMNS.map((_, index) =>
              <span className="flex items-center justify-center">{index + 1}</span>
            )
          }
        </div>
        <div className="grid grid-cols-10 gap-1 relative col-span-10">
          {ROWS.map((_, rowIndex) =>
            COLUMNS.map((_, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                id={`${rowIndex}-${colIndex}`}
                isOccupied={isCellOccupied({ row: rowIndex, col: colIndex })}
                isDroppable={areFloatsDraggable}
              >
                {cellCanBeSelected && (
                  <SelectedTableCell
                    isSelected={false}
                    onSelected={() =>
                      console.log("selected cell:", `${rowIndex}-${colIndex}`)
                    }
                  />
                )}
              </Cell>
            ))
          )}

          {SHIPS.map((ship, index) => (
            <Ship
              key={index.toString()}
              id={index.toString()}
              size={ship.size}
              position={placedShips[index.toString()]}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}