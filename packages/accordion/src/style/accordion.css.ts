import * as Styles from "@ijstech/style";

Styles.cssRule("i-accordion", {
  display: 'block',
  $nest: {
  },
});

export const customStyles = Styles.style({
  $nest: {
    '.accordion-body': {
      transition: 'height 0.4s ease-in',
      height: 0,
      overflow: 'hidden'
    },
    '&.expanded > .accordion-body': {
      height: 'auto'
    },
    '.accordion-header': {
      $nest: {
        'i-label': {
          fontSize: 'inherit'
        }
      }
    }
  }
})

export const expandablePanelStyle = Styles.style({
  $nest: {
    'i-panel': {
      border: 'none'
    }
  }
})
