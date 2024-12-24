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

export const customImageStyle = Styles.style({
  aspectRatio: '1/1',
  borderRadius: '4px',
  overflow: 'hidden',
  objectFit: 'cover',
})

export const customTopProductsStyle = Styles.style({
  gridAutoFlow: 'column',
  $nest: {
    'i-image': {
      aspectRatio: '1.25925925926'
    },
    '.picked-card:hover .love-icon': {
      top: '10px !important',
      transition: 'top .5s ease-in'
    }
  }
})

export const afterBlurStyle = Styles.style({
  position: 'absolute',
  top: 0,
  right: 0,
  width: 100,
  height: '100%',
  background: 'linear-gradient(270deg, #181e3e, #181e3e, #181e3e80, #181e3e)'
})
export const beforeBlurStyle = Styles.style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: 100,
  height: '100%',
  background: 'linear-gradient(270deg, #181e3e, #181e3e, #181e3e80, #181e3e)'
})

export const buttonHoveredStyle = Styles.style({
  $nest: {
    '&:hover': {
      boxShadow: Theme.shadows[0],
      background: `${Theme.action.hoverBackground} !important`,
      transform: 'scaleX(1.015)scaleY(1.035)perspective(1px)'
    }
  }
})