import { vi } from "vitest";
import { mockAnimationsApi } from "jsdom-testing-mocks";

mockAnimationsApi();

vi.mock("firebase/app", () => {
  return {
    initializeApp: vi.fn(() => ({})),
  };
});

vi.mock("firebase/auth", () => {
  return {
    getAuth: vi.fn(() => ({
      currentUser: null,
      onAuthStateChanged: vi.fn((callback) => {
        callback({});
        return vi.fn();
      }),
    })),
    GithubAuthProvider: vi.fn().mockReturnValue({
      PROVIDER_ID: "google.com",
    }),
    GoogleAuthProvider: vi.fn().mockReturnValue({
      PROVIDER_ID: "google.com",
    }),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock("firebase/firestore", () => {
  return {
    arrayUnion: vi.fn(),
    getFirestore: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    getDoc: vi.fn(() => ({})),
    updateDoc: vi.fn(() => ({})),
    setDoc: vi.fn(() => ({})),
    deleteDoc: vi.fn(() => ({})),
    onSnapshot: vi.fn(() => ({})),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");

  return {
    ...actual,
    useNavigate: vi.fn().mockImplementation(() => vi.fn()),
  };
});

vi.mock("react-hot-toast", async () => {
  const actual = await vi.importActual("react-hot-toast");

  return {
    ...actual,
    default: {
      error: vi.fn(),
      loading: vi.fn(),
      dismiss: vi.fn(),
      success: vi.fn(),
    },
  };
});

vi.mock("@/providers/AuthProvider", async () => {
  const { MOCK_AUTH_USER_SNAPSHOT } = (await vi.importActual(
    "./tests/mocks"
  )) as {
    MOCK_AUTH_USER_SNAPSHOT: {
      uid: string;
      displayName: string;
      photoURL: string;
    };
  };
  const provider = await vi.importActual("@/providers/AuthProvider");

  return {
    ...provider,
    useAuthContext: vi.fn().mockReturnValue({
      user: {
        id: MOCK_AUTH_USER_SNAPSHOT.uid,
        name: MOCK_AUTH_USER_SNAPSHOT.displayName,
        photoURL: MOCK_AUTH_USER_SNAPSHOT.photoURL,
      },
      userIsLogged: true,
    }),
  };
});
