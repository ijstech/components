import * as Styles from '@ijstech/style';
let Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-radio-group', {
    display: 'inline-flex',  
    alignItems: 'start',
    gap: '5px',
    '$nest': {
        '.radio-wrapper': {
            display: 'inline-flex',
            alignItems: 'baseline',
            cursor: 'pointer',
        },
        'input[type="radio"]': {
            cursor: 'pointer',
        }
    }
})

export const captionStyle = Styles.style({    
    fontFamily: Theme.typography.fontFamily,
    fontSize: 'inherit',
    '$nest': {
        'span': {
            color: Theme.text.primary
        }
    },
})