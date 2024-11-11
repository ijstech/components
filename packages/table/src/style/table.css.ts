import * as Styles from '@ijstech/style';
import { TableColumnElement } from '../tableColumn';
import { ITableMediaQuery } from '../table';
import { ControlElement, getBackground, getControlMediaQueriesStyle, getSpacingValue } from '@ijstech/base';
import { getMediaQueryRule } from '@ijstech/base';
const Theme = Styles.Theme.ThemeVars;

export const tableStyle = Styles.style({
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.fontSize,
    color: Theme.text.primary,
    display: 'block',
    $nest: {
        '> .i-table-container': {
            overflowX: 'auto'
        },
        '.i-table-cell': {
            // padding: '1rem',
            overflowWrap: 'break-word',
            position: 'relative',
            // overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal'
        },
        '> .i-table-container > table': {
            width: '100%',
            textAlign: 'left',
            borderCollapse: 'separate',
            borderSpacing: 0
            // tableLayout: 'fixed'
        },
        '.i-table-header>tr>th': {
            fontWeight: 600,
            transition: 'background .3s ease',
            borderBottom: `1px solid ${Theme.divider}`
        },
        '.i-table-body>tr>td': {
            borderBottom: `1px solid ${Theme.divider}`,
            transition: 'background .3s ease'
        },
        'tr:hover td': {
            background: Theme.action.hoverBackground,
            color: Theme.action.hover
        },
        '&.i-table--bordered': {
            $nest: {
                '> .i-table-container > table': {
                    borderTop: `1px solid ${Theme.divider}`,
                    borderLeft: `1px solid ${Theme.divider}`,
                    borderRadius: '2px'
                },
                '> .i-table-container > table .i-table-cell': {
                    borderRight: `1px solid ${Theme.divider} !important`,
                    borderBottom: `1px solid ${Theme.divider}`
                }
            }
        },
        '.i-table-header i-table-column': {
            display: 'inline-flex',
            gap: 10,
            alignItems: 'center'
        },
        '.i-table-sort': {
            position: 'relative',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 20,
            $nest: {
                '.sort-icon': {
                    display: 'block',
                    cursor: 'pointer'
                },
                '.sort-icon.sort-icon--active > svg': {
                    fill: Theme.colors.primary.main
                },
                '.sort-icon.sort-icon--desc': {
                    marginTop: -5
                }
            }
        },
        '.i-table-pagi': {
            display: 'flex',
            width: '100%',
            $nest: {
                '&.is--left': {
                    justifyContent: 'flex-start'
                },
                '&.is--right': {
                    justifyContent: 'flex-end'
                },
                '&.is--center': {
                    justifyContent: 'center'
                }
            }
        },
        '.i-table-cell--expand': {
            cursor: 'pointer',
            $nest: {
                'i-icon': {
                    display: 'inline-block'
                },
                'i-icon svg': {
                    fill: Theme.text.primary
                }
            }
        },
        '.i-table-row--child > td': {
            borderRight: `1px solid ${Theme.divider}`
        },
        "@media (max-width: 767px)": {
            $nest: {
                '.hidden-mobile': {
                    display: 'none !important'
                },
            }
        },
        "@media (min-width: 768px)": {
            $nest: {
                '.hidden-desktop': {
                    display: 'none !important'
                },
            }
        },
    }
})

export const getCustomStylesClass = (styles: ControlElement) => {
    let styleObj: any = {};
    const { padding, background, font, cursor, height} = styles || {};
    const { top = '1rem', right = '1rem', bottom = '1rem', left = '1rem' } = padding || {};
    styleObj.padding = `${getSpacingValue(top)} ${getSpacingValue(right)} ${getSpacingValue(bottom)} ${getSpacingValue(left)}`;
    if (font) {
      const { color = '', size = '', name = '', style = '', transform = 'none', bold, weight = ''}  = font;
      styleObj.color = color;
      styleObj.fontSize = size
      styleObj.fontFamily = name;
      styleObj.fontStyle = style;
      styleObj.textTransform = transform;
      styleObj.fontWeight = bold ? 'bold' : `${weight}`;
    }
    if (background) styleObj.background = getBackground(background)?.background || '';
    if (cursor) styleObj.cursor = cursor;
    if (height !== undefined && height !== null) {
        styleObj.height = getSpacingValue(height);
    }
    return Styles.style(styleObj);
  }

export const getTableMediaQueriesStyleClass = (columns: TableColumnElement[],mediaQueries: ITableMediaQuery[]) => {
    let styleObj: any = getControlMediaQueriesStyle(mediaQueries);
    for (let mediaQuery of mediaQueries) {
        let mediaQueryRule = getMediaQueryRule(mediaQuery);
        if (mediaQueryRule) {
            const ruleObj = styleObj['$nest'][mediaQueryRule];
            styleObj['$nest'][mediaQueryRule] = {
                ...ruleObj,
                $nest: {}
            };
            const {
                fieldNames,
                expandable
            } = mediaQuery.properties || {};
            if (fieldNames) {
                for (let column of columns) {
                    const fieldName = column.fieldName || 'action';
                    if (!fieldNames.includes(column.fieldName)) {
                        styleObj['$nest'][mediaQueryRule]['$nest'][`[data-fieldname="${fieldName}"]`] = {
                            display: 'none'
                        }
                    } else if (column.visible === false) {
                        styleObj['$nest'][mediaQueryRule]['$nest'][`[data-fieldname="${fieldName}"]`] = {
                            display: 'table-cell !important'
                        }
                        styleObj['$nest'][mediaQueryRule]['$nest'][`[data-fieldname="${fieldName}"]`] = {
                            display: 'table-cell !important',
                            $nest: {
                                '> i-table-column': {
                                    display: 'table-cell !important'
                                }
                            }
                        }
                    }
                }
            }
            if (expandable) {
                styleObj['$nest'][mediaQueryRule]['$nest']['.i-table-row--child'] = {
                    display: expandable.rowExpandable ? 'none' : 'none !important'
                }
            }
        }
    }
    return Styles.style(styleObj);
}
