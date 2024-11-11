import * as Styles from "@ijstech/style";
const Theme = Styles.Theme.ThemeVars;

export const jsonUICheckboxStyle = Styles.style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  $nest: {
    'i-checkbox': {
      display: 'flex',
      height: 'auto !important'
    }
  }
});

export const jsonUIComboboxStyle = Styles.style({
  $nest: {
    '.selection': {
      border: `1px solid ${Theme.divider}`
    },
    '.selection input': {
      paddingInline: 0
    }
  }
});

export const jsonUITabStyle = Styles.style({
  display: 'block',
  $nest: {
    '.tabs-nav': {
      borderBottom: `none`,
      borderRight: `1px solid #606770`
    },
    'i-tab': {
      color: '#606770',
      background: "none",
      margin: '4px',
      border: `none`,
      borderRadius: `5px`,
      $nest: {
        '&:not(.disabled):hover': {
          color: '#606770'
        }
      }
    },
    'i-tab:not(.disabled).active': {
      backgroundColor: '#c2c2c2',
      color: '#000000'
    }
  }
})
