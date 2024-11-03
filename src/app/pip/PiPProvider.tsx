import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

type PiPContextType = {
  isSupported: boolean;
  pipWindow: Window | null;
  requestPipWindow: (width: number, height: number) => Promise<void>;
  closePipWindow: () => void;
};

const PiPContext = createContext<PiPContextType | undefined>(undefined);

type PiPProviderProps = {
  children: React.ReactNode;
};

export function PiPProvider({ children }: PiPProviderProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  useEffect(() => {
    // Check if the feature is available in the client-side environment
    if (typeof window !== "undefined") {
      setIsSupported("documentPictureInPicture" in window);
    }
  }, []);

  const closePipWindow = useCallback(() => {
    if (pipWindow != null) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  const requestPipWindow = useCallback(
    async (width: number, height: number) => {
      if (pipWindow != null || !isSupported) {
        return;
      }

      const pip = await window.documentPictureInPicture.requestWindow({
        width,
        height,
      });

      pip.addEventListener("pagehide", () => {
        setPipWindow(null);
      });

      [...document.styleSheets].forEach((styleSheet) => {
        try {
          const cssRules = [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join("");
          const style = document.createElement("style");

          style.textContent = cssRules;
          pip.document.head.appendChild(style);
        } catch (e) {
          const link = document.createElement("link");
          if (styleSheet.href == null) {
            return;
          }

          link.rel = "stylesheet";
          link.type = styleSheet.type;
          link.media = styleSheet.media.toString();
          link.href = styleSheet.href;
          pip.document.head.appendChild(link);
        }
      });

      setPipWindow(pip);
    },
    [pipWindow, isSupported]
  );

  const value = useMemo(() => {
    return {
      isSupported,
      pipWindow,
      requestPipWindow,
      closePipWindow,
    };
  }, [closePipWindow, isSupported, pipWindow, requestPipWindow]);

  return <PiPContext.Provider value={value}>{children}</PiPContext.Provider>;
}

export function usePiPWindow(): PiPContextType {
  const context = useContext(PiPContext);

  if (context === undefined) {
    throw new Error("usePiPWindow must be used within a PiPContext");
  }

  return context;
}
