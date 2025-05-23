import { useEffect, useState } from "react";
import ToggleSlider from "../ToggleSlider";
import styles from "./ThemeToggle.module.css";

const THEME_KEY = "theme-preference";

function getSystemTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="5" fill="#FFD600" />
      <g stroke="#FFD600" strokeWidth="1.5">
        <line x1="10" y1="2" x2="10" y2="0.5" />
        <line x1="10" y1="18" x2="10" y2="19.5" />
        <line x1="2" y1="10" x2="0.5" y2="10" />
        <line x1="18" y1="10" x2="19.5" y2="10" />
        <line x1="15.07" y1="4.93" x2="16.13" y2="3.87" />
        <line x1="4.93" y1="15.07" x2="3.87" y2="16.13" />
        <line x1="4.93" y1="4.93" x2="3.87" y2="3.87" />
        <line x1="15.07" y1="15.07" x2="16.13" y2="16.13" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 13.5C13.5 15.5 10.5 15.5 8.5 13.5C6.5 11.5 6.5 8.5 8.5 6.5C9.5 5.5 10.5 5 11.5 5C10.5 7 11.5 9.5 13.5 11.5C14.5 12.5 15.5 13 15.5 13.5Z" fill="#FFD600" stroke="#FFD600" strokeWidth="1.5" />
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(THEME_KEY);
    setTheme(saved || getSystemTheme());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  if (!mounted) return null;

  return (
    <div className={styles.themeToggleWrapper}>
      <span className={styles.icon}>{theme === "dark" ? <MoonIcon /> : <SunIcon />}</span>
      <ToggleSlider
        checked={theme === "dark"}
        onChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
    </div>
  );
} 