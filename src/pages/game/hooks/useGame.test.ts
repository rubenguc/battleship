import { initShips } from "@/constants";
import { useAuthContext } from "@/providers/AuthProvider";
import { useGameState } from "@/state/gameState";
import {
  MOCK_PLAYER1,
  MOCK_PLAYER1_MOVES,
  MOCK_PLAYER2,
  MOCK_PLAYER2_MOVES,
  MOCK_WINNER_MOVES,
} from "@/tests/mocks";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import useGame from "./useGame";
import { arrayUnion, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

describe("useGame", () => {
  beforeAll(() => {
    vi.mock("@/state/gameState", () => ({
      useGameState: vi.fn().mockReturnValue({
        room: {},
      }),
    }));
  });

  describe("User is master", () => {
    beforeEach(() => {
      vi.mocked(useAuthContext).mockReturnValue({
        user: {
          id: MOCK_PLAYER1.id!,
          name: MOCK_PLAYER1.data!.name,
          photoURL: MOCK_PLAYER1.data!.image!,
        },
        userIsLogged: true,
      });

      vi.mocked(useGameState).mockReturnValue({
        room: {
          id: "1",
          player1: {
            fleetFormation: initShips(),
            moves: MOCK_PLAYER1_MOVES,
          },
          player2: {
            fleetFormation: initShips(),
            moves: MOCK_PLAYER2_MOVES,
          },
          playerTurn: "player1",
          roomMasterId: MOCK_PLAYER1.id,
        },
        clear: vi.fn(),
      });
    });

    it("should return placedShips, moves and rival moves", () => {
      const { result } = renderHook(() => useGame());

      const { placedShips, moves, rivalMoves } = result.current;

      expect(moves).toEqual(MOCK_PLAYER1_MOVES);
      expect(placedShips).toEqual(initShips());
      expect(rivalMoves).toEqual(MOCK_PLAYER2_MOVES);
    });

    it("should return isPlayer and canMakeMove as true", () => {
      const { result } = renderHook(() => useGame());

      const { isPlayerTurn, canMakeMove } = result.current;

      expect(isPlayerTurn).toBe(true);
      expect(canMakeMove).toBe(true);
    });

    it("should return isPlayer and canMakeMove as false", () => {
      vi.mocked(useGameState).mockReturnValue({
        room: {
          id: "1",
          player1: {
            fleetFormation: initShips(),
            moves: MOCK_PLAYER1_MOVES,
          },
          player2: {
            fleetFormation: initShips(),
            moves: MOCK_PLAYER2_MOVES,
          },
          playerTurn: "player1",
          roomMasterId: MOCK_PLAYER2.id,
        },
        clear: vi.fn(),
      });

      const { result } = renderHook(() => useGame());

      const { isPlayerTurn, canMakeMove } = result.current;

      expect(isPlayerTurn).toBe(false);
      expect(canMakeMove).toBe(false);
    });

    it("should call onSelectCell with hit result", async () => {
      const { result } = renderHook(() => useGame());

      await act(() => result.current.onSelectCell("0-1"));

      await waitFor(() => {
        expect(arrayUnion).toHaveBeenCalledWith({
          cell: "0-1",
          result: "hit",
        });
      });
    });

    it("should call onSelectCell with miss result", async () => {
      const { result } = renderHook(() => useGame());

      await act(() => result.current.onSelectCell("5-5"));

      await waitFor(() => {
        expect(arrayUnion).toHaveBeenCalledWith({
          cell: "5-5",
          result: "miss",
        });
      });
    });

    it("should show error calling onSelectCell ", async () => {
      vi.mocked(updateDoc).mockRejectedValue("error");

      const { result } = renderHook(() => useGame());

      await act(() => result.current.onSelectCell("5-5"));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("failed_selecting_cell");
      });
    });

    it("should call on exit", async () => {
      const navigate = vi.fn();

      vi.mocked(useNavigate).mockReturnValue(navigate);

      const { result } = renderHook(() => useGame());

      result.current.exit();

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith({
          to: "/",
        });
      });
    });

    describe("winner user", () => {
      it("winner user should be player1", async () => {
        // @ts-expect-error -- mock
        vi.mocked(updateDoc).mockReturnValue();

        vi.mocked(useGameState).mockReturnValue({
          room: {
            id: "1",
            player1: {
              fleetFormation: initShips(),
              moves: MOCK_WINNER_MOVES,
            },
            player2: {
              fleetFormation: initShips(),
              moves: MOCK_PLAYER2_MOVES,
            },
            playerTurn: "player1",
            roomMasterId: MOCK_PLAYER2.id,
          },
          clear: vi.fn(),
        });

        renderHook(() => useGame());

        await waitFor(() => {
          expect(updateDoc).toHaveBeenCalledWith(
            {},
            {
              isOver: true,
              winner: "player1",
            }
          );
        });
      });

      it("winner user should be player2", async () => {
        // @ts-expect-error -- mock
        vi.mocked(updateDoc).mockReturnValue({});

        vi.mocked(useGameState).mockReturnValue({
          room: {
            id: "1",
            player1: {
              fleetFormation: initShips(),
              moves: MOCK_PLAYER1_MOVES,
            },
            player2: {
              fleetFormation: initShips(),
              moves: MOCK_WINNER_MOVES,
            },
            playerTurn: "player2",
            roomMasterId: MOCK_PLAYER1.id,
          },
          clear: vi.fn(),
        });

        renderHook(() => useGame());

        await waitFor(() => {
          expect(updateDoc).toHaveBeenCalledWith(
            {},
            {
              isOver: true,
              winner: "player2",
            }
          );
        });
      });

      it("should throw error updating winner", async () => {
        vi.mocked(updateDoc).mockRejectedValue("error");

        vi.mocked(useGameState).mockReturnValue({
          room: {
            id: "1",
            player1: {
              fleetFormation: initShips(),
              moves: MOCK_PLAYER1_MOVES,
            },
            player2: {
              fleetFormation: initShips(),
              moves: MOCK_WINNER_MOVES,
            },
            playerTurn: "player2",
            roomMasterId: MOCK_PLAYER1.id,
          },
          clear: vi.fn(),
        });

        vi.mocked(updateDoc).mockRejectedValue("error");

        renderHook(() => useGame());

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith(
            "failed_to_determine_winner"
          );
        });
      });
    });
  });
});
