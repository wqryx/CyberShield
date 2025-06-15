import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  userId?: number | null;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  resetTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "cybershield-ui-theme",
  userId = null,
  ...props
}: ThemeProviderProps) {
  // Create user-specific storage key
  const userStorageKey = userId ? `${storageKey}-user-${userId}` : storageKey;
  
  const [theme, setTheme] = useState<Theme>(() => {
    // If no user is logged in, always use light theme
    if (!userId) {
      return "light";
    }
    // For logged in users, check their saved preference
    return (localStorage.getItem(userStorageKey) as Theme) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Reset theme when user changes
  useEffect(() => {
    if (!userId) {
      // No user logged in, force light theme
      setTheme("light");
      // Clean up any old theme data
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add("light");
    } else {
      // User logged in, load their preference or default to light
      const savedTheme = localStorage.getItem(userStorageKey) as Theme;
      setTheme(savedTheme || "light");
    }
  }, [userId, userStorageKey]);

  const resetTheme = () => {
    if (userId) {
      localStorage.removeItem(userStorageKey);
    }
    setTheme("light");
  };

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (userId) {
        localStorage.setItem(userStorageKey, theme);
      }
      setTheme(theme);
    },
    resetTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
