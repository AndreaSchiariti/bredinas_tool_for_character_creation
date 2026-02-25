import { useEffect, useState, type JSX } from "react";

function changeTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

function getPreferences(): "light" | "dark" {
  const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

  if (savedTheme) {
    return savedTheme;
  } else {
    const prefersDarkTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDarkTheme ? "dark" : "light";
  }
}

export function ThemeToggleButton(): JSX.Element {
  const [theme, setTheme] = useState<"light" | "dark">(getPreferences());

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  function onToggleTheme(): void {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }

  return <button onClick={onToggleTheme} className="temp-button">{`to ${theme === "light" ? "Dark" : "Light"}`}</button>;
}
