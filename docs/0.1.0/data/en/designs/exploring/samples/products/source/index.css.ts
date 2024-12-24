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
  $nest: {
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 20,
      height: '100%',
      background: Theme.background.main,
      filter: 'opacity(0.5)',
      backdropFilter: 'blur(9999px)'
    }
  }
})
export const beforeBlurStyle = Styles.style({
  $nest: {
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 20,
      height: '100%',
      background: Theme.background.main,
      filter: 'opacity(0.5)',
      backdropFilter: 'blur(9999px)'
    }
  }
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