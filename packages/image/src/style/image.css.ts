import * as Styles from "@ijstech/style";

Styles.cssRule("i-image", {
  position: 'relative',
  $nest: {
    'img': {
      maxHeight: '100%',
      maxWidth: '100%',
      height: 'inherit',
      verticalAlign: 'middle',
      objectFit: 'contain',
      overflow: 'hidden',
      width: '100%'
    }
  }
})
