import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExitButton from "./ExitButton";
import { deleteDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const clickConfirmButton = (
  container: HTMLElement,
  getByTestId: (id: string) => HTMLElement
) => {
  fireEvent.click(container.children[0]);
  const confirmButton = getByTestId("confirm-button");
  fireEvent.click(confirmButton);
};

describe("ExitButton", () => {
  describe("isRoomMaster = true", () => {
    it("should render", () => {
      const { container } = render(<ExitButton isRoomMaster={true} />);

      expect(container.innerHTML).contains("close_room");
    });

    it("should call onExit", async () => {
      const { container, getByTestId } = render(
        <ExitButton isRoomMaster={true} />
      );

      clickConfirmButton(container, getByTestId);

      await waitFor(() => {
        expect(deleteDoc).toHaveBeenCalled();
      });
    });

    it("should show error", async () => {
      vi.mocked(deleteDoc).mockRejectedValue("error");

      const { container, getByTestId } = render(
        <ExitButton isRoomMaster={true} />
      );

      clickConfirmButton(container, getByTestId);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("failed_to_exit");
      });
    });
  });

  describe("isRoomMaster = false", () => {
    it("should render with", () => {
      const { container } = render(<ExitButton isRoomMaster={false} />);

      expect(container.innerHTML).contains("exit");
    });

    it("should call onExit", async () => {
      const { container, getByTestId } = render(
        <ExitButton isRoomMaster={false} />
      );

      clickConfirmButton(container, getByTestId);

      await waitFor(() => {
        expect(updateDoc).toHaveBeenCalled();
      });
    });
  });
});
