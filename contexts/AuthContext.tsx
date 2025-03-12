import { useContext, createContext, useEffect, useState } from "react";
import { UserInfo, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/auth";

export const AuthContext = createContext<{
  user: UserInfo | null;
  loading: boolean;
  role: string | null;
}>({
  user: null,
  loading: true,
  role: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setUser(user);
      const idTokenResult = await user?.getIdTokenResult();
      const authRole = idTokenResult?.claims?.role as string | undefined
      if (authRole) {
        setRole(authRole);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, loading, role }}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
}
