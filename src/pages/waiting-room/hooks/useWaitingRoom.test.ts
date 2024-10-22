import { renderHook, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import useWaitingRoom from "./useWaitingRoom";
import { useGameState } from "@/state/gameState";
import { MOCK_ROOM } from "@/tests/mocks";
import { useNavigate } from "@tanstack/react-router";
import { updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

describe("useWaitingRoom", () => {
  beforeAll(() => {
    vi.mock("@/state/gameState", () => ({
      useGameState: vi.fn(),
    }));
  });

  it("should show roomId, players, isRoomMaster, isGameStarted", () => {
    vi.mocked(useGameState).mockReturnValue({
      room: MOCK_ROOM,
      startGame: vi.fn(),
    });

    const { result } = renderHook(() => useWaitingRoom());

    const { players, roomId, isRoomMaster } = result.current;

    expect({
      players,
      roomId,
      isRoomMaster,
    }).toEqual({
      players: [MOCK_ROOM.player1, MOCK_ROOM.player2],
      roomId: MOCK_ROOM.id,
      isRoomMaster: false,
    });
  });

  describe("startGame", () => {
    it("should call startGame", () => {
      vi.mocked(useGameState).mockReturnValue({
        room: MOCK_ROOM,
        startGame: vi.fn(),
      });

      const { result } = renderHook(() => useWaitingRoom());

      result.current.startGame();

      expect(updateDoc).toHaveBeenCalled();
    });

    it("should show error", async () => {
      vi.mocked(updateDoc).mockRejectedValue("error");

      vi.mocked(useGameState).mockReturnValue({
        room: MOCK_ROOM,
        startGame: vi.fn(),
      });

      const { result } = renderHook(() => useWaitingRoom());

      result.current.startGame();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("failed_to_start_game");
      });
    });
  });

  it("should redirect to '/' if room.id is empty", () => {
    vi.mocked(useGameState).mockReturnValue({
      room: {
        id: "",
      },
      startGame: vi.fn(),
    });

    const navigate = vi.fn();

    vi.mocked(useNavigate).mockReturnValue(navigate);

    renderHook(() => useWaitingRoom());

    expect(navigate).toHaveBeenCalledWith({
      to: "/",
    });
  });

  it("should redirect to '/fleetFormation' if room is started", () => {
    vi.mocked(useGameState).mockReturnValue({
      room: {
        ...MOCK_ROOM,
        isStarted: true,
      },
      startGame: vi.fn(),
    });

    const navigate = vi.fn();

    vi.mocked(useNavigate).mockReturnValue(navigate);

    renderHook(() => useWaitingRoom());

    expect(navigate).toHaveBeenCalledWith({
      to: "/fleetFormation",
    });
  });
});
