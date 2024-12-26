import * as Styles from "@ijstech/style";
let Theme = Styles.Theme.ThemeVars;

const arrowBackgroundColor = "var(--tooltips-arrow-background, var(--background-modal))"
const borderColor = "var(--divider)"

Styles.cssRule("body", {
  $nest: {
    ".ii-tooltip": {
      position: "absolute",
      display: "inline-block",
      fontFamily: Theme.typography.fontFamily,
      backgroundColor: Theme.background.modal,
      borderRadius: "4px",
      color: Theme.text.primary,
      padding: "4px 8px",
      fontSize: "0.6875rem",
      maxWidth: "300px",
      overflowWrap: "break-word",
      fontWeight: 500,
      zIndex: 9999,
      border: `1px solid ${Theme.divider}`,
      filter: `drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.5))`
    },
    '.ii-tooltip-arrow': {
      position: "absolute",
      borderWidth: "7px",
      borderStyle: "solid",
      borderColor: `transparent transparent ${borderColor} transparent`,
    },
    '.ii-tooltip-arrow::after': {
      content: "''",
      position: "absolute",
      top: 2,
      left: 0,
      transform: 'translate(-50%, -50%)',
      borderWidth: "5px",
      borderStyle: "solid",
      borderColor: `transparent transparent ${arrowBackgroundColor} transparent`,
    },
    '.ii-tooltip-top .ii-tooltip-arrow': {
      top: "100%",
      left: "50%",
      transform: 'translateX(-50%)',
      borderColor: `${borderColor} transparent transparent transparent`,
      $nest: {
        '&::after': {
          top: -2,
          borderColor: `${arrowBackgroundColor} transparent transparent transparent`,
        }
      }
    },
    '.ii-tooltip-topLeft .ii-tooltip-arrow': {
      top: "100%",
      left: "10px",
      borderColor: `${borderColor} transparent transparent transparent`,
      $nest: {
        '&::after': {
          top: -2,
          borderColor: `${arrowBackgroundColor} transparent transparent transparent`,
        }
      }
    },
    '.ii-tooltip-topRight .ii-tooltip-arrow': {
      top: "100%",
      right: "10px",
      borderColor: `${borderColor} transparent transparent transparent`,
      $nest: {
        '&::after': {
          top: -2,
          borderColor: `${arrowBackgroundColor} transparent transparent transparent`,
        }
      }
    },
    '.ii-tooltip-left .ii-tooltip-arrow': {
      top: "50%",
      left: "100%",
      marginTop: "-5px",
      borderColor: `transparent transparent transparent ${borderColor}`,
      $nest: {
        '&::after': {
          left: -2,
          top: 0,
          borderColor: `transparent transparent transparent ${arrowBackgroundColor}`,
        }
      }
    },
    '.ii-tooltip-leftTop .ii-tooltip-arrow': {
      top: "0%",
      left: "100%",
      marginTop: "5px",
      borderColor: `transparent transparent transparent ${borderColor}`,
      $nest: {
        '&::after': {
          borderColor: `transparent transparent transparent ${arrowBackgroundColor}`,
        }
      }
    },
    '.ii-tooltip-leftBottom .ii-tooltip-arrow': {
      bottom: "0%",
      left: "100%",
      marginBottom: "5px",
      borderColor: `transparent transparent transparent ${borderColor}`,
      $nest: {
        '&::after': {
          borderColor: `transparent transparent transparent ${arrowBackgroundColor}`,
        }
      }
    },
    '.ii-tooltip-right .ii-tooltip-arrow': {
      top: "50%",
      right: "100%",
      marginTop: "-5px",
      borderColor: `transparent ${borderColor} transparent transparent`,
      $nest: {
        '&::after': {
          left: 2,
          top: 0,
          borderColor: `transparent ${arrowBackgroundColor} transparent transparent`,
        }
      }
    },
    '.ii-tooltip-rightTop .ii-tooltip-arrow': {
      top: "0%",
      right: "100%",
      marginTop: "5px",
      borderColor: `transparent ${borderColor} transparent transparent`,
      $nest: {
        '&::after': {
          left: 2,
          top: 0,
          borderColor: `transparent ${arrowBackgroundColor} transparent transparent`,
        }
      }
    },
    '.ii-tooltip-rightBottom .ii-tooltip-arrow': {
      bottom: "0%",
      right: "100%",
      marginBottom: "5px",
      borderColor: `transparent ${borderColor} transparent transparent`,
      $nest: {
        '&::after': {
          left: 2,
          top: 0,
          borderColor: `transparent ${arrowBackgroundColor} transparent transparent`,
        }
      }
    },
    '.ii-tooltip-bottom .ii-tooltip-arrow': {
      bottom: "100%",
      left: "50%",
      transform: 'translateX(-50%)',
      borderColor: `transparent transparent ${borderColor} transparent`,
      $nest: {
        '&::after': {
          borderColor: `transparent transparent ${arrowBackgroundColor} transparent`,
        }
      }
    },
    '.ii-tooltip-bottomLeft .ii-tooltip-arrow': {
      bottom: "100%",
      left: "10px",
      borderColor: `transparent transparent ${borderColor} transparent`,
      $nest: {
        '&::after': {
          borderColor: `transparent transparent ${arrowBackgroundColor} transparent`,
        }
      }
    },
    '.ii-tooltip-bottomRight .ii-tooltip-arrow': {
      bottom: "100%",
      right: "10px",
      borderColor: `transparent transparent ${borderColor} transparent`,
      $nest: {
        '&::after': {
          borderColor: `transparent transparent ${arrowBackgroundColor} transparent`,
        }
      }
    }
  },
});
