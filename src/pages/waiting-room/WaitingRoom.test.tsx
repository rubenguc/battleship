import { fireEvent, render, waitFor } from "@testing-library/react";
import {
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import WaitingRoom from "./WaitingRoom";
import { useCopyToClipboard } from "react-use";
import toast from "react-hot-toast";
import { MOCK_ROOM } from "@/tests/mocks";
import { Player, Room } from "@/interfaces";
import useWaitingRoom from "./hooks/useWaitingRoom";

const startGame = vi.fn();

describe("WaitingRoom", () => {
  beforeAll(() => {
    vi.mock("react-use", async () => {
      const actual = await vi.importActual("react-use");

      return {
        ...actual,
        useCopyToClipboard: vi.fn().mockReturnValue([{}, vi.fn()]),
      };
    });

    vi.mock("./hooks/useWaitingRoom", async () => {
      const { MOCK_ROOM } = (await vi.importActual("@/tests/mocks")) as {
        MOCK_ROOM: Room;
      };

      return {
        default: vi.fn().mockReturnValue({
          roomId: MOCK_ROOM.id,
          players: [MOCK_ROOM.player1, MOCK_ROOM.player2],
          isRoomMaster: true,
          startGame: () => startGame(),
          canStartGame: true,
        }),
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render", () => {
    const { container } = render(<WaitingRoom />);
    expect(container).toBeDefined();
  });

  it("should copy room code", () => {
    const copyToClipboard = vi.fn();

    vi.mocked(useCopyToClipboard).mockReturnValue([
      // @ts-expect-error --- mock
      {},
      copyToClipboard,
    ]);

    const { getByTestId } = render(<WaitingRoom />);

    const copyButton = getByTestId("copy-code");

    fireEvent.click(copyButton);

    expect(copyToClipboard).toBeCalledWith(MOCK_ROOM.id);
  });

  it("should call startGame", async () => {
    const copyToClipboard = vi.fn();

    vi.mocked(useCopyToClipboard).mockReturnValue([
      // @ts-expect-error --- mock
      {},
      copyToClipboard,
    ]);

    const { getByTestId } = render(<WaitingRoom />);

    const startGameButton = getByTestId("start-game-button");

    fireEvent.click(startGameButton);

    await waitFor(() => {
      expect(startGame).toHaveBeenCalled();
    });
  });

  it("should hide start game button for player 2", () => {
    vi.mocked(useWaitingRoom).mockReturnValue({
      roomId: MOCK_ROOM.id as string,
      players: [MOCK_ROOM.player1 as Player, MOCK_ROOM.player2 as Player],
      isRoomMaster: false,
      startGame: () => startGame(),
      canStartGame: false,
    });

    try {
      const { getByTestId } = render(<WaitingRoom />);

      const startGameButton = getByTestId("start-game-button");

      expect(startGameButton).not.toBeDefined();
    } catch (error) {
      expect(String(error)).contains("Unable to find an element");
    }
  });

  it("should show toast error", async () => {
    vi.mocked(useCopyToClipboard).mockReturnValue([
      // @ts-expect-error --- mock
      { error: { name: "error", message: "error" } },
      vi.fn(),
    ]);

    render(<WaitingRoom />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("failed_to_copy_code");
    });
  });

  it("should show room code copied", async () => {
    vi.mocked(useCopyToClipboard).mockReturnValue([
      // @ts-expect-error --- mock
      { value: MOCK_ROOM.id },
      vi.fn(),
    ]);

    render(<WaitingRoom />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("room_code_copied");
    });
  });
});
