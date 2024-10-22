import { beforeAll, describe, expect, it, vi } from "vitest";
import { auth } from "../services/firebase";
import { MOCK_AUTH_USER_SNAPSHOT } from "../tests/mocks";
import { AuthProvider, useAuthContext } from "./AuthProvider";
import { render, waitFor } from "@testing-library/react";

const MOCK_COMPONENT = () => {
  const { user, userIsLogged } = useAuthContext();

  return (
    <>
      <p data-testid="user">{JSON.stringify(user)}</p>
      <p data-testid="userIsLogged">{`${userIsLogged}`}</p>
    </>
  );
};

describe("AuthProvider", () => {
  beforeAll(() => {
    vi.unmock("./AuthProvider")
  })

  it("should render", () => {
    const { getByTestId } = render(
      <AuthProvider>
        <MOCK_COMPONENT />
      </AuthProvider>
    );

    const user = getByTestId("user");
    const userIsLogged = getByTestId("userIsLogged");

    expect(user.innerHTML).toEqual(
      JSON.stringify({
        id: "",
        name: "",
        photoURL: "",
      })
    );

    expect(userIsLogged.innerHTML).toBe("false");
  });

  it("should without change user", async () => {
    vi.spyOn(auth, "onAuthStateChanged").mockImplementation((callback) => {
      // @ts-expect-error --- mock
      callback(MOCK_AUTH_USER_SNAPSHOT);
      return vi.fn();
    });

    const { getByTestId } = render(
      <AuthProvider>
        <MOCK_COMPONENT />
      </AuthProvider>
    );

    const user = getByTestId("user");
    const userIsLogged = getByTestId("userIsLogged");

    await waitFor(() => {
      expect(user.innerHTML).toEqual(
        JSON.stringify({
          id: MOCK_AUTH_USER_SNAPSHOT.uid,
          name: MOCK_AUTH_USER_SNAPSHOT.displayName,
          photoURL: MOCK_AUTH_USER_SNAPSHOT.photoURL,
        })
      );

      expect(userIsLogged.innerHTML).toBe("true");
    });
  });
});
