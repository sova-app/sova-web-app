import { useContext, createContext, useEffect, useState } from "react";
import { UserInfo, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/auth";

export const AuthContext = createContext<{
  user: UserInfo | null;
  loading: boolean;
}>({
  user: null,
  loading: true,

});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, loading }}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
}
