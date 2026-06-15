

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type IntroContextValue = {
  ready: boolean;
  completeIntro: () => void;
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const completeIntro = useCallback(() => setReady(true), []);

  const value = useMemo(() => ({ ready, completeIntro }), [ready, completeIntro]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntroReady() {
  const ctx = useContext(IntroContext);
  return ctx?.ready ?? true;
}

export function useIntroComplete() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntroComplete must be used within IntroProvider");
  return ctx.completeIntro;
}
