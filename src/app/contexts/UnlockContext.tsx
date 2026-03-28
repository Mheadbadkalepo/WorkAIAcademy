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
  consult20Paid: boolean;
  consult30Paid: boolean;
  consult60Paid: boolean;
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
  const [dbConsult20, setDbConsult20] = useState(false);
  const [dbConsult30, setDbConsult30] = useState(false);
  const [dbConsult60, setDbConsult60] = useState(false);
  const { user, isAdmin } = useAuth();

  const refreshUnlocks = useCallback(async () => {
    if (!user) {
      setDbUnlock(false);
      setDbLowGuides(false);
      setDbHighGuides(false);
      setDbConsult20(false);
      setDbConsult30(false);
      setDbConsult60(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_access")
      .select(
        "platform_unlocked, low_guides_unlocked, high_guides_unlocked, consult_20_paid, consult_30_paid, consult_60_paid",
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Failed to fetch user access:", error.message);
      return;
    }

    setDbUnlock(Boolean(data?.platform_unlocked));
    setDbLowGuides(Boolean(data?.low_guides_unlocked));
    setDbHighGuides(Boolean(data?.high_guides_unlocked));
    setDbConsult20(Boolean(data?.consult_20_paid));
    setDbConsult30(Boolean(data?.consult_30_paid));
    setDbConsult60(Boolean(data?.consult_60_paid));
  }, [user]);

  useEffect(() => {
    refreshUnlocks();
  }, [refreshUnlocks]);

  const isUnlocked = manualUnlock || dbUnlock || user?.email === "fedhatevin@gmail.com" || isAdmin;
  const lowGuidesUnlocked = isAdmin || manualLowGuides || dbLowGuides;
  const highGuidesUnlocked = isAdmin || manualHighGuides || dbHighGuides;
  const consult20Paid = isAdmin || dbConsult20;
  const consult30Paid = isAdmin || dbConsult30;
  const consult60Paid = isAdmin || dbConsult60;

  return (
    <UnlockContext.Provider value={{
      isUnlocked,
      setUnlocked,
      lowGuidesUnlocked,
      setLowGuidesUnlocked,
      highGuidesUnlocked,
      setHighGuidesUnlocked,
      consult20Paid,
      consult30Paid,
      consult60Paid,
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
