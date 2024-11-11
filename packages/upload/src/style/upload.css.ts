import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-upload', {
  margin: '1rem 0',
  listStyle: 'none',
  minHeight: 200,
  minWidth: 200,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  $nest: {
    '.i-upload-wrapper': {
      position: 'relative',
      border: `2px dashed ${Theme.divider}`,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    'i-upload-drag': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '.i-upload-drag_area': {
      marginTop: '4rem',
    },
    '.i-upload-dragger_active': {
      border: `2px dashed ${Theme.colors.primary.main}`,
      backgroundColor: Theme.colors.info.light,
      opacity: '0.8',
    },
    'input[type="file"]': {
      display: 'none',
    },
    '.i-upload_preview': {
      display: 'none',
      minHeight: 200,
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
    },
    '.i-upload_preview img': {
      maxHeight: 'inherit',
      maxWidth: '100%',
    },
    '.i-upload_preview-img': {
      maxHeight: 'inherit',
      maxWidth: '100%',
      // display: 'table',
      // margin: 'auto'
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    '.i-upload_preview-crop': {
      position: 'absolute',
      border: `1px dashed ${Theme.background.paper}`,
      width: 150,
      height: 150,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      boxSizing: 'border-box',
      boxShadow: '0 0 0 9999em',
      color: 'rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
      cursor: 'crosshair',
    },
    '.i-upload_preview-remove': {
      position: 'absolute',
      top: 0,
      left: 0,
      visibility: 'hidden',
      opacity: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.58)',
      cursor: 'pointer',
      $nest: {
        '> span': {
          padding: '1rem',
          border: '2px solid #fff',
          borderRadius: '5px',
          color: '#fff',
          fontWeight: 'bold',
        },
      },
    },
    '.i-upload_preview:hover .i-upload_preview-remove.active': {
      visibility: 'visible',
      opacity: 1,
    },
    '.i-upload_list': {
      margin: '1rem 0 2rem',
      display: 'flex',
      gap: 7,
      width: '100%',
    },
    '.i-upload_list.i-upload_list-picture': {
      flexDirection: 'row',
    },
    '.i-upload_list.i-upload_list-text': {
      flexDirection: 'column',
      alignContent: 'center',
    },
    '.i-upload_list.i-upload_list-text i-icon': {
      position: 'unset',
    },
    '.i-upload_list-item': {
      display: 'inline-flex',
      position: 'relative',
      justifyContent: 'space-between',
    },
    '.i-upload_list-item:hover i-icon': {
      display: 'block',
    },
    '.i-upload_list.i-upload_list-text .i-upload_list-item:hover': {
      backgroundColor: Theme.background.default,
    },
    '.i-upload_list.i-upload_list-text .i-upload_list-item': {
      width: '100%',
      padding: '.25rem',
    },
    '.i-upload_list-item .i-upload_list-img': {
      width: 100,
      height: 50,
      objectFit: 'cover',
    },
    '.i-upload_list-item i-icon': {
      cursor: 'pointer',
      position: 'absolute',
      right: -5,
      top: -5,
      display: 'none',
    },
  },
});
