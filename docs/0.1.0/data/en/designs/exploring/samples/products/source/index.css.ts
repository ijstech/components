import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const customImageStyle = Styles.style({
  aspectRatio: '1/1',
  borderRadius: '4px',
  overflow: 'hidden',
  objectFit: 'cover',
})

export const customButtonStyle = Styles.style({
  $nest: {
    '&:hover i-icon': {
      transform: 'translateX(2px)',
      transition: 'transform .2s ease-in-out'
    }
  }
})

export const buttonHoveredStyle = Styles.style({
  $nest: {
    '&:hover': {
      boxShadow: Theme.shadows[0],
      background: `${Theme.action.hoverBackground} !important`,
      transform: 'scaleX(1.015)scaleY(1.035)perspective(1px)',
      transition: 'all .2s ease-in-out'
    }
  }
})

export const shadowHoveredStyle = Styles.style({
  $nest: {
    '&:hover': {
      boxShadow: '0px 1px 3px 0px #0000004d,0px 4px 8px 3px #00000026,0px 1px 3px 0px #0000004d,0px 4px 8px 3px #00000026)',
      transform: 'scaleX(1.015)scaleY(1.035)perspective(1px)',
      transition: 'transform .2s cubic-bezier(.345,.115,.135,1.42)'
    }
  }
})

export const productListStyle = Styles.style({
  $nest: {
    '.repeater-container': {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      gridAutoFlow: 'dense',
      gridTemplateRows: 'auto',
      columnGap: 16,
      rowGap: 16,
      $nest: {
        '@media screen and (max-width: 767px)': {
          gridTemplateColumns: '1fr',
        },
        '@media screen and (min-width: 768px) and (max-width: 1024px)': {
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        }
      }
    }
  }
})

export const customTopProductsStyle = Styles.style({
  $nest: {
    '.repeater-container': {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
      gridAutoFlow: 'dense',
      gridTemplateRows: 'auto',
      columnGap: 16,
      rowGap: 16,
      $nest: {
        '@media screen and (max-width: 767px)': {
          gridTemplateColumns: '1fr',
        },
        '@media screen and (min-width: 768px) and (max-width: 1024px)': {
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        }
      }
    },
    'i-image': {
      aspectRatio: '1.25925925926'
    },
    '.picked-card:hover .love-icon': {
      top: '10px !important',
      transition: 'top .5s ease-in',
      display: 'block !important'
    }
  }
})
