import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../../lib/supabase";

interface UnlockContextType {
  isUnlocked: boolean;
  setUnlocked: (value: boolean) => void;
  lowGuidesUnlocked: boolean;
  setLowGuidesUnlocked: (value: boolean) => void;
  highGuidesUnlocked: boolean;
  setHighGuidesUnlocked: (value: boolean) => void;
  refreshUnlocks: () => Promise<void>;
}

const UnlockContext = createContext<UnlockContextType | undefined>(undefined);

export function UnlockProvider({ children }: { children: ReactNode }) {
  const [manualUnlock, setUnlocked] = useState(false);
  const [manualLowGuides, setLowGuidesUnlocked] = useState(false);
  const [manualHighGuides, setHighGuidesUnlocked] = useState(false);
  const [dbUnlock, setDbUnlock] = useState(false);
  const [dbLowGuides, setDbLowGuides] = useState(false);
  const [dbHighGuides, setDbHighGuides] = useState(false);
  const { user, isAdmin } = useAuth();

  const refreshUnlocks = useCallback(async () => {
    if (!user) {
      setDbUnlock(false);
      setDbLowGuides(false);
      setDbHighGuides(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_access")
      .select("platform_unlocked, low_guides_unlocked, high_guides_unlocked")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch user access:", error.message);
      return;
    }

    setDbUnlock(Boolean(data?.platform_unlocked));
    setDbLowGuides(Boolean(data?.low_guides_unlocked));
    setDbHighGuides(Boolean(data?.high_guides_unlocked));
  }, [user]);

  useEffect(() => {
    refreshUnlocks();
  }, [refreshUnlocks]);

  const isUnlocked = manualUnlock || dbUnlock || user?.email === "fedhatevin@gmail.com" || isAdmin;
  const lowGuidesUnlocked = isAdmin || manualLowGuides || dbLowGuides;
  const highGuidesUnlocked = isAdmin || manualHighGuides || dbHighGuides;

  return (
    <UnlockContext.Provider value={{
      isUnlocked,
      setUnlocked,
      lowGuidesUnlocked,
      setLowGuidesUnlocked,
      highGuidesUnlocked,
      setHighGuidesUnlocked,
      refreshUnlocks,
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
