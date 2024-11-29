import * as Styles from "@ijstech/style";
let Theme = Styles.Theme.ThemeVars;

Styles.cssRule("i-switch", {
  display: "block",
  fontFamily: Theme.typography.fontFamily,
  fontSize: Theme.typography.fontSize,

  $nest: {
    ".wrapper": {
      width: "100%",
      height: "100%",
      position: "relative",
      display: "inline-flex",
      flexShrink: 0,
      overflow: "hidden",
      zIndex: 0,
      verticalAlign: "middle",
      borderRadius: 'inherit'
    },

    ".switch-base": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "start",
      outline: 0,
      border: 0,
      margin: 0,
      cursor: "pointer",
      userSelect: "none",
      verticalAlign: "middle",
      textDecoration: "none",
      padding: "1px",
      borderRadius: "50%",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 1,
      width: '50%',
      height: '100%',
      color: "#fff",
      transition: "left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, justify-content 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",

      $nest: {
        "&.checked": {
          transform: "translateX(100%)",
          // justifyContent: 'flex-end',

          $nest: {
            ".thumb:before": {
              backgroundImage: "var(--checked-background)",
            },
            ".thumb-text:before": {
              content: "var(--thumb-checked-text)",
            },

            "+.track": {
              backgroundColor: "#1976d2",

              $nest: {
                "&::before": {
                  opacity: 1,
                },
                "&::after": {
                  opacity: 0,
                },
              },
            },
          },
        },
      },
    },

    input: {
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      opacity: 0,
      margin: 0,
      padding: 0,
      cursor: "inherit",
      zIndex: 1,
    },

    ".thumb": {
      width: "16px",
      height: "16px",
      margin: "2px",
      backgroundColor: "currentColor",
      borderRadius: "50%",
      boxShadow: "none",
    },

    ".thumb:before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "14px",
      backgroundImage: "var(--background)",
    },
    ".thumb.thumb-text:before": {
      content: "var(--thumb-text)",
      position: "absolute",
      width: "inherit",
      height: "inherit",
      top: 'auto',
      left: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
    },

    ".track": {
      width: "100%",
      height: "100%",
      zIndex: -1,
      backgroundColor: "#000",
      transition:
        "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",

      $nest: {
        "&::before": {
          content: "var(--checked-text)",
          position: "absolute",
          left: "4px",
          top: "calc(50% - 0.6px)",
          transform: "translateY(-50%)",
          fontSize: "10px",
          color: "white",
          opacity: 0,
        },
        "&::after": {
          content: "var(--text)",
          position: "absolute",
          right: "6px",
          top: "calc(50% - 0.6px)",
          transform: "translateY(-50%)",
          fontSize: "10px",
          color: "white",
          opacity: 1,
        },
      },
    },
  },
});
