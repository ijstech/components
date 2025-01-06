import { Styles } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;

export const customStyles = Styles.style({
  $nest: {
    'i-radio': {
      $nest: {
        'input': {
          display: 'none'
        },
        '.radio-wrapper': {
          display: 'flex',
          alignItems: 'center',
          gap: 6
        },
        '.i-radio_label': {
          width: 30,
          height: 30,
          backgroundColor: 'transparent',
          borderRadius: '50%',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color 0.2s ease-in-out',
          border: `1px solid ${Theme.divider}`
        },
        '&.is-checked': {
          $nest: {
            '.i-radio_label': {
              backgroundColor: Theme.action.activeBackground,
              border: `1px solid ${Theme.action.activeBackground}`,
            },
            '.i-radio_label::after': {
              content: '""',
              width: 10,
              height: 10,
              display: 'inline-block',
              backgroundColor: '#fff',
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }
          }
        }
      }
    }
  }
})