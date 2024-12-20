import { Move, Player, Room } from "@/interfaces";

export const MOCK_AUTH_USER_SNAPSHOT = {
  uid: "123",
  displayName: "Mock user",
  photoURL: "photo",
};

export const MOCK_PLAYER1: Partial<Player> = {
  id: "player-1",
  data: {
    image: "image-1",
    name: "player 1",
  },
};

export const MOCK_PLAYER2: Partial<Player> = {
  id: "player-2",
  data: {
    image: "image-2",
    name: "player 2",
  },
};

export const MOCK_ROOM: Partial<Room> = {
  id: "123",
  player1: MOCK_PLAYER1 as Player,
  player2: MOCK_PLAYER2 as Player,
  roomMasterId: MOCK_PLAYER1.id,
  isStarted: false,
};

export const MOCK_PLAYER1_MOVES: Move[] = [{ cell: "0-0", result: "hit" }];
export const MOCK_PLAYER2_MOVES: Move[] = [{ cell: "5-5", result: "miss" }];

export const MOCK_WINNER_MOVES = [
  {
    cell: "0-0",
    result: "hit",
  },
  {
    cell: "0-1",
    result: "hit",
  },
  {
    cell: "0-2",
    result: "hit",
  },
  {
    cell: "1-0",
    result: "hit",
  },
  {
    cell: "1-1",
    result: "hit",
  },
  {
    cell: "2-0",
    result: "hit",
  },
  {
    cell: "2-1",
    result: "hit",
  },
];
