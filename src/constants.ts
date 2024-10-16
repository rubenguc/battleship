import { Ship, ShipFormation } from "./interfaces";

export const SHIPS: Ship[] = [
  {
    id: 1,
    size: 3,
  },
  {
    id: 2,
    size: 2,
  },
  {
    id: 3,
    size: 2,
  },
];

export const initShips = (): ShipFormation => {
  const _ships: ShipFormation = {};

  SHIPS.forEach((ship, index) => {
    _ships[index] = {
      ...ship,
      col: 0,
      row: index,
      position: SHIP_POSITION.HORIZONTAL,
    };
  });

  return _ships;
};

export enum SHIP_POSITION {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal",
}

export const ROWS = Array.from({ length: 10 });
export const COLUMNS = Array.from({ length: 10 });
export const LETTERS: Record<number, string> = {
  0: "",
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J",
};
