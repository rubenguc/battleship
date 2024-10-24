import { useAuthContext } from "@/providers/AuthProvider";
import { useGameState } from "@/state/gameState";
import { MOCK_PLAYER1 } from "@/tests/mocks";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import useFleetFormation from "./useFleetFormation";
import { updateDoc } from "firebase/firestore";
import { DragEndEvent } from "@dnd-kit/core";
import { SHIPS } from "@/constants";
import { act } from "react";

describe("useFleetFormation", () => {
  beforeAll(() => {
    vi.mock("@/state/gameState", () => ({
      useGameState: vi.fn().mockReturnValue({
        room: {},
      }),
    }));
  });

  describe("user is master", () => {
    beforeEach(() => {
      vi.mocked(useAuthContext).mockReturnValue({
        user: {
          id: MOCK_PLAYER1.id!,
          name: MOCK_PLAYER1.data!.name,
          photoURL: MOCK_PLAYER1.data!.image!,
        },
        userIsLogged: true,
      });
    });

    it("should return playerIsReady = true and otherPlayerIsReady = true", () => {
      vi.mocked(useGameState).mockReturnValue({
        room: {
          roomMasterId: MOCK_PLAYER1.id,
          player1: {
            isFleetReady: true,
          },
          player2: {
            isFleetReady: true,
          },
        },
      });

      const { result } = renderHook(() => useFleetFormation());

      const { playerIsReady, otherPlayerIsReady } = result.current;

      expect(playerIsReady).toBe(true);
      expect(otherPlayerIsReady).toBe(true);
    });

    it("should return playerIsReady = true and otherPlayerIsReady = false", () => {
      vi.mocked(useGameState).mockReturnValue({
        room: {
          roomMasterId: MOCK_PLAYER1.id,
          player1: {
            isFleetReady: true,
          },
          player2: {
            isFleetReady: false,
          },
        },
      });

      const { result } = renderHook(() => useFleetFormation());

      const { playerIsReady, otherPlayerIsReady } = result.current;

      expect(playerIsReady).toBe(true);
      expect(otherPlayerIsReady).toBe(false);
    });

    it("should return playerIsReady = false", () => {
      vi.mocked(useGameState).mockReturnValue({
        room: {
          roomMasterId: MOCK_PLAYER1.id,
          player1: {
            isFleetReady: false,
          },
          player2: {
            isFleetReady: false,
          },
        },
      });

      const { result } = renderHook(() => useFleetFormation());

      const { playerIsReady } = result.current;

      expect(playerIsReady).toBe(false);
    });

    it("should call sendFleetFormation", () => {
      const { result } = renderHook(() => useFleetFormation());

      result.current.sendFleetFormation();

      expect(updateDoc).toHaveBeenCalled();
    });
  });

  describe("handleDragEnd", () => {
    it("should call setPlacedShips", async () => {
      const { result } = renderHook(() => useFleetFormation());

      let _result: null | undefined = null;

      act(() => {
        _result = result.current.handleDragEnd({
          active: {
            id: SHIPS[1].id,
          },
          over: {
            id: "5-5",
          },
        } as DragEndEvent);
      });

      await waitFor(() => {
        expect(_result).not.toBe(null);
      });
    });

    it("should rotate due isSamePlace validation", async () => {
      const { result } = renderHook(() => useFleetFormation());

      let _result: null | undefined = null;

      act(() => {
        _result = result.current.handleDragEnd({
          active: {
            id: Number(SHIPS[2].id) - 1,
          },
          over: {
            id: "2-0",
          },
        } as DragEndEvent);
      });

      await waitFor(() => {
        expect(_result).not.toBe(null);
      });
    });

    it("should return null due isInsideGrid validation", async () => {
      const { result } = renderHook(() => useFleetFormation());

      let _result: null | undefined = null;

      act(() => {
        _result = result.current.handleDragEnd({
          active: {
            id: SHIPS[1].id,
          },
          over: {
            id: "5-10",
          },
        } as DragEndEvent);
      });

      await waitFor(() => {
        expect(_result).toBe(null);
      });
    });

    it("should return null due canPlaceShip validation", async () => {
      const { result } = renderHook(() => useFleetFormation());

      let _result: null | undefined = null;

      act(() => {
        _result = result.current.handleDragEnd({
          active: {
            id: SHIPS[1].id,
          },
          over: {
            id: "0-2",
          },
        } as DragEndEvent);
      });

      await waitFor(() => {
        expect(_result).toBe(null);
      });
    });
  });
});
