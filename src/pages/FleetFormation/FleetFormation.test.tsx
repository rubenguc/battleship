import { fireEvent, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FleetFormation } from ".";
import toast from "react-hot-toast";
import useFleetFormation from "./hooks/useFleetFormation";
import { useNavigate } from "@tanstack/react-router";

const sendFleetFormation = vi.fn()

describe("FleetFormation", () => {

  beforeEach(() => {
    vi.mock("./hooks/useFleetFormation", () => ({
      default: vi.fn().mockReturnValue({
        handleDragEnd: vi.fn(),
        sendFleetFormation: () => sendFleetFormation(),
        placedShips: {},
        playerIsReady: false,
        otherPlayerIsReady: false
      })
    }));
  })

  it("should render", () => {
    const { container } = render(<FleetFormation />);

    expect(container).toBeDefined();
  });

  it("should call sendFleetFormation", async () => {
    const { getByTestId } = render(<FleetFormation />);

    const sendButton = getByTestId("button-with-modal")

    fireEvent.click(sendButton);

    const confirmButton = getByTestId("confirm-button")

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(sendFleetFormation).toHaveBeenCalled()
    });

  })

  it("should call toast.loading", async () => {
    vi.mocked(useFleetFormation).mockReturnValue({
      handleDragEnd: vi.fn(),
      sendFleetFormation: vi.fn(),
      placedShips: {},
      playerIsReady: true,
      otherPlayerIsReady: false
    })

    render(<FleetFormation />);

    await waitFor(() => {
      expect(toast.loading).toHaveBeenCalledWith("waiting_for_other_player")
    })

  })

  it('should redirect to /game', () => {
    const navigate = vi.fn();

    vi.mocked(useNavigate).mockReturnValue(navigate);

    vi.mocked(useFleetFormation).mockReturnValue({
      handleDragEnd: vi.fn(),
      sendFleetFormation: vi.fn(),
      placedShips: {},
      playerIsReady: true,
      otherPlayerIsReady: true
    })

    render(<FleetFormation />);

    expect(navigate).toHaveBeenCalledWith({
      to: '/game'
    })
  })
});
