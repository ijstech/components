import * as Styles from "@ijstech/style";

Styles.cssRule("i-video", {
  position: 'relative',
  $nest: {
    '.video-js  .vjs-big-play-button': {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    '.overlay': {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '100%',
      height: 'calc(100% - 3rem)',
      zIndex: 9999,
      display: 'none',
    },
    '@media screen and (max-width: 767px)': {
      $nest: {
        '.overlay': {
          display: 'block'
        }
      }
    }
  }
})
