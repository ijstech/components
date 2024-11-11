import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-upload-modal', {
  $nest: {
    'i-modal': {
      // @ts-ignore
      position: 'fixed!important',
      zIndex: 1000,
    },

    '.file-uploader-dropzone': {
      $nest: {
        'i-upload': {
          position: 'absolute',
          top: 0,
          opacity: 0,
          minHeight: 'auto',
          minWidth: 'auto',
          margin: 0,
          zIndex: 1,

          $nest: {
            '.i-upload_preview-img': {
              display: 'none!important',
            },
          },
        },

        '.filelist': {
          $nest: {
            '@media screen and (max-width: 767px)': {
              flex: '1',
              overflowY: 'auto'
            },
            '.file': {
              border: `1px solid ${Theme.divider}`,
              borderRadius: '0.5rem',
              $nest: {
                '&:hover': {
                  border: `1px solid ${Theme.colors.primary.main}`,
                }
              }
            },
          },
        },
      },
    },
  },
});
