import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface UnlockContextType {
  isUnlocked: boolean;
  setUnlocked: (value: boolean) => void;
}

const UnlockContext = createContext<UnlockContextType | undefined>(undefined);

export function UnlockProvider({ children }: { children: ReactNode }) {
  const [manualUnlock, setUnlocked] = useState(false);
  const { user, isAdmin } = useAuth();

  const isUnlocked = manualUnlock || user?.email === "fedhatevin@gmail.com" || isAdmin;

  return (
    <UnlockContext.Provider value={{ isUnlocked, setUnlocked }}>
      {children}
    </UnlockContext.Provider>
  );
}

export function useUnlock() {
  const context = useContext(UnlockContext);
  if (context === undefined) {
    throw new Error("useUnlock must be used within an UnlockProvider");
  }
  return context;
}
