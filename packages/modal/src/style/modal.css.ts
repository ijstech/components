import { getControlMediaQueriesStyle, getSpacingValue, getMediaQueryRule } from '@ijstech/base';
import * as Styles from '@ijstech/style';
import { IModalMediaQuery } from '../modal';
let Theme = Styles.Theme.ThemeVars;

const zIndex = 900;

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
        zIndex: zIndex,
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

export const getWrapperStyle = () => {
    return Styles.style({
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        visibility: 'hidden',
        transform: 'scale(0.8)',
        transition: 'visibility 0s linear .25s,opacity .25s 0s,transform .25s',
        zIndex: zIndex,
        overflow: 'auto',
        $nest: {
            '&.show': {
                opacity: '1',
                visibility: 'visible',
                transform: 'scale(1)',
                transition: 'visibility 0s linear 0s,opacity .25s 0s,transform .25s'
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
        zIndex: zIndex,
        // overflow: 'auto',
        // width: '100%',
        maxWidth: 'inherit',
        $nest: {
            '.modal': {
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

export const getFixedWrapperStyle = (paddingLeft: string, paddingTop: string) => {
    return Styles.style({
        paddingLeft: paddingLeft,
        paddingTop: paddingTop,
        width: '100%',
        height: '100%'
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

export const getModalStyle = (left: string, top: string) => {
    return Styles.style({
        left: left,
        top: top
    })
}

export const modalStyle = Styles.style({
    fontFamily: 'Helvetica',
    fontSize: '14px',
    padding: '10px 10px 5px 10px',
    backgroundColor: Theme.background.modal,
    position: 'relative',
    // margin: '0 auto 30px',
    borderRadius: '2px',
    // minWidth: '300px',
    width: 'inherit',
    maxWidth: '100%'
})

export const getBodyStyle = Styles.style({
    height: '100%',
    overflow: 'hidden'
})

export const titleStyle = Styles.style({
    fontSize: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    $nest: {
        'span': {
            color: Theme.colors.primary.main
        },
        'i-icon': {
            display: 'inline-block',
            cursor: 'pointer'
        }
    }
})

export const getModalMediaQueriesStyleClass = (mediaQueries: IModalMediaQuery[]) => {
    let styleObj: any = getControlMediaQueriesStyle(mediaQueries);
    for (let mediaQuery of mediaQueries) {
        let mediaQueryRule = getMediaQueryRule(mediaQuery);
        if (mediaQueryRule) {
            const nestObj = styleObj['$nest'][mediaQueryRule]['$nest'] || {};
            const ruleObj = styleObj['$nest'][mediaQueryRule];
            styleObj['$nest'][mediaQueryRule] = {
                ...ruleObj,
                $nest: {
                    ...nestObj,
                    '&.show > .modal-overlay': {},
                    '.modal-wrapper': {},
                    '.modal': {}
                }
            };
            const {
                showBackdrop,
                padding,
                position,
                maxWidth: maxWidthValue,
                maxHeight: maxHeightValue,
                minWidth: minWidthValue,
                width: widthValue,
                height: heightValue,
                popupPlacement,
                overflow,
                border
            } = mediaQuery.properties || {};
            if (showBackdrop) {
                if (showBackdrop) {
                    styleObj['$nest'][mediaQueryRule]['$nest']['&.show > .modal-overlay']['visibility'] = 'visible !important';
                    styleObj['$nest'][mediaQueryRule]['$nest']['&.show > .modal-overlay']['opacity'] = '1 !important';
                } else {
                    styleObj['$nest'][mediaQueryRule]['$nest']['&.show > .modal-overlay']['visibility'] = 'hidden !important';
                    styleObj['$nest'][mediaQueryRule]['$nest']['&.show > .modal-overlay']['opacity'] = '0 !important';
                }
            }
            if (position) {
                styleObj['$nest'][mediaQueryRule]['$nest']['.modal-wrapper']['position'] = `${position} !important`;
            }
            if (maxWidthValue !== undefined && maxWidthValue !== null) {
                const maxWidth = `${getSpacingValue(maxWidthValue)} !important`;
                styleObj['$nest'][mediaQueryRule]['maxWidth'] = maxWidth;
                styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['maxWidth'] = maxWidth;
            }
            if (maxHeightValue !== undefined && maxHeightValue !== null) {
                const maxHeight = `${getSpacingValue(maxHeightValue)} !important`;
                styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['maxHeight'] = maxHeight;
            }
            if (heightValue !== undefined && heightValue !== null) {
                const height = `${getSpacingValue(heightValue)} !important`;
                styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['height'] = height;
            }
            if (widthValue !== undefined && widthValue !== null) {
                const width = `${getSpacingValue(widthValue)} !important`;
                styleObj['$nest'][mediaQueryRule]['width'] = width;
                styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['width'] = width;
            }
            if (minWidthValue !== undefined && minWidthValue !== null) {
                const minWidth = `${getSpacingValue(minWidthValue)} !important`;
                styleObj['$nest'][mediaQueryRule]['minWidth'] = minWidth;
                styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['minWidth'] = minWidth;
            }
            if (popupPlacement) {
                const placement = popupPlacement;
                let positionObj: {[key: string]: string} = {
                    top: 'unset',
                    left: 'unset',
                    right: 'unset',
                    bottom: 'unset'
                };
                if (placement === 'bottom') {
                    positionObj.top = 'auto !important';
                    positionObj.left = '0 !important';
                    positionObj.bottom = '0 !important';
                } else if (placement === 'top') {
                    positionObj.top = '0 !important';
                    positionObj.left = '0 !important';
                } else if (placement === 'center') {
                    positionObj.top = '50% !important';
                    positionObj.left = '50% !important';
                }
                for (let pos in positionObj) {
                    styleObj['$nest'][mediaQueryRule]['$nest']['.modal-wrapper'][pos] = positionObj[pos];
                }
            }
            if (border) {
                const { radius, width, style, color, bottom, top, left, right } = border;
                if (width !== undefined && width !== null)
                    styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['border'] = `${width || ''} ${style || ''} ${color || ''}!important`;
                if (radius) {
                    styleObj['$nest'][mediaQueryRule]['$nest']['.modal-wrapper']['borderRadius'] = 'inherit';
                    styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['borderRadius'] = `${getSpacingValue(radius)} !important`;
                }
                if (bottom)
                    styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['borderBottom'] = `${getSpacingValue(bottom.width || '')} ${bottom.style || ''} ${bottom.color || ''}!important`;
                if (top)
                    styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['borderTop'] = `${getSpacingValue(top.width || '') || ''} ${top.style || ''} ${top.color || ''}!important`;
                if (left)
                    styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['borderLeft'] = `${getSpacingValue(left.width || '')} ${left.style || ''} ${left.color || ''}!important`;
                if (right)
                    styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['borderRight'] = `${getSpacingValue(right.width || '')} ${right.style || ''} ${right.color || ''}!important`;
            }
            if (padding) {
                const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
                styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['padding'] = `${getSpacingValue(top)} ${getSpacingValue(right)} ${getSpacingValue(bottom)} ${getSpacingValue(left)} !important`;
            }
            if (overflow) {
                if (typeof overflow === 'string') {
                    styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['overflow'] = `${overflow} !important`;
                } else {
                    const { x, y } = overflow || {};
                    if (x === y) {
                        styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['overflow'] = `${x} !important`;
                    } else {
                        if (x) styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['overflowX'] = `${x} !important`;
                        if (y) styleObj['$nest'][mediaQueryRule]['$nest']['.modal']['overflowY'] = `${y} !important`;
                    }
                }
            }
        }
    }
    return Styles.style(styleObj);
}
