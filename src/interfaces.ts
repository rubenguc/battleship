export interface User {
  id: string;
  name: string;
  photoURL: string;
}

export interface Room {
  turn: number;
  player1: Player;
  player2: Player;
  playerTurn: string;
  isOver: boolean;
  id: string;
  roomMasterId: string;
  isStarted: boolean;
  winner: string;
}

export interface Player {
  id: string;
  data: {
    name: string;
    image: string;
  };
  isFleetReady: boolean;
  moves: Move[];
  fleetFormation: ShipFormation;
}

export interface Move {
  cell: string;
  result: "hit" | "miss";
}

export interface Ship {
  id: number;
  size: number;
}

export interface ShipInPosition extends Ship {
  col: number;
  row: number;
}

export interface ShipFormation {
  [key: number]: ShipInPosition;
}
