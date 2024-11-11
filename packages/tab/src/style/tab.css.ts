import { getControlMediaQueriesStyle } from '@ijstech/base';
import * as Styles from '@ijstech/style';
import { ITabMediaQuery } from '../tab';
import { getMediaQueryRule } from '@ijstech/base';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-tabs', {
    display: 'block',
    $nest: {
        '> .tabs-nav-wrap': {
            display: 'flex',
            flex: 'none',
            overflow: 'hidden',
            // background: "#252525",
            $nest: {
                '.tabs-nav': {
                    position: 'relative',
                    display: 'flex',
                    flex: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    borderBottom: `1px solid #252525`,
                    margin: 0,
                },
                '.tabs-nav:not(.is-closable) span.close': {
                    display: 'none'
                },
                '.tabs-nav .has-icon span.close': {
                    display: 'none'
                },
                '.tabs-nav.is-closable i-tab:not(.disabled):hover span.close': {
                    visibility: 'visible',
                    opacity: 1,
                    display: 'inline-block'
                },
                '.tabs-nav.is-closable i-tab:not(.disabled):hover .pnl-right i-icon': {
                    display: 'none'
                },
                '.tabs-nav.is-closable i-tab:not(.disabled).active span.close': {
                    visibility: 'visible',
                    opacity: 1,
                },
                'i-tab': {
                    position: 'relative',
                    display: 'inline-flex',
                    overflow: 'hidden',
                    color: 'rgba(255, 255, 255, 0.55)',
                    // background: "#2e2e2e",
                    marginBottom: '-1px',
                    border: `1px solid #252525`,
                    alignItems: 'center',
                    font: 'inherit',
                    textAlign: 'center',
                    minHeight: '36px',
                    $nest: {
                        '&:not(.disabled):hover': {
                            cursor: 'pointer',
                            color: '#fff'
                        },
                        '&:not(.disabled).active.border': {
                            borderColor: `${Theme.divider} ${Theme.divider} #fff`,
                            borderBottomWidth: '1.5px',
                        },
                        '.tab-item': {
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '0.5rem 1rem',
                            gap: '5px',
                            $nest: {
                                'i-image': {
                                    display: 'flex'
                                }
                            }
                        }
                    }
                },
                'i-tab:not(.disabled).active': {
                    backgroundColor: '#1d1d1d',
                    borderBottomColor: 'transparent',
                    color: '#fff'
                },
            }
        },
        '&:not(.vertical) > .tabs-nav-wrap': {
            $nest: {
                '&:hover': {
                    overflowX: 'auto',
                    overflowY: 'hidden',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#4b4b4b', 
                    borderRadius: '5px',
                },
                '&::-webkit-scrollbar': {
                    height: '3px',
                }
            }
        },
        '&.vertical': {
            display: 'flex',
            $nest: {
                '> .tabs-nav-wrap .tabs-nav': {
                    display: 'flex',
                    flexDirection: 'column',
                },
                '> .tabs-nav-wrap .tabs-nav:hover': {
                    overflowY: 'auto',
                },
                '> .tabs-nav-wrap .tabs-nav::-webkit-scrollbar-thumb': {
                    background: '#4b4b4b', 
                    borderRadius: '5px',
                },
                '> .tabs-nav-wrap .tabs-nav::-webkit-scrollbar': {
                    width: '3px',
                },
            }
        },
        '> .tabs-content': {
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            width: '100%',
            height: '100%',
            minHeight: '200px',
            $nest: {
                '&::after': {
                    clear: 'both'
                },
                'i-label .f1yauex0': {
                    whiteSpace: 'normal'
                },
                '.content-pane': {
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    flex: 'none'
                }
            }
        },
        'span.close': {
            width: '18px',
            height: '18px',
            borderRadius: '5px',
            lineHeight: '18px',
            fontSize: '18px',
            visibility: 'hidden',
            opacity: 0,
            $nest: {
                '&:hover': {
                    background: 'rgba(78, 78, 78, 0.48)'
                }
            }
        },
        '.pnl-right': {
            display: 'inline-flex',
            justifyContent: 'end',
            width: 20,
            overflow: 'hidden',
            marginLeft: 5,
            marginRight: -5
        }
    }
})

export const getTabMediaQueriesStyleClass = (mediaQueries: ITabMediaQuery[]) => {
    let styleObj: any = getControlMediaQueriesStyle(mediaQueries, { display: 'block' });
    for (let mediaQuery of mediaQueries) {
        let mediaQueryRule = getMediaQueryRule(mediaQuery);
        if (mediaQueryRule) {
            const nestObj = styleObj['$nest'][mediaQueryRule]['$nest'] || {};
            const ruleObj = styleObj['$nest'][mediaQueryRule];
            styleObj['$nest'][mediaQueryRule] = {
                ...ruleObj,
                $nest: {
                    ...nestObj,
                    '> .tabs-nav-wrap .tabs-nav': {}
                }
            };
            const {
                mode,
                visible
            } = mediaQuery.properties || {};
            if (mode) {
                styleObj['$nest'][mediaQueryRule]['display'] = mode === 'vertical' ? 'flex !important' : 'block !important';
                if (mode === 'horizontal') {
                    styleObj['$nest'][mediaQueryRule]['$nest']['> .tabs-nav-wrap .tabs-nav']['flexDirection'] = 'row !important';
                    styleObj['$nest'][mediaQueryRule]['$nest']['> .tabs-nav-wrap .tabs-nav']['width'] = '100%';
                    styleObj['$nest'][mediaQueryRule]['$nest']['> .tabs-nav-wrap .tabs-nav']['justifyContent'] = 'center';
                } else {
                    styleObj['$nest'][mediaQueryRule]['$nest']['> .tabs-nav-wrap .tabs-nav']['flexDirection'] = 'column !important';
                    styleObj['$nest'][mediaQueryRule]['$nest']['> .tabs-nav-wrap .tabs-nav']['width'] = 'auto';
                    styleObj['$nest'][mediaQueryRule]['$nest']['> .tabs-nav-wrap .tabs-nav']['justifyContent'] = 'start';
                }
            }
        }
    }
    return Styles.style(styleObj);
}