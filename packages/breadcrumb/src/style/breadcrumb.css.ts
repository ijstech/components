import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-breadcrumb', {
    $nest: {
        'i-label': {
            padding: 5,
            margin: '0 5px',
            color: Theme.colors.primary.main
        },
        'i-icon': {
            margin: '0 5px',
            height: Theme.typography.fontSize,
            width: Theme.typography.fontSize,
            fill: Theme.colors.primary.main
        }
    }
})
