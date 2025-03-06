import { createTheme, alpha } from "@mui/material/styles";
import type { TypographyOptions } from "@mui/material/styles/createTypography";


// Helper function for generating hover/focus shadows with a given color
const getShadow = (color: string) => `0 0 0 2px ${alpha(color, 0.4)}`;

const uniquePalette = {
  primary: {
    main: "#00796B", // Deep Teal
    light: "#48A999", // Lighter Teal
    dark: "#004D40", // Dark Teal
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#FFC107", // Amber
    light: "#FFD54F", // Light Amber
    dark: "#FFA000", // Dark Amber
    contrastText: "#000000", // Black text on amber
  },
  background: {
    default: "#FAFAFA", // Off-white, slightly warmer than pure white
    paper: "#FFFFFF",
  },
  text: {
    primary: "#212121", // Very dark grey, almost black.  Better contrast than #333
    secondary: "#757575", // Medium grey
    disabled: "#BDBDBD",
  },
  error: {
    main: "#D32F2F",
    light: "#EF5350",
    dark: "#C62828",
    contrastText: "#fff",
  },
  warning: {
    main: "#F57C00", // Darker Orange
    light: "#FF9800",
    dark: "#E65100",
    contrastText: "#fff",
  },
  info: {
    main: "#1976D2", // Material Blue (kept from your original, it's good!)
    light: "#42A5F5",
    dark: "#1565C0",
    contrastText: "#fff",
  },
  success: {
    main: "#388E3C", // Darker Green
    light: "#4CAF50",
    dark: "#1B5E20",
    contrastText: "#fff",
  },
  tonalOffset: 0.2, // Standard Material Design tonal offset
};

const uniqueTypography: TypographyOptions = {
  fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif", // Added Inter as primary font
  h1: {
    fontWeight: 700, // Bolder for headings
    fontSize: "3.5rem", // Slightly larger
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
    fontSize: "1.875rem", // Slightly larger than before
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
    fontSize: "1.125rem", // Slightly larger subtitle
    lineHeight: 1.75,
  },
  subtitle2: {
    fontSize: "1rem", // Standard size, more readable than 0.875
    fontWeight: 500,
    lineHeight: 1.6,
  },
  body1: {
    fontSize: "1.125rem", // Slightly larger body text for improved readability.
    lineHeight: 1.6,   // Increased line-height a bit.
  },
  body2: {
    fontSize: "1rem", // Standard size
    lineHeight: 1.5,
  },
  button: {
    textTransform: "none",
    fontWeight: 600, // Slightly bolder buttons
    fontSize: "1.05rem", //Slightly Larger
  },
  caption: {
    fontSize: "0.875rem",  //  standard size.
    lineHeight: 1.66,
  },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 700, // Very bold overline
    letterSpacing: "0.15em", // More letter spacing
    lineHeight: 2.66,
    textTransform: "uppercase",
  },
};


export const theme = createTheme({
  palette: uniquePalette,
  typography: uniqueTypography,
  shape: {
    borderRadius: 10, 
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
      },
      styleOverrides: {
        root: {
          padding: "0.8rem 1.75rem",
          borderRadius: "0.5rem",
          transition: "background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: uniquePalette.primary.dark,
            color: uniquePalette.primary.contrastText,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
          },
        },
        containedPrimary: {
          color: uniquePalette.primary.contrastText,
        },
        containedSecondary: {
          color: uniquePalette.secondary.contrastText,
        },
        outlined: { // style the outlined variant
          "&:hover": {
            backgroundColor: alpha(uniquePalette.primary.main, 0.04), // Very subtle background on hover
            borderColor: uniquePalette.primary.main, 
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            "0px 4px 8px rgba(0, 0, 0, 0.05)", // Subtler shadow
          transition: "box-shadow 0.3s ease-in-out", // Smooth shadow transition
          "&:hover": {
            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)", // Slightly stronger shadow on hover
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "outlined", // Use outlined variant by default
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
            transition: "box-shadow 0.2s ease-in-out",
            "&:hover": {
              boxShadow: getShadow(uniquePalette.primary.light),
            },
            "&.Mui-focused": {
              boxShadow: getShadow(uniquePalette.primary.main),
            },
            "& fieldset": {
              borderWidth: "2px",
              borderColor: uniquePalette.text.secondary, // Use a defined text color for the border
            },
            "&:hover fieldset": {  //  fieldset border on hover
              borderColor: uniquePalette.primary.main, // Highlight border on hover
            },
            "&.Mui-focused fieldset": { // fieldset border when focused
              borderColor: uniquePalette.primary.main, // Keep border consistent when focused
            },
            "&.Mui-error fieldset": { // Error state for fieldset
              borderColor: uniquePalette.error.main,
          },

          },
          // Style the input itself (remove the default blue on webkit)
          "& .MuiInputBase-input": {
            "&:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0 100px ${uniquePalette.background.paper} inset`, // Remove blue autofill
              WebkitTextFillColor: uniquePalette.text.primary,
            },
          }
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: uniquePalette.primary.main, // Consistent focus color for labels
          },
           "&.Mui-error": {  //error state for Input Label
              color: uniquePalette.error.main,
          },
        },
      },
    },
    MuiPaper: { // Add styles for Paper component
      styleOverrides: {
        root: {
          backgroundImage: "none", // Remove default gradient
        },
        elevation1: { // Custom, subtle elevation
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)'
        }
      }
    },
     MuiAlert: { // Styling the Alert component
      styleOverrides: {
        root: {
          borderRadius: "0.5rem", // Consistent with other components
          padding: "0.75rem 1.25rem",
          "& .MuiAlert-icon": {
             fontSize: '1.25rem', // Make icons slightly larger
             marginRight: '1rem'
          },
        },
        standardSuccess: { // Success variant
          backgroundColor: alpha(uniquePalette.success.main, 0.15),
          color: uniquePalette.success.dark,
        },
        standardError: {
          backgroundColor: alpha(uniquePalette.error.main, 0.15),
          color: uniquePalette.error.dark,
        },
        standardWarning: {
          backgroundColor: alpha(uniquePalette.warning.main, 0.15),
          color: uniquePalette.warning.dark,
        },
        standardInfo: {
          backgroundColor: alpha(uniquePalette.info.main, 0.15),
          color: uniquePalette.info.dark,
        },
        filledSuccess: {
          color: uniquePalette.success.contrastText,
        },
        filledError: {
          color: uniquePalette.error.contrastText,
        },
        filledWarning: {
           color: uniquePalette.warning.contrastText,
        },
        filledInfo: {
          color: uniquePalette.info.contrastText,
        },
      },
    },
    MuiLink: {  // Styles for links
      defaultProps:{
        underline: 'hover' // Only underline links on hover
      },
      styleOverrides: {
        root: {
          fontWeight: 600, // Make links stand out a bit more
          color: uniquePalette.info.main, // Use info color for links
          transition: 'color 0.2s ease-in-out',
          '&:hover': {
            color: uniquePalette.info.dark, // Darken on hover
          }
        }
      }
    },
    MuiChip: { // Styles for Chip component
      styleOverrides: {
        root: {
          borderRadius: "0.25rem", // Smaller radius for chips
          fontWeight: 600,
        },
        filled: {
            "&.MuiChip-colorPrimary": {
                backgroundColor: uniquePalette.primary.light,
                color: uniquePalette.primary.contrastText,
            },
            "&.MuiChip-colorSecondary": {
                backgroundColor: uniquePalette.secondary.light,
                 color: uniquePalette.secondary.contrastText,
            }
        }
      }
    },
    MuiTooltip: {  // Style the tooltip
      styleOverrides: {
        tooltip: {
          backgroundColor: uniquePalette.text.primary, // Dark background
          color: uniquePalette.background.paper,
          fontSize: "0.875rem",
          padding: "0.5rem 0.75rem",
        },
        arrow: {
          color: uniquePalette.text.primary, // Match arrow color to tooltip
        },
      },
    },
    MuiList: { // Style the Lists
      styleOverrides:{
        root:{
          paddingTop: 0, // Remove default padding
          paddingBottom: 0,
        }
      }
    },
    MuiListItemButton:{ // style the list item buttons
      styleOverrides:{
        root:{
          '&:hover':{
            backgroundColor: alpha(uniquePalette.primary.main, 0.08)
          }
        }
      }
    },
      MuiListItemIcon: { // Style list item icons
        styleOverrides: {
          root:{
            minWidth: '36px', // Reduce spacing
            color: uniquePalette.text.secondary // Use secondary text color
          }
        }
      },
       MuiListItemText:{ // Style list item text
        styleOverrides: {
          primary: {
            fontSize: "1rem",
            fontWeight: 500,
          },
          secondary: {
            fontSize: "0.875rem",
          }
        }
      },
      MuiTable:{ // Styles the table
        styleOverrides:{
          root: {
            borderRadius: '0.5rem',
            overflow: 'hidden', // Ensures rounded corners are visible
            borderCollapse: 'separate', // Use separate borders for cleaner styling
            borderSpacing: 0,
          }
        }
      },
      MuiTableCell: { // Styles table cells
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${alpha(uniquePalette.text.secondary, 0.2)}`, // Subtle border
            padding: '1rem',
            '&:last-child': { // Remove border from the last cell in a row
              borderRight: 'none',
            },
          },
          head: {
            backgroundColor: uniquePalette.background.default,
            fontWeight: 600,
            color: uniquePalette.text.primary,
          },
        }
      },
       MuiTableRow: { // Styles Table rows
          styleOverrides:{
              root:{
                   '&:nth-of-type(odd):not(:hover)': { // Apply to odd rows, *except* on hover
                        backgroundColor: alpha(uniquePalette.primary.main, 0.04)
                   },
                  '&:hover': {
                        backgroundColor: alpha(uniquePalette.primary.main, 0.08)
                  }
              }
          }
       },

      MuiDialog:{
          styleOverrides: {
              paper: {
                  borderRadius: 16, // More rounded dialogs
                  padding: '1rem', // Some padding inside the dialog
			  }
			  }
	      },
		}})	