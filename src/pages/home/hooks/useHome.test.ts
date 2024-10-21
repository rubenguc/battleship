import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useHome from "./useHome";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { setDoc } from "firebase/firestore";

describe("useHome", () => {
  describe("onLogin", () => {
    it("it should call onLogin", () => {
      const { result } = renderHook(() => useHome());

      result.current.onLogin(GoogleAuthProvider.PROVIDER_ID);

      expect(signInWithPopup).toHaveBeenCalled();
    });

    it("it should show error", async () => {
      vi.mocked(signInWithPopup).mockRejectedValue("error");

      const { result } = renderHook(() => useHome());

      result.current.onLogin(GoogleAuthProvider.PROVIDER_ID);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("failed_to_login");
      });
    });
  });

  describe("onLogout", () => {
    it("it should call onLogout", () => {
      const { result } = renderHook(() => useHome());

      result.current.onLogout();

      expect(signOut).toHaveBeenCalled();
    });

    it("it should show error", async () => {
      vi.mocked(signOut).mockRejectedValue("error");

      const { result } = renderHook(() => useHome());

      result.current.onLogout();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("failed_to_logout");
      });
    });
  });

  describe("onCreateGame", () => {
    it("it should call onCreateGame", async () => {
      const { result } = renderHook(() => useHome());

      result.current.onCreateGame();

      await waitFor(() => {
        expect(setDoc).toHaveBeenCalled();
      });
    });

    it("it should show error", async () => {
      vi.mocked(setDoc).mockRejectedValue("error");

      const { result } = renderHook(() => useHome());

      result.current.onCreateGame();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("failed_to_create_game");
      });
    });
  });
});
