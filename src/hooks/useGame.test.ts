import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useGame from "./useGame";
import { onSnapshot } from "firebase/firestore";
import { MOCK_ROOM } from "@/tests/mocks";
import { DEFAULT_ROOM } from "@/state/gameState";

const MOCK_updateRoom = vi.fn();

describe("useGame", () => {
  vi.mock("@/state/gameState", async () => {
    const actual = await vi.importActual("@/state/gameState");

    return {
      ...actual,
      useGameState: vi.fn().mockReturnValue({
        room: {
          id: "123",
        },
        updateRoom: (params: unknown) => MOCK_updateRoom(params),
      }),
    };
  });

  it("should set room", async () => {
    vi.mocked(onSnapshot).mockImplementation(
      //@ts-expect-error --- *
      (_, cb: (snapshot: unknown) => void) => {
        const querySnapshot = {
          data: () => MOCK_ROOM,
        };

        cb(querySnapshot);

        return () => {};
      }
    );

    renderHook(() => useGame());

    await waitFor(() => {
      expect(MOCK_updateRoom).toHaveBeenCalledWith(MOCK_ROOM);
    });
  });

  it("should set default room", async () => {
    vi.mocked(onSnapshot).mockImplementation(
      //@ts-expect-error --- *
      (_, cb: (snapshot: unknown) => void) => {
        const querySnapshot = {
          data: () => null,
        };

        cb(querySnapshot);

        return () => {};
      }
    );

    renderHook(() => useGame());

    await waitFor(() => {
      expect(MOCK_updateRoom).toHaveBeenCalledWith(DEFAULT_ROOM);
    });
  });
});
