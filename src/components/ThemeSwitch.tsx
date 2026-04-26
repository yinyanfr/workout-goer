import { useCallback } from "react";

const THEME_KEY = "wg-theme";

export type Theme = "light" | "dark";

export function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* noop */
  }
  return "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* noop */
  }
}

interface Props {
  theme: Theme;
  onChange: (t: Theme) => void;
}

export default function ThemeSwitch({ theme, onChange }: Props) {
  const toggle = useCallback(() => {
    onChange(theme === "dark" ? "light" : "dark");
  }, [theme, onChange]);

  return (
    <button
      type="button"
      onClick={toggle}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: 16,
        padding: "4px 6px",
        borderRadius: 6,
        lineHeight: 1,
        color: "inherit",
        opacity: 0.7,
      }}
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
