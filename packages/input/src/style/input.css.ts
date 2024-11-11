import * as Styles from "@ijstech/style";
let Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-input', {
    display: 'inline-block',        
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.fontSize,
    background: Theme.input.background,
    '$nest': {
        '> span': {
            overflow: 'hidden',
            display: 'none'
        },
        '> span > label': {
            boxSizing: 'border-box',
            color: Theme.text.primary,
            display: 'inline-block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',    
            textAlign: 'right',
            paddingRight: 4,
            // height: '100%'
        },
        '> input': {
            border: `0.5px solid ${Theme.divider}`,
            boxSizing: 'border-box',
            outline: 'none',
            color: Theme.input.fontColor,
            background: Theme.input.background,
            borderRadius: 'inherit',
            fontSize: 'inherit',
            maxHeight: '100%',
            maxWidth: '100%'
        },
        '.clear-btn': {
            display: "none",
            verticalAlign: "middle",
            padding: "6px",
            height: "100%",
            backgroundColor: Theme.action.focus,
            $nest: {
              '&.active': {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }
            }
        },
        'textarea': {
            width: '100%',
            lineHeight: 1.5,
            color: Theme.input.fontColor,
            background: Theme.input.background,
            fontFamily: Theme.typography.fontFamily,
            outline: 'none',
            borderRadius: 'inherit',
            fontSize: 'inherit'
        }
    }
})