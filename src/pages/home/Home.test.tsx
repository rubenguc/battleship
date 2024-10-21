import { fireEvent, render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import Home from "./Home";
import { useAuthContext } from "@/providers/AuthProvider";

const useHomeMocks = {
  onCreateGame: vi.fn(),
  onLogin: vi.fn(),
  onLogout: vi.fn(),
};

describe("Home", () => {
  beforeAll(() => {
    vi.mock("./hooks", () => ({
      useHome: vi.fn().mockReturnValue({
        onCreateGame: () => useHomeMocks.onCreateGame(),
        onLogin: () => useHomeMocks.onLogin(),
        onLogout: () => useHomeMocks.onLogout(),
      }),
    }));
  });

  it("it should render", () => {
    const { container } = render(<Home />);

    expect(container).toBeDefined();
  });

  it("it should show logged options", () => {
    const { getByTestId } = render(<Home />);

    const buttonsContainer = getByTestId("logged-buttons");

    expect(buttonsContainer).toBeDefined();
  });

  it("it should call onCreateGame", () => {
    const { getByText } = render(<Home />);

    const createGameButton = getByText("create_game");

    fireEvent.click(createGameButton);

    expect(useHomeMocks.onCreateGame).toHaveBeenCalled();
  });

  it("it should call onLogout", () => {
    const { getByText } = render(<Home />);

    const logOutGameButton = getByText("logout");

    fireEvent.click(logOutGameButton);

    expect(useHomeMocks.onLogout).toHaveBeenCalled();
  });

  it("it should show login buttons", () => {
    // @ts-expect-error --- only field needed
    vi.mocked(useAuthContext).mockReturnValue(() => ({
      userIsLogged: false,
    }));

    const { getByTestId } = render(<Home />);

    const buttonsContainer = getByTestId("login-buttons");

    expect(buttonsContainer).toBeDefined();
  });

  describe("should call onLogin", () => {
    it("google login", () => {
      const { getByTestId } = render(<Home />);

      const buttonsContainer = getByTestId("login-buttons");

      const loginButton = buttonsContainer.children[0];

      fireEvent.click(loginButton);

      expect(useHomeMocks.onLogin).toBeDefined();
    });

    it("github login", () => {
      const { getByTestId } = render(<Home />);

      const buttonsContainer = getByTestId("login-buttons");

      const loginButton = buttonsContainer.children[1];

      fireEvent.click(loginButton);

      expect(useHomeMocks.onLogin).toBeDefined();
    });
  });
});
