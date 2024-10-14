import { Room } from "../interfaces";

export const getRoomStatus = (room: Room) => {
  const isCreated = !!room.id;
  const isOver = !!room.isOver;
  const isStarted = !!room.isStarted;
  const fleetsAreReady =
    Object.keys(room.player1.fleetFormation).length > 0 &&
    Object.keys(room.player2.fleetFormation).length > 0;

  return {
    isCreated,
    isOver,
    isStarted,
    fleetsAreReady,
  };
};
