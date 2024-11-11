import * as Styles from '@ijstech/style';
let Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-label', {
    display: 'inline-block',
    color: Theme.text.primary,
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.fontSize
});