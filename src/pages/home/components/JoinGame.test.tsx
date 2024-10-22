import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import JoinGame from "./JoinGame";
import { getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const MOCK_CODE = "12345";

const clickFooterButton = ({ getByText, getByTestId }: RenderResult) => {
  const button = getByText("join_game");

  fireEvent.click(button);

  const input = getByTestId("code-input");

  fireEvent.change(input, {
    target: {
      value: MOCK_CODE,
    },
  });

  const footerButton = getByText("search_room");

  fireEvent.click(footerButton);
};

describe("JoinGame", () => {
  it("should render", () => {
    const { container } = render(<JoinGame />);

    expect(container).toBeDefined();
  });

  it("should search game", async () => {
    const updateDocMock = vi.mocked(updateDoc).mockResolvedValue();

    vi.mocked(getDoc).mockResolvedValue({
      // @ts-expect-error --- * mock
      exists: vi.fn().mockReturnValue(true),
      data: vi.fn().mockReturnValue({
        player2: {
          id: "",
        },
        isOver: false,
      }),
    });

    const result = render(<JoinGame />);

    clickFooterButton(result)

    await waitFor(() => {
      expect(updateDocMock).toHaveBeenCalled();
    });
  });

  it("should show error if room doesn't exist", async () => {
    vi.spyOn(toast, "error");

    vi.mocked(getDoc).mockResolvedValue({
      // @ts-expect-error --- * mock
      exists: vi.fn().mockReturnValue(false),
    });

    const result = render(<JoinGame />);

    clickFooterButton(result);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("room_dont_exist");
    });
  });

  it("should show error if room already has player 2", async () => {
    vi.spyOn(toast, "error");

    vi.mocked(getDoc).mockResolvedValue({
      // @ts-expect-error --- * mock
      exists: vi.fn().mockReturnValue(true),
      data: vi.fn().mockReturnValue({
        player2: {
          id: "12345",
        },
        isOver: false,
      }),
    });

    const result = render(<JoinGame />);

    clickFooterButton(result);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("room_is_full");
    });
  });

  it("should show error if room already ended", async () => {
    vi.spyOn(toast, "error");

    vi.mocked(getDoc).mockResolvedValue({
      // @ts-expect-error --- * mock
      exists: vi.fn().mockReturnValue(true),
      data: vi.fn().mockReturnValue({
        player2: {
          id: "",
        },
        isOver: true,
      }),
    });

    const result = render(<JoinGame />);

    clickFooterButton(result);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("room_already_ended");
    });
  });

  it("should show generic error", async () => {
    vi.spyOn(toast, "error");

    vi.mocked(getDoc).mockRejectedValue("");

    const result = render(<JoinGame />);

    clickFooterButton(result);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("failed_to_find_room");
    });
  });
});
