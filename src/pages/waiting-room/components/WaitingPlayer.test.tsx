import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WaitingPlayer from "./WaitingPlayer";
import { MOCK_PLAYER1 } from "@/tests/mocks";
import { Player } from "@/interfaces";

describe("WaitingPlater", () => {
  it("should render", () => {
    const { container } = render(
      <WaitingPlayer {...(MOCK_PLAYER1 as Player)} />
    );

    expect(container.innerHTML).contains(MOCK_PLAYER1.data?.image);
    expect(container.innerHTML).contains(MOCK_PLAYER1.data?.name);
  });

  it("should render null", () => {
    const { container } = render(
      <WaitingPlayer
        {...({ id: "", data: { image: "", name: "" } } as Player)}
      />
    );

    expect(container.innerHTML).toBe("");
  });
});
