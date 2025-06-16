import * as Styles from "@ijstech/style";
let Theme = Styles.Theme.ThemeVars;
Styles.cssRule('i-context-menu', {
  display: 'none'
});
Styles.cssRule('i-menu', {
  display: 'block'
});
const fadeInRight = Styles.keyframes({
  "0%": {
    opacity: 0,
    transform: "translate3d(100%, 0, 0)",
  },
  "100%": {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
  },
});

export const menuStyle = Styles.style({
  fontFamily: Theme.typography.fontFamily,
  fontSize: Theme.typography.fontSize,
  color: Theme.text.primary,
  position: "relative", // For responsive
  // overflow: 'hidden',
  display: 'block',
  width: '100%',
  $nest: {
    "*": {
      boxSizing: "border-box",
    },
    ".menu": {
      display: "block",
      margin: 0,
      padding: 0,
      listStyle: "none"
    },
    ".menu-horizontal": {
      display: "flex",
      flexWrap: 'nowrap'
    },
    ".menu-inline": {
      $nest: {
        ".menu-item": {
          paddingLeft: 'calc(1.5rem + var(--menu-item-level, 0) * 1rem)'
        },
        ".menu-item-arrow": {
          marginTop: '-14px',
          right: '6px',
          padding: '8px',
        },
        ".menu-item-arrow-active": {
          transform: 'rotate(180deg)',
          transition: 'transform 0.25s',
          fill: `${Theme.text.primary} !important`
        },
        "li": {
          position: "relative",
          $nest: {
            "&:hover": {
              $nest: {
                ".menu-item": {
                  color: Theme.colors.primary.main,
                },
                ".menu-item-arrow-active": {
                  fill: 'currentColor !important',
                },
              },
            },
          },
        },
      }
    }
  }
});

export const meunItemStyle = Styles.style({
  position: 'relative',
  display: 'block',
  // color: Theme.text.secondary,
  $nest: {
    ".menu-item": {
      position: "relative",
      display: "inline-flex",
      padding: "0 1.5rem",
      border: 0,
      borderRadius: 5,
      cursor: "pointer",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: "36px",
      width: "100%",
      justifyContent: 'var(--custom-text-align, left)',
      alignItems: 'center'
    },
    "&:not(.hide-arrow-icon) .menu-item.has-children": {
      paddingRight: "2.25rem"
    },
    ".menu-item.menu-active, .menu-item.menu-selected, .menu-item:hover": {
      background: Theme.action.hoverBackground,
      color: Theme.action.hover,
    },
    '.menu-item.menu-active > .menu-item-arrow': {
      transform: 'rotate(180deg)',
      transition: 'transform 0.25s'
    },
    ".menu-item-arrow": {
      position: "absolute",
      top: "50%",
      right: 18,
      marginTop: -6,
      cursor: 'pointer',
    },
    ".menu-item-icon": {
      display: "inline-block",
      verticalAlign: 'middle',
      marginRight: "8px",
      textAlign: "center",
      fill: "currentColor",
      flexShrink: '0',
      $nest: {
        "> i-image": {
          display: 'flex'
        }
      }
    },
    "i-link, a": {
      display: "block"
    },
    "i-link > a": {
      textDecoration: 'unset'
    },
    'i-link:hover *': {
      color: "unset"
    },
    'li': {
      listStyle: "none"
    },
    '&.hide-arrow-icon .menu-item-arrow': {
      display: 'none'
    },
  }
});

export const modalStyle = Styles.style({
  $nest: {
    '.reverse-menu': {
      display: 'flex',
      flexDirection: 'column-reverse'
    },
    "> div": {
      transform: "unset",
      transition: "background 0.2s cubic-bezier(0.4, 0, 1, 1), color 0.2s cubic-bezier(0.4, 0, 1, 1)",
      overflow: "visible"
    },
    ".modal": {
      boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 0px, rgb(0 0 0 / 10%) 0px 0px 1px 0px',
      minWidth: 0,
      padding: 0,
      borderRadius: '5px'
    }
  }
})
