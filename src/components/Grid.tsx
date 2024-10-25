import { COLUMNS, LETTERS, ROWS, SHIP_POSITION, SHIPS } from "../constants";
import Ship from "./Ship";
import Cell from "./Cell";
import SelectedTableCell from "./SelectedTableCell";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Move, ShipFormation } from "../interfaces";
import { useMemo } from "react";

interface GridProps {
  placedShips?: ShipFormation;
  cellCanBeSelected?: boolean;
  handleDragEnd?: (event: DragEndEvent) => void;
  areFloatsDraggable?: boolean;
  selectedCells?: Move[];
  onSelectCell?: (cellKey: string) => void;
}

export default function Grid({
  placedShips,
  cellCanBeSelected,
  handleDragEnd,
  areFloatsDraggable = false,
  selectedCells,
  onSelectCell,
}: GridProps) {
  const cellOccupiedByShips = useMemo(() => {
    const cells: string[] = [];

    Object.keys(placedShips || {}).some((key) => {
      const ship = placedShips![Number(key)];

      for (let index = 0; index < ship.size; index++) {
        const rowOcuppied =
          ship.position === SHIP_POSITION.VERTICAL
            ? ship.row + index
            : ship.row;
        const cellOccupied =
          ship.position === SHIP_POSITION.HORIZONTAL
            ? ship.col + index
            : ship.col;

        cells.push(`${rowOcuppied}-${cellOccupied}`);
      }
    });

    return cells;
  }, [placedShips]);


  // TODO: move to utils
  const isCellOccupied = ({ row, col }: { col: number; row: number }) => {
    const cell = `${row}-${col}`

    return cellOccupiedByShips.includes(cell)
  };

  const isCellSelected = (key: string) => {
    return selectedCells?.some(({ cell }) => cell === key) || false;
  };

  const isHitted = (key: string) => {
    return (
      selectedCells?.some(
        ({ cell, result }) => cell === key && result === "hit"
      ) || false
    );
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-11 relative">
        <div className="h-10  col-span-11 grid grid-cols-11 w-full">
          {Object.keys(LETTERS).map((key) => (
            <span key={key} className="flex items-center justify-center">
              {LETTERS[Number(key)]}
            </span>
          ))}
        </div>
        <div className="h-full  col-row-11 grid grid-col-1 w-10">
          {COLUMNS.map((_, index) => (
            <span key={index} className="flex items-center justify-center">
              {index + 1}
            </span>
          ))}
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
                {(cellCanBeSelected ||
                  isCellSelected(`${rowIndex}-${colIndex}`)) && (
                    <SelectedTableCell
                      isSelected={isCellSelected(`${rowIndex}-${colIndex}`)}
                      isHitted={isHitted(`${rowIndex}-${colIndex}`)}
                      onSelected={() => onSelectCell?.(`${rowIndex}-${colIndex}`)}
                    />
                  )}
              </Cell>
            ))
          )}

          {Object.keys(placedShips || {}).length > 0 &&
            SHIPS.map((ship, index) => (
              <Ship
                key={index.toString()}
                id={index.toString()}
                size={ship.size}
                position={placedShips![index]}
              />
            ))}
        </div>
      </div>
    </DndContext>
  );
}
