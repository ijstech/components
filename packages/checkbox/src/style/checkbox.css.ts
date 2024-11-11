import * as Styles from "@ijstech/style";
let Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-checkbox', {
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.fontSize,
    userSelect: 'none',
    '$nest': {
        '.i-checkbox': {
            display: 'inline-flex',
            alignItems: 'center',
            position: 'relative',
            maxWidth: '100%'
        },
        '.i-checkbox_input': {
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            position: 'relative'
        },
        '.checkmark': {
            width: 15,
            height: 15,
            display: 'inline-block',
            position: 'relative',
            backgroundColor: Theme.background.paper,
            border: `1px solid ${Theme.divider}`,
            // zIndex: -1,
            boxSizing: 'border-box',
            transition: 'border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46)'
        },
        '.i-checkbox_label': {
            boxSizing: 'border-box',
            color: Theme.text.primary,
            display: 'inline-block',
            paddingLeft: 8,
            maxWidth: '100%'
        },
        'input': {
            opacity: 0,
            width: 0,
            height: 0,
            position: 'absolute',
            top: 0,
            left: 0
        },
        '&.is-checked': {
            '$nest': {
                '.i-checkbox_label': {
                    color: Theme.colors.info.main
                },
                '.checkmark': {
                    backgroundColor: Theme.colors.info.main
                },
                '.checkmark:after': {
                    transform: 'rotate(45deg) scaleY(1)'
                },
                '.is-indeterminate .checkmark:after': {
                    transform: 'none'
                }
            }
        },
        '&:not(.disabled):hover input ~ .checkmark': {
            borderColor: Theme.colors.info.main
        },
        '&.disabled': {
            cursor: 'not-allowed'
        },
        '.checkmark:after': {
            content: "''",
            boxSizing: 'content-box',
            border: `1px solid ${Theme.background.paper}`,
            borderLeft: 0,
            borderTop: 0,
            height: 7.5,
            left: '35%',
            top: 1,
            transform: 'rotate(45deg) scaleY(0)',
            width: 3.5,
            transition: 'transform .15s ease-in .05s',
            transformOrigin: 'center',
            display: 'inline-block',
            position: 'absolute'
        },
        '.is-indeterminate .checkmark': {
            backgroundColor: Theme.colors.info.main
        },
        '.is-indeterminate .checkmark:after': {
            width: '80%',
            height: 0,
            top: '50%',
            left: '10%',
            borderRight: 0,
            transform: 'none'
        },
    }
})
