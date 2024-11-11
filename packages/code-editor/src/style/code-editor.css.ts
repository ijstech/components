import * as Styles from "@ijstech/style";

Styles.cssRule("i-code-editor", {
  $nest: {
    "*": {
      boxSizing: "border-box",
    },
    ".full-height": {
      height: "100vh",
    },
    ".half-width": {
      width: "50%",
    },
    ".column": {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
    },
    ".row": {
      display: "flex",
      flexDirection: "row",
    },
    ".align-right": {
      /* align-self: stretch; */
      marginLeft: "auto",
      alignSelf: "stretch",
    },

    /* Editors */
    "#flex-wrapper": {
      display: "flex",
      alignItems: "stretch",
    },
    "#operation-editor": {
      height: "60vh",
      minHeight: "260px",
    },
    "#variables-editor": {
      height: "30vh",
      alignItems: "stretch",
    },
    "#results-editor": {
      height: "90vh",
      alignItems: "stretch",
    },

    /* Toolbar */
    "#toolbar": {
      minHeight: "40px",
      backgroundColor: "#1e1e1e",
      display: "inline-flex",
      alignItems: "stretch",
    },
    "#toolbar > button, #toolbar > select, #toolbar > span, button#execute-op": {
      margin: "4px",
      padding: "4px",
    },
    "#toolbar button, #toolbar select": {
      backgroundColor: "#1e1e1e",
      color: "#eee",
      border: "1px solid #eee",
      borderRadius: "4px",
    },
    "#toolbar button:hover, i-code-editor #toolbar select:hover, i-code-editor #toolbar button:focus, i-code-editor #toolbar select:focus": {
      backgroundColor: "darkslategrey",
    },
    "#execution-tray": {
      // display: "flex",
      display: "inline-flex",
      alignItems: "baseline",
    },
    "#schema-status": {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#eee",
    },
    "#toolbar button.reload-button": {
      border: "0 none",
      padding: "4px",
      width: "30px",
      textAlign: "center",
    },
  },
});
