import * as Styles from '@ijstech/style';

let Theme = Styles.Theme.ThemeVars;

Styles.cssRule("i-markdown", {
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.fontSize,
    color: `var(--custom-text-color, ${Theme.text.primary})`,
});