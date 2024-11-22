import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-button', {
    background: Theme.colors.primary.main,
    boxShadow: Theme.shadows[2],
    color: Theme.text.primary,    
    // display: 'inline-block',
    // verticalAlign: 'middle',
    // textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',    
    borderRadius: 4,    
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.fontSize,
    cursor: 'pointer',
    userSelect: 'none',
    $nest: {
        "&:not(.disabled):hover": {
            // cursor: 'pointer',            
            // backgroundColor: Theme.colors.primary.dark,
            // boxShadow: Theme.shadows[4],
            // background: Theme.colors.primary.main
        },
        "&.disabled": {
            color: Theme.text.disabled,
            boxShadow: Theme.shadows[0],
            background: Theme.action.disabledBackground,
            cursor: 'not-allowed'
        },
        "i-icon": {
            display: 'inline-block',
            fill: Theme.text.primary,
            verticalAlign: 'middle',
        },
        '.caption': {
            paddingRight: '.5rem'
        },
        "&.is-spinning, &.is-spinning:not(.disabled):hover, &.is-spinning:not(.disabled):focus": {
            color: Theme.text.disabled,
            boxShadow: Theme.shadows[0],
            background: Theme.action.disabledBackground,
            cursor: 'default'
        },
        "&.has-caption": {
            gap: 5
        }
    }
})