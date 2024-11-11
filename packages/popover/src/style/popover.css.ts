import * as Styles from '@ijstech/style';
let Theme = Styles.Theme.ThemeVars;

export const getOverlayStyle = () => {
    return Styles.style({
        backgroundColor: 'rgba(12, 18, 52, 0.7)',
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        visibility: 'hidden',
        zIndex: 1000,
        transition: 'visibility 0s linear .25s, opacity .25s',
        $nest: {
            '&.show': {
                opacity: '1',
                visibility: 'visible',
                transition: 'visibility 0s linear, opacity .25s'
            }
        }
    })
}

export const getNoBackdropStyle = () => {
    return Styles.style({
        position: 'inherit',
        top: 0,
        left: 0,
        opacity: 0,
        visibility: 'hidden',
        transform: 'scale(0.8)',
        transition: 'visibility 0s linear .25s,opacity .25s 0s,transform .25s',
        zIndex: 1000,
        maxWidth: 'inherit',
        $nest: {
            '.popover': {
                margin : '0'
            },
            '&.show': {
                opacity: '1',
                visibility: 'visible',
                transform: 'scale(1)',
                transition: 'visibility 0s linear 0s,opacity .25s 0s,transform .25s'
            }
        }
    })
}

export const getAbsoluteWrapperStyle = (left: string, top: string) => {
    return Styles.style({
        left: left,
        top: top,
        width: 'inherit',
        height: 'inherit'
    })
}

export const popoverMainContentStyle = Styles.style({
    fontFamily: 'Helvetica',
    fontSize: '14px',
    padding: '10px 10px 5px 10px',
    backgroundColor: Theme.background.modal,
    position: 'relative',
    borderRadius: '2px',
    width: 'inherit',
    maxWidth: '100%'
})

Styles.cssRule('i-popover', {
    position: 'absolute',
    left: '0',
    top: '0'
})