import React, { createContext, useReducer, useEffect } from "react";

const ThemeContext = createContext();

const themeReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_THEME":
      return state === "dark" ? "light" : "dark";
    case "SET_THEME":
      return action.payload;
    default:
      return state;
  }
};

const ThemeProvider = ({ children }) => {
  const [theme, dispatch] = useReducer(themeReducer, "light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    dispatch({ type: "SET_THEME", payload: savedTheme });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };