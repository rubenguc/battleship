import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GithubLoginButton from "./GithubLoginButton";
import GoogleLoginButton from "./GoogleLoginButton";

const MOCK_ON_CLICK = vi.fn();

describe("GithubLoginButton", () => {
  it("it should render", () => {
    const { getByText } = render(<GithubLoginButton onClick={MOCK_ON_CLICK} />);

    const text = getByText("login_with_github");

    expect(text.innerHTML).toEqual("login_with_github");
  });

  it("it should call onClick method", async () => {
    const component = render(<GithubLoginButton onClick={MOCK_ON_CLICK} />);

    const button = await component.findByRole("button");

    fireEvent.click(button);

    expect(MOCK_ON_CLICK).toHaveBeenCalled();
  });
});


describe("GoogleLoginButton", () => {
  it("it should render", () => {
    const { getByText } = render(<GoogleLoginButton onClick={MOCK_ON_CLICK} />);

    const text = getByText("login_with_google");

    expect(text.innerHTML).toEqual("login_with_google");
  });

  it("it should call onClick method", async () => {
    const component = render(<GoogleLoginButton onClick={MOCK_ON_CLICK} />);

    const button = await component.findByRole("button");

    fireEvent.click(button);

    expect(MOCK_ON_CLICK).toHaveBeenCalled();
  });
});
