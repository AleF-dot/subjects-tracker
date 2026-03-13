import React from 'react';
import { createContext, useContext, useState, useEffect } from "react";

// daltonType: "none" | "deuteranopia" | "protanopia" | "tritanopia" | "achromatopsia"
const ThemeContext = createContext({ dark: false, toggle: () => {}, daltonType: "none", setDaltonType: () => {} });

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [daltonType, setDaltonTypeState] = useState(() => localStorage.getItem("daltonType") || "none");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    document.documentElement.setAttribute("data-dalton", daltonType);
    localStorage.setItem("daltonType", daltonType);
  }, [daltonType]);

  const setDaltonType = (type) => setDaltonTypeState(type);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d), daltonType, setDaltonType }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
