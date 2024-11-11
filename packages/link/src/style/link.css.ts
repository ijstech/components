import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-link', {
    display: 'block',
    cursor: 'pointer',
    textTransform: 'inherit',
    $nest:{
        // "&.i-link *": {
        //     color: Theme.colors.primary.main,
        //     fontSize: '1rem'
        // },
        '&:hover *': {
            color: Theme.colors.primary.dark
        },
        // 'a:visited, a:visited *': {
        //     color: Theme.colors.info.dark
        // },
        '> a': {
            display: 'inline',
            transition: 'all .3s',
            textDecoration: 'underline',
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            fontFamily: 'inherit',
            textTransform: 'inherit'
        }
    }
})