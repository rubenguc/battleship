import { COLUMNS, LETTERS, ROWS, SHIPS } from "../constants";
import Ship from "./Ship";
import Cell from "./Cell";
import SelectedTableCell from "./SelectedTableCell";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Move } from "../interfaces";

interface GridProps {
  placedShips?: any;
  cellCanBeSelected?: boolean;
  handleDragEnd?: (event: DragEndEvent) => void;
  areFloatsDraggable?: boolean;
  selectedCells?: Move[];
  onSelectCell?: (cellKey: string) => void
}

export default function Grid({
  placedShips,
  cellCanBeSelected,
  handleDragEnd,
  areFloatsDraggable = false,
  selectedCells,
  onSelectCell
}: GridProps) {
  // TODO: move to utils
  const isCellOccupied = ({ row, col }: { col: number; row: number }) => {
    return Object.keys(placedShips || {}).some((key) => {
      const ship = placedShips?.[key];

      return ship.row === row && col >= ship.col && col < ship.col + ship.size;
    });
  };

  const isCellSelected = (key: string) => {
    return selectedCells?.some(({ cell }) => cell === key) || false
  }

  const isHitted = (key: string) => {
    return selectedCells?.some(({ cell, result }) => cell === key && result === "hit") || false
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-11 relative">
        <div className="h-10  col-span-11 grid grid-cols-11 w-full" >
          {
            Object.keys(LETTERS).map(key => (
              <span key={key} className="flex items-center justify-center">{LETTERS[key]}</span>
            ))
          }
        </div>
        <div className="h-full  col-row-11 grid grid-col-1 w-10" >
          {
            COLUMNS.map((_, index) =>
              <span key={index} className="flex items-center justify-center">{index + 1}</span>
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
                {(cellCanBeSelected || isCellSelected(`${rowIndex}-${colIndex}`)) && (
                  <SelectedTableCell
                    isSelected={isCellSelected(`${rowIndex}-${colIndex}`)}
                    isHitted={isHitted(`${rowIndex}-${colIndex}`)}
                    onSelected={() =>
                      onSelectCell?.(`${rowIndex}-${colIndex}`)
                    }
                  />
                )}
              </Cell>
            ))
          )}

          {placedShips && SHIPS.map((ship, index) => (
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