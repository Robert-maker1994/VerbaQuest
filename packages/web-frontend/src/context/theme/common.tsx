import { type ThemeOptions, alpha } from "@mui/material";
import type { TypographyOptions } from "@mui/material/styles/createTypography";
const FONT_FAMILY = "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif";
export const getShadow = (color: string) => `0 0 0 2px ${alpha(color, 0.4)}`;

export const createColorPalette = (primaryColor: string, secondaryColor: string) => {
  const palette = {
    primary: {
      main: primaryColor,
      light: alpha(primaryColor, 0.7),
      dark: alpha(primaryColor, 0.9),
      contrastText: getContrastText(primaryColor),
    },
    secondary: {
      main: secondaryColor,
      light: alpha(secondaryColor, 0.7),
      dark: alpha(secondaryColor, 0.9),
      contrastText: getContrastText(secondaryColor),
    },
  };
  return palette;
};

export const getContrastText = (color: string) => {
  const hexColor = color.replace("#", "");
  const r = Number.parseInt(hexColor.substring(0, 2), 16);
  const g = Number.parseInt(hexColor.substring(2, 4), 16);
  const b = Number.parseInt(hexColor.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

const uniqueTypography: TypographyOptions = {
  fontFamily: FONT_FAMILY,
  h1: {
    fontWeight: 700,
    fontSize: "3.5rem",
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },
  h2: {
    fontWeight: 700,
    fontSize: "2.75rem",
    letterSpacing: "-0.015em",
    lineHeight: 1.25,
  },
  h3: {
    fontWeight: 700,
    fontSize: "2.25rem",
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
  },
  h4: {
    fontWeight: 600,
    fontSize: "1.875rem",
    letterSpacing: "-0.005em",
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: "1.5rem",
    letterSpacing: "-0.005em",
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 600,
    fontSize: "1.25rem",
    letterSpacing: "0em",
    lineHeight: 1.6,
  },
  subtitle1: {
    fontSize: "1.125rem",
    lineHeight: 1.75,
  },
  subtitle2: {
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: 1.6,
  },
  body1: {
    fontSize: "1.125rem",
    lineHeight: 1.6,
  },
  body2: {
    fontSize: "1rem",
    lineHeight: 1.5,
  },
  button: {
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1.05rem",
  },
  caption: {
    fontSize: "0.875rem",
    lineHeight: 1.66,
  },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    lineHeight: 2.66,
    textTransform: "uppercase",
  },
};

export const commonOptions: ThemeOptions = {
  typography: uniqueTypography,
  shape: {
    borderRadius: 10,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
};
