import * as Styles from '@ijstech/style';
let Theme = Styles.Theme.ThemeVars;

const spinnerAnim = Styles.keyframes({
    "0%": {
      transform: 'rotate(0deg)'
    },
    "100%": {
        transform: 'rotate(360deg)'
    },
});

Styles.cssRule('i-icon', {
    display: 'inline-block',
    $nest:{
        "svg": {
            fill: Theme.text.primary,
            verticalAlign: 'top',
            width: "100%",
            height: "100%"
        },
        '&.is-spin': {
            animation: `${spinnerAnim} 2s linear infinite`
        }
    }
})