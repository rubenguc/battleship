import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../services/firebase";
import { User } from "../interfaces";

const authContext = createContext({} as {
  user: User;
  userIsLogged: boolean
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    photoURL: ""
  });

  const userIsLogged = useMemo(() => user.id !== "", [user])

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged((snapshot) => {
      setUser({
        id: String(snapshot?.uid || ""),
        name: snapshot?.displayName as string | "",
        photoURL: snapshot?.photoURL as string | ""
      });
    });
    return subscriber
  }, []);

  return <authContext.Provider value={{ user, userIsLogged }}>{children}</authContext.Provider>;
};

export const useAuthContext = () => useContext(authContext)