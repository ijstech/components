import * as Styles from "@ijstech/style";

Styles.cssRule('i-repeater', {
    display: 'block',
    width: '100%',
    $nest: {
        '.repeater-container': {
            display: 'flex'
        }
    }
})