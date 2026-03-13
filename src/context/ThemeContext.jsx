import React from 'react';
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({ dark: false, toggle: () => {}, dalton: false, toggleDalton: () => {} });

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [dalton, setDalton] = useState(() => localStorage.getItem("dalton") === "true");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    document.documentElement.setAttribute("data-dalton", dalton ? "true" : "false");
    localStorage.setItem("dalton", dalton ? "true" : "false");
  }, [dalton]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d), dalton, toggleDalton: () => setDalton(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
