import * as Styles from "@ijstech/style";
let Theme = Styles.Theme.ThemeVars;
export let ItemListStyle = Styles.style({
  display: 'none',
  position: 'absolute',
  margin: "0.05rem 0 0",
  backgroundColor: "#fff",
  border: "1px solid rgba(0,0,0,.15)",
  borderRadius: "0.25rem",
  zIndex: "99999",  
  $nest: {
    "> ul": {
      maxHeight: "100px",
      overflowY: "scroll",
      overflowX: "hidden",
      listStyle: "none",
      margin: 0,
      padding: 0,
      borderRadius: 'inherit'
    },
    "> ul > li": {
      display: "block",
      width: "100%",
      padding: "0.25rem 0.5rem",
      backgroundColor: "transparent",
      wordBreak: 'break-word',
      // whiteSpace: "nowrap",
      // textOverflow: "ellipsis",
      cursor: "pointer",
      borderRadius: 'inherit'
    },
    "> ul > li .highlight": {
      backgroundColor: Theme.colors.warning.light,
    },
    "> ul > li.matched": {
      backgroundColor: Theme.colors.primary.light,
    },
    "> ul > li:hover": {
      backgroundColor: Theme.colors.primary.light,
    },
    '.selection-item': {
      display: 'grid',
      gridTemplateColumns: '25px 1fr',
      gap: 5,
      alignItems: 'center',
      fontFamily: Theme.typography.fontFamily
    },
    '.selection-icon': {
      height: 20,
      width: 20,
    },
    '.selection-title': {
      display: 'block',
      color: Theme.combobox.fontColor,
      fontWeight: 'bold'
    },
    '.selection-description': {
      display: 'block',
      color: Theme.combobox.fontColor,
      fontSize: Theme.typography.fontSize
    }
  }
});
Styles.cssRule("i-combo-box", {
  position: "relative",
  display: "flex",
  fontFamily: Theme.typography.fontFamily,
  fontSize: Theme.typography.fontSize,
  color: Theme.text.primary,
  alignItems: 'center',
  $nest: {
    '&.i-combo-box-multi': {
      height: 'auto !important'
    },
    "> .icon-btn": {
      display: "inline-flex",
      flexWrap: 'nowrap',
      whiteSpace: 'nowrap',
      background: 'inherit',
      padding: "8px",
      marginLeft: "-1px",
      cursor: "pointer",
      height: '100%',
      alignItems: "center",
      position: 'absolute',
      right: 0,
      border: `0.5px solid ${Theme.divider}`,
      borderLeft: 'none',
      borderRadius: "inherit",
      borderTopLeftRadius: '0px !important',
      borderBottomLeftRadius: '0px !important',
    },
    "> .icon-btn:hover": {
      backgroundColor: Theme.action.hoverBackground,
    },
    "> .icon-btn i-icon": {
      display: "inline-block",
      width: "12px",
      height: "12px",
    },
    '.selection': {
      display: 'inline-flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      maxWidth: 'calc(100% - 32px)',
      height: '100%',
      border: `0.5px solid ${Theme.divider}`,
      borderRight: 'none !important',
      background: Theme.combobox.background,
      borderRadius: 'inherit',
      borderTopRightRadius: '0px !important',
      borderBottomRightRadius: '0px !important',
      padding: '2px 4px',
      transition: 'all .3s cubic-bezier(.645,.045,.355,1)',
      gap: 5,
      flexGrow: 1,
      maxHeight: '100%',
      $nest: {
        '.selection-item': {
          border: `1px solid ${Theme.divider}`,
          backgroundColor: 'rgba(0, 0, 0, 0.12)',
          color: '#000',
          borderRadius: 3,
          display: 'inline-flex',
          alignItems: 'center',
          padding: '3px 5px',
          gap: 4,
          maxWidth: 'clamp(100px, 50%, 200px)',
          userSelect: 'none',
          $nest: {
            '.close-icon': {
              cursor: 'pointer',
              opacity: '0.5'
            },
            '.close-icon:hover': {
              opacity: 1
            },
            '> span:first-child': {
              display: 'inline-block',
              overflow: 'hidden',
              whiteSpace: 'pre',
              textOverflow: 'ellipsis'
            }
          }
        },
        'input': {
          padding: '1px 0.5rem',
          border: 'none',
          boxShadow: 'none',
          outline: 'none',
          width: 'auto !important',
          maxWidth: '100%',
          flex: 1,
          background: Theme.combobox.background,
          color: Theme.combobox.fontColor,
          fontSize: 'inherit'
        }
      }
    },
  }
});
