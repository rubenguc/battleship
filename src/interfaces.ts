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
}

export interface Player {
  id: string;
  data: {
    name: string;
    image: string;
  };
  moves: number[];
  fleeFormation: any[];
}
