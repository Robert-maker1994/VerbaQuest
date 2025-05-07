import { useContext } from "react";
import { ThemeContext, type ThemeContextType } from "./themeContext";

const useTheme = () => useContext<ThemeContextType>(ThemeContext);

export { useTheme };
