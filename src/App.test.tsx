import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
import { MOCK_AUTH_USER_SNAPSHOT } from "./tests/mocks";

describe("App", () => {
  it("should render", async () => {
    const { container } = render(<App />);

    await waitFor(() => {
      expect(container).toBeDefined();
    });
  });

  it("should show logged user in header", async () => {
    const { getByTestId } = render(<App />);

    const loggedUser = getByTestId("logged-user");

    await waitFor(() => {
      const userName = loggedUser.children[1];

      expect(userName.innerHTML).toBe(MOCK_AUTH_USER_SNAPSHOT.displayName);
    });
  });
});
