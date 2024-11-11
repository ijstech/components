import * as Styles from "@ijstech/style";
let Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-repeater', {
    display: 'block',
    width: '100%',
    $nest: {
        '.repeater-container': {
            display: 'flex',
            flexDirection: 'column'
        }
    }
})