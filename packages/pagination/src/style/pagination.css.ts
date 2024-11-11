import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-pagination', {
    display: 'block',
    width: '100%',
    maxWidth: '100%',
    verticalAlign: 'baseline',
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.fontSize,
    lineHeight: '25px',
    color: Theme.text.primary,    
    '$nest': {
        ".pagination": {
            display: 'inline-flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
        }, 
        ".pagination a": {
            color: Theme.text.primary,
            float: 'left',
            padding: '4px 8px',
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'background-color .3s',
            border: '1px solid #ddd',
            minWidth: 36,
        },
        ".pagination a.active": {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: '1px solid #4CAF50',
            cursor: 'default',
        },
        '.pagination a.disabled': {
            color: Theme.text.disabled,
            pointerEvents: 'none'
        },
    }
})