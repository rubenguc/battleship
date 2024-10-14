import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Room } from "../interfaces";

export const DEFAULT_ROOM: Room = {
  turn: 0,
  roomMasterId: "",
  player1: {
    isFleetReady: false,
    id: "",
    data: {
      image: "",
      name: "",
    },
    fleeFormation: [],
    moves: [],
  },
  player2: {
    isFleetReady: false,
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
  isStarted: false,
  winner: "",
};

interface createRoom {
  id: string;
  roomMasterId?: string;
}

interface GameState {
  room: Room;
  setRoomId: (data: createRoom) => void;
  updateRoom: (room: Room) => void;
  startGame: () => void;
  clear: () => void;
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
      startGame: () =>
        set((state) => ({
          room: {
            ...state.room,
            isStarted: true,
          },
        })),
      updateRoom: (room) =>
        set((state) => ({
          room: {
            ...state.room,
            ...room,
          },
        })),
      clear: () =>
        set(() => ({
          room: DEFAULT_ROOM,
        })),
    }),
    {
      name: "battleship",
    }
  )
);
