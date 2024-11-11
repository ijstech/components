import {cssRule, style, Theme, keyframes} from '@ijstech/style';
import * as Styles from "@ijstech/style";
import { BorderStylesSideType, IBorder, IBorderSideStyles, IOverflow, IBackground, IControlMediaQuery, DisplayType, IMediaQuery } from '../index';

const spinnerAnim = keyframes({
    "0%": {
      transform: 'rotate(0deg)'
    },
    "100%": {
        transform: 'rotate(360deg)'
    },
});

cssRule('html', {
    overscrollBehavior: 'none',
})

cssRule('body', {
    // userSelect: 'none',
    background: Theme.ThemeVars.background.default,
    backgroundAttachment: 'fixed !important',
    margin: 0,
    padding: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
    overscrollBehavior: 'none',
    $nest: {
        '*, *:before, *:after': {
            boxSizing: 'border-box'
        },
        '.text-left': {
            textAlign: 'left'
        },
        '.text-right': {
            textAlign: 'right'
        },
        '.text-center': {
            textAlign: 'center'
        },
        '.bold': {
            fontWeight: 'bold'
        },
        '.inline-flex': {
            display: 'inline-flex'
        },
        '.flex': {
            display: 'flex'
        },
        '.inline-block': {
            display: 'inline-block'
        },
        '.mr-1': {
            marginRight: '1rem !important'
        },
        '.ml-1': {
            marginLeft: '1rem !important'
        },
        '.mb-1': {
            marginBottom: '1rem !important'
        },
        '.mt-1': {
            marginTop: '1rem !important'
        },
        '.mb-2': {
          marginBottom: '2rem'
        },
        '.pointer': {
            cursor: 'pointer'
        },
        '.text-underline': {
            textDecoration: 'underline'
        },
        '.text-none i-link > a': {
            textDecoration: 'none'
        },
        '.i-loading-overlay': {
            position: 'absolute',
            zIndex: 9,
            margin: 0,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            transition: 'opacity .3s',
            background: Theme.ThemeVars.background.default,
            $nest: {
                '&:after': {
                    content: '""',
                    position: 'absolute',
                    opacity: '.5',
                    width: '100%',
                    height: '100%'
                },
                '.i-loading-spinner_text': {
                    fontSize: '1rem',
                    color: Theme.ThemeVars.text.primary,
                    fontFamily: Theme.ThemeVars.typography.fontFamily,
                    marginTop: '.5rem'
                },
                '.i-loading-spinner_icon': {
                    display: 'block',
                    animation: `${spinnerAnim} 2s linear infinite`,
                    $nest: {
                        'i-image': {
                            display: 'block',
                            maxHeight: '100%',
                            maxWidth: '100%'
                        }
                    }
                },
                '.i-loading-spinner': {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    padding: '1rem'
                }
            }
        }
    }
})
export const disabledStyle = style({
    opacity: 0.4,
    cursor: 'default'
})
export const containerStyle = style({    
    $nest: {
        "span.resizer": {
            zIndex: 999
        },
        "span.resizer:hover": {
            backgroundColor: Theme.ThemeVars.colors.info.main,
            transitionDelay: '0.5s'
        },
        'span.resizer.highlight': {
            backgroundColor: Theme.ThemeVars.colors.info.main
        },
        'span.e-resize': {            
            position: 'absolute',
            right: '0px',
            height: '100%',
            width: '4px',
            cursor: 'e-resize'
        },
        'span.n-resize': {
            position: 'absolute',
            top: '0px',
            height: '4px',
            width: '100%',
            cursor: 'n-resize'
        },
        'span.s-resize': {
            position: 'absolute',
            bottom: '0px',
            height: '4px',
            width: '100%',
            cursor: 's-resize'
        },        
        'span.w-resize': {
            position: 'absolute',
            left: '0px',
            height: '100%',
            width: '4px',
            cursor: 'w-resize'
        },
        'span.resizing': {
            userSelect: 'none',
            pointerEvents: 'none'   
        }
    }
})
export const getBorderSideObj = (side: BorderStylesSideType, value: IBorderSideStyles) => {
    let styleObj: any = {}
    if (value.width !== undefined) {
        let borderWidthProp = `border-${side}-width`;
        styleObj[borderWidthProp] = getSpacingValue(value.width);
    }
    if (value.style !== undefined) {
        let borderStyleProp = `border-${side}-style`;
        styleObj[borderStyleProp] = value.style;
    }
    if (value.color !== undefined) {
        let borderColorProp = `border-${side}-color`;
        styleObj[borderColorProp] = value.color || 'transparent';
    }
    return styleObj;
}
export const getBorderSideStyleClass = (side: BorderStylesSideType, value: IBorderSideStyles) => {
    const styleObj = getBorderSideObj(side, value);
    return style(styleObj);
}
export const getBorderStyleClass = (value: IBorder) => {
    if (!value) return '';
    const { width, style: bdStyle, color, top, right, bottom, left } = value;
    let styleObj: any = {};
    if (Object.hasOwnProperty.call(value, 'radius')) {
        styleObj['borderRadius'] = value.radius;
    }
    let borderWidth = width || '1px';
    let borderColor = color || 'transparent';
    let borderStyle = bdStyle || 'solid';
    styleObj.borderWidth = '';
    styleObj.borderColor = '';
    styleObj.borderStyle = '';
    if (top) {
        const { width, color, style } = top;
        styleObj.borderWidth = `${getSpacingValue(width || borderWidth)}`;
        styleObj.borderColor = `${color || borderColor}`;
        styleObj.borderStyle = `${style || borderStyle}`;
    }
    if (right) {
        const { width, color, style } = right;
        styleObj.borderWidth += ` ${getSpacingValue(width || borderWidth)}`;
        styleObj.borderColor += ` ${color || borderColor}`;
        styleObj.borderStyle += ` ${style || borderStyle}`;
    }
    if (bottom) {
        const { width, color, style } = bottom;
        styleObj.borderWidth += ` ${getSpacingValue(width || borderWidth)}`;
        styleObj.borderColor += ` ${color || borderColor}`;
        styleObj.borderStyle += ` ${style || borderStyle}`;
    }
    if (left) {
        const { width, color, style } = left;
        styleObj.borderWidth += ` ${getSpacingValue(width || borderWidth)}`;
        styleObj.borderColor += ` ${color || borderColor}`;
        styleObj.borderStyle += ` ${style || borderStyle}`;
    }
    if (!styleObj.borderWidth) {
        styleObj.borderWidth = borderWidth;
    }
    if (!styleObj.borderColor) {
        styleObj.borderColor = borderColor || 'transparent';
    }
    if (!styleObj.borderStyle) {
        styleObj.borderStyle = borderStyle || 'solid';
    }
    return style(styleObj);
}
export const getOverflowStyleClass = (value: IOverflow) => {
    let styleObj: any = {};
    if (value.x === value.y) {
        styleObj.overflow = value.x;
    } else {
        if (value.x) {
            styleObj.overflowX = value.x
        }
        if (value.y) {
            styleObj.overflowY = value.y
        }
    }
    return style(styleObj);
}

export const getBackground = (value: IBackground) => {
    let styleObj = { background: ''};
    let bg = '';
    value.image && (bg += `url(${value.image})`);
    value.color && (bg += `${value.color}`);
    styleObj.background = bg;
    return styleObj;
}

export const getBackgroundStyleClass = (value: IBackground) => {
    return style(getBackground(value));
}

export const getSpacingValue = (value: string | number) => {
    const isNumber = typeof value === 'number' || (value !== '' && !Number.isNaN(Number(value)));
    return isNumber ? `${value}px` : value;
};

export const getMediaQueryRule = (mediaQuery: IMediaQuery<any>) => {
    let mediaQueryRule;
    const maxWidth = mediaQuery.maxWidth ? getSpacingValue(mediaQuery.maxWidth) : 0;
    const minWidth = mediaQuery.minWidth ? getSpacingValue(mediaQuery.minWidth) : 0;
    if (minWidth && maxWidth) {
        mediaQueryRule = `@media (min-width: ${minWidth}) and (max-width: ${maxWidth})`
    }
    else if (minWidth) {
        mediaQueryRule = `@media (min-width: ${minWidth})`
    }
    else if (maxWidth) {
        mediaQueryRule = `@media (max-width: ${maxWidth})`
    }
    return mediaQueryRule;
}

interface IProps {
    display?: DisplayType;
}

export const getControlMediaQueriesStyle = (mediaQueries: IControlMediaQuery[], props?: IProps) => {
    let styleObj: any = {
        $nest: {}
    };
    if (mediaQueries) {
        for (let mediaQuery of mediaQueries) {
            let mediaQueryRule = getMediaQueryRule(mediaQuery);
            if (mediaQueryRule) {
                styleObj['$nest'][mediaQueryRule] = {};
                let {
                    display,
                    visible,
                    padding,
                    margin,
                    position,
                    border,
                    overflow,
                    background,
                    grid,
                    zIndex,
                    top,
                    left,
                    right,
                    bottom,
                    maxHeight,
                    maxWidth,
                    font,
                    width,
                    height,
                    minWidth,
                    minHeight,
                    opacity,
                    stack
                } = mediaQuery.properties || {};
                if (display) {
                    styleObj['$nest'][mediaQueryRule]['display'] = `${display} !important`;
                }
                if (typeof visible === 'boolean') {
                    const currentDisplay = display ?? props?.display ?? 'flex';
                    styleObj['$nest'][mediaQueryRule]['display'] = visible ? `${currentDisplay} !important` : 'none !important';
                }
                if (padding) {
                    const { top = 0, right = 0, bottom = 0, left = 0 } = padding;
                    styleObj['$nest'][mediaQueryRule]['padding'] = `${getSpacingValue(top)} ${getSpacingValue(right)} ${getSpacingValue(bottom)} ${getSpacingValue(left)} !important`;
                }
                if (margin) {
                    const { top = 0, right = 0, bottom = 0, left = 0 } = margin;
                    styleObj['$nest'][mediaQueryRule]['margin'] = `${getSpacingValue(top)} ${getSpacingValue(right)} ${getSpacingValue(bottom)} ${getSpacingValue(left)} !important`;
                }
                if (border) {
                    const { radius, width, style, color, bottom, top, left, right } = border;
                    if (width !== undefined && width !== null)
                        styleObj['$nest'][mediaQueryRule]['border'] = `${width || ''} ${style || ''} ${color || ''}!important`;
                    if (radius)
                        styleObj['$nest'][mediaQueryRule]['borderRadius'] = `${getSpacingValue(radius)} !important`;
                    if (bottom)
                        styleObj['$nest'][mediaQueryRule]['borderBottom'] = `${getSpacingValue(bottom.width || '')} ${bottom.style || ''} ${bottom.color || ''}!important`;
                    if (top)
                        styleObj['$nest'][mediaQueryRule]['borderTop'] = `${getSpacingValue(top.width || '') || ''} ${top.style || ''} ${top.color || ''}!important`;
                    if (left)
                        styleObj['$nest'][mediaQueryRule]['borderLeft'] = `${getSpacingValue(left.width || '')} ${left.style || ''} ${left.color || ''}!important`;
                    if (right)
                        styleObj['$nest'][mediaQueryRule]['borderRight'] = `${getSpacingValue(right.width || '')} ${right.style || ''} ${right.color || ''}!important`;
                }
                if (background) {
                    const value = getBackground(background)
                    styleObj['$nest'][mediaQueryRule]['background'] = value.background + '!important';
                }
                if (grid) {
                    const {
                        column,
                        columnSpan,
                        row,
                        rowSpan,
                        horizontalAlignment,
                        verticalAlignment,
                        area
                    } = grid;
                    if (column && columnSpan) {
                        styleObj['$nest'][mediaQueryRule]['gridColumn'] = `${column + ' / span ' + columnSpan}!important`;
                    }
                    else if (column)
                        styleObj['$nest'][mediaQueryRule]['gridColumnStart'] = `${column.toString()}!important`;
                    else if (columnSpan)
                        styleObj['$nest'][mediaQueryRule]['gridColumn'] = `${'span ' + columnSpan}!important`;
                    if (row && rowSpan)
                        styleObj['$nest'][mediaQueryRule]['gridRow'] = `${row + ' / span ' + rowSpan}!important`;
                    else if (row)
                        styleObj['$nest'][mediaQueryRule]['gridRowStart'] = `${row.toString()}!important`;
                    else if (rowSpan)
                        styleObj['$nest'][mediaQueryRule]['gridRow'] = `${'span ' + rowSpan}!important`;
                    if (area)
                        styleObj['$nest'][mediaQueryRule]['gridArea'] = `${area}!important`;
                    if (horizontalAlignment)
                        styleObj['$nest'][mediaQueryRule]['justifyContent'] = `${horizontalAlignment}!important`;
                    if (verticalAlignment)
                        styleObj['$nest'][mediaQueryRule]['alignItems'] = `${verticalAlignment}!important`;
                }
                if (position) {
                    styleObj['$nest'][mediaQueryRule]['position'] = `${position} !important`;
                }
                if (zIndex !== undefined && zIndex !== null) {
                    styleObj['$nest'][mediaQueryRule]['zIndex'] = `${zIndex} !important`;
                }
                if (top !== undefined && top !== null) {
                    styleObj['$nest'][mediaQueryRule]['top'] = `${getSpacingValue(top)} !important`;
                }
                if (left !== undefined && left !== null) {
                    styleObj['$nest'][mediaQueryRule]['left'] = `${getSpacingValue(left)} !important`;
                }
                if (right !== undefined && right !== null) {
                    styleObj['$nest'][mediaQueryRule]['right'] = `${getSpacingValue(right)} !important`;
                }
                if (bottom !== undefined && bottom !== null) {
                    styleObj['$nest'][mediaQueryRule]['bottom'] = `${getSpacingValue(bottom)} !important`;
                }
                if (maxHeight !== undefined && maxHeight !== null) {
                    styleObj['$nest'][mediaQueryRule]['maxHeight'] = `${getSpacingValue(maxHeight)} !important`;
                }
                if (maxWidth !== undefined && maxWidth !== null) {
                    styleObj['$nest'][mediaQueryRule]['maxWidth'] = `${getSpacingValue(maxWidth)} !important`;
                }
                if (width !== undefined && width !== null) {
                    styleObj['$nest'][mediaQueryRule]['width'] = `${getSpacingValue(width)} !important`;
                }
                if (height !== undefined && height !== null) {
                    styleObj['$nest'][mediaQueryRule]['height'] = `${getSpacingValue(height)} !important`;
                }
                if (minWidth !== undefined && minWidth !== null) {
                    styleObj['$nest'][mediaQueryRule]['minWidth'] = `${getSpacingValue(minWidth)} !important`;
                }
                if (minHeight !== undefined && minHeight !== null) {
                    styleObj['$nest'][mediaQueryRule]['minHeight'] = `${getSpacingValue(minHeight)} !important`;
                }
                if (overflow) {
                    if (typeof overflow === 'string') {
                        styleObj['$nest'][mediaQueryRule]['overflow'] = `${overflow} !important`;
                    } else {
                        const { x, y } = overflow || {};
                        if (x === y) {
                            styleObj['$nest'][mediaQueryRule]['overflow'] = `${x} !important`;
                        } else {
                            if (x) styleObj['$nest'][mediaQueryRule]['overflowX'] = `${x} !important`;
                            if (y) styleObj['$nest'][mediaQueryRule]['overflowY'] = `${y} !important`;
                        }
                    }
                }
                if (font) {
                    const { size, weight, style, name, color, bold, transform } = font;
                    if (size)
                        styleObj['$nest'][mediaQueryRule]['fontSize'] = `${size}!important`;
                    if (typeof bold === 'boolean') {
                        styleObj['$nest'][mediaQueryRule]['fontWeight'] = bold === true ? `bold !important` : `normal !important`;
                    }
                    if (weight)
                        styleObj['$nest'][mediaQueryRule]['fontWeight'] = `${weight}!important`;
                    if (style)
                        styleObj['$nest'][mediaQueryRule]['fontStyle'] = `${style}!important`;
                    if (name)
                        styleObj['$nest'][mediaQueryRule]['fontFamily'] = `${name}!important`;
                    if (color)
                        styleObj['$nest'][mediaQueryRule]['color'] = `${color}!important`;
                    if (transform)
                        styleObj['$nest'][mediaQueryRule]['textTransform'] = `${transform}!important`;
                }
                if (opacity !== undefined && opacity !== null) {
                    styleObj['$nest'][mediaQueryRule]['opacity'] = `${opacity}!important`;
                }
                if (stack) {
                    const { basis, grow, shrink } = stack;
                    if (basis !== undefined && basis !== null)
                        styleObj['$nest'][mediaQueryRule]['flexBasis'] = `${basis}!important`;
                    if (grow !== undefined && grow !== null)
                        styleObj['$nest'][mediaQueryRule]['flexGrow'] = `${grow}!important`;
                    if (shrink !== undefined && shrink !== null)
                        styleObj['$nest'][mediaQueryRule]['flexShrink'] = `${shrink}!important`;
                }
            }
        }
    }
    return styleObj;
}

export const getControlMediaQueriesStyleClass = (mediaQueries: IControlMediaQuery[], props: IProps) => {
    let styleObj: any = getControlMediaQueriesStyle(mediaQueries, props);
    return Styles.style(styleObj);
}

export const getOpacityStyleClass = (opacity: number | string) => {
    return Styles.style({
        opacity: opacity
    });
}