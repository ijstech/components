import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

export const applicationStyle = Styles.style({
    height: '100%',
    $nest: {
        'body': {
            height: '100%'
        }
    }
})