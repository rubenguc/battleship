import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Game from "./Game";
import useGame from "./hooks/useGame";
import { initShips } from "@/constants";
import { MOCK_PLAYER2_MOVES } from "@/tests/mocks";

vi.mock("./hooks/useGame");


describe("Game", () => {
  const defaultUseGameMock = {
    moves: [],
    placedShips: initShips(),
    rivalMoves: MOCK_PLAYER2_MOVES,
    onSelectCell: vi.fn(),
    canMakeMove: true,
    winner: "",
    exit: vi.fn(),
    isPlayerTurn: true,
  };

  const mockUseGame = (overrides = {}) => {
    vi.mocked(useGame).mockReturnValue({
      ...defaultUseGameMock,
      ...overrides,
    });
  };

  beforeEach(() => {
    mockUseGame();
  });

  it("should render", () => {
    const { container } = render(<Game />);

    expect(container).toBeDefined();
  });


  it("should show player1's turn", () => {
    mockUseGame({ isPlayerTurn: true });
    const { getByTestId } = render(<Game />);
    const winner = getByTestId("player-turn");
    expect(winner.innerHTML).toBe("your_turn");
  });

  it("should show player1's turn", () => {
    mockUseGame({ isPlayerTurn: false });
    const { getByTestId } = render(<Game />);
    const winner = getByTestId("player-turn");
    expect(winner.innerHTML).toBe("opponent_turn");
  });

  it("should show player1 as winner", () => {
    mockUseGame({ winner: "player1" });
    const { getByTestId } = render(<Game />);
    const winner = getByTestId("winner");
    expect(winner.innerHTML).toBe("player1");
  });

  it("should show player2 as winner", () => {
    mockUseGame({ winner: "player2" });
    const { getByTestId } = render(<Game />);
    const winner = getByTestId("winner");
    expect(winner.innerHTML).toBe("player2");
  });
});
