import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Room } from "../interfaces";

export const DEFAULT_ROOM: Room = {
  turn: 0,
  roomMasterId: "",
  player1: {
    id: "",
    data: {
      image: "",
      name: "",
    },
    fleeFormation: [],
    moves: [],
  },
  player2: {
    id: "",
    data: {
      image: "",
      name: "",
    },
    fleeFormation: [],
    moves: [],
  },
  isOver: false,
  playerTurn: "",
  id: "",
};

interface createRoom {
  id: string;
  roomMasterId?: string;
}

interface GameState {
  room: Room;
  setRoomId: (data: createRoom) => void;
  updateRoom: (room: Room) => void;
}

export const useGameState = create<GameState>()(
  persist(
    (set) => ({
      room: DEFAULT_ROOM,
      setRoomId: (data) =>
        set((state) => ({
          room: {
            ...state.room,
            ...data,
          },
        })),
      updateRoom: (room) =>
        set((state) => ({
          room: {
            ...state.room,
            ...room,
          },
        })),
    }),
    {
      name: "battleship",
    }
  )
);
