import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const closeIconStyle = Styles.style({
  $nest: {
    '.i-modal-close': {
      right: '-30px',
      position: 'absolute',
    }
  }
})

export const afterBlurStyle = Styles.style({
  position: 'absolute',
  top: 0,
  right: 0,
  width: 100,
  height: '100%',
  zIndex: 1,
  background: 'linear-gradient(270deg, #181e3e, #181e3e, #181e3e80, #181e3e)'
})

export const beforeBlurStyle = Styles.style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: 100,
  height: '100%',
  zIndex: 1,
  background: 'linear-gradient(270deg, #181e3e80, #181e3e80, #181e3e, #181e3e)'
})

export const customOptionStyle = Styles.style({
  $nest: {
    '.repeater-container': {
      overflow: 'visible'
    }
  }
})