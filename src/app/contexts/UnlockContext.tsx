import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface UnlockContextType {
  isUnlocked: boolean;
  setUnlocked: (value: boolean) => void;
  lowGuidesUnlocked: boolean;
  setLowGuidesUnlocked: (value: boolean) => void;
  highGuidesUnlocked: boolean;
  setHighGuidesUnlocked: (value: boolean) => void;
}

const UnlockContext = createContext<UnlockContextType | undefined>(undefined);

export function UnlockProvider({ children }: { children: ReactNode }) {
  const [manualUnlock, setUnlocked] = useState(false);
  const [manualLowGuides, setLowGuidesUnlocked] = useState(false);
  const [manualHighGuides, setHighGuidesUnlocked] = useState(false);
  const { user, isAdmin } = useAuth();

  const isUnlocked = manualUnlock || user?.email === "fedhatevin@gmail.com" || isAdmin;
  const lowGuidesUnlocked = isAdmin || manualLowGuides;
  const highGuidesUnlocked = isAdmin || manualHighGuides;

  return (
    <UnlockContext.Provider value={{
      isUnlocked,
      setUnlocked,
      lowGuidesUnlocked,
      setLowGuidesUnlocked,
      highGuidesUnlocked,
      setHighGuidesUnlocked,
    }}>
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
