import React, { useContext } from "react";
import { FaRegMoon, FaMoon } from "react-icons/fa6";
import { ThemeContext } from "./context/ContextTheme";

const ThemeToggle = () => {
  const { theme, dispatch } = useContext(ThemeContext);

  return (
    <button
      onClick={() => dispatch({ type: "TOGGLE_THEME" })}
      className="flex items-center space-x-2"
    >
      {theme === "dark" ? (
        <>
          <FaRegMoon size={20} />
          <span className="font-semibold">Lightmode</span>
        </>
      ) : (
        <>
          <FaMoon size={20} />
          <span className="font-semibold">Darkmode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
