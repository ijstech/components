import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

const scrollBar = {
    '&::-webkit-scrollbar-track': {
        borderRadius: '12px',
        border: '1px solid transparent',
        background: Theme.action.hover
    },
    '&::-webkit-scrollbar': {
        width: '8px',
        backgroundColor: 'unset'
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: '12px',
        background: Theme.action.active
    }
}

Styles.cssRule('i-schema-designer', {
    $nest: {
        'i-label': {
            padding: '5px 0'
        },
        'i-tabs': {
            $nest: {
                '.cs-webkit--scrollbar': {
                    $nest: scrollBar
                }
            }
        },
        'i-input': {
            height: '30px !important',
            width: 'calc(100% - 15px) !important',
            $nest: {
                'input[type="color"]': {
                    width: '60px !important'
                },
                'input': {
                    height: '30px !important',
                    width: '100% !important',
                    border: 0,
                    borderBottom: `0.5px solid ${Theme.divider}`,
                    background: 'transparent'
                },
                'textarea': {
                    height: '100% !important',
                    border: `0.5px solid ${Theme.divider}`,
                    borderRadius: '1em',
                    background: 'transparent',
                    $nest: scrollBar
                },
                '&.cs-json--text': {
                    height: '100% !important'
                }
            }
        },
        'i-combo-box': {
            height: '30px !important',
            width: 'calc(100% - 15px)',
            $nest: {
                'input': {
                    background: 'transparent !important',
                    height: '30px !important',
                    border: '0 !important',
                    borderBottom: `0.5px solid ${Theme.divider} !important`
                },
                '.selection': {
                    background: 'transparent',
                    padding: 0,
                    border: 0
                },
                'span.icon-btn': {
                    border: '0',
                    borderBottom: `0.5px solid ${Theme.divider}`,
                    borderRadius: '0',
                    height: '30px !important',
                    width: '32px !important',
                    padding: '3px',
                    $nest: {
                        'i-icon': {
                            padding: '5px',
                            height: '100% !important',
                            width: '100% !important'
                        }
                    }
                }
            }
        },
        'i-grid-layout': {
            alignItems: 'center'
        },
        'i-icon': {
            cursor: 'pointer',
            $nest: {
                '&.disabled': {
                    cursor: 'default'
                }
            }
        },
        'i-button': {
            background: Theme.colors.primary.main,
            color: Theme.colors.primary.contrastText
        },
        '.cs-wrapper--header': {
            padding: '5px 10px',
            borderRadius: 10
        },
        '.cs-width--input': {
            width: 'calc(100% - 65px) !important',
            minWidth: 100
        },
        '.cs-prefix--items': {
            $nest: {
                '.cs-box--shadow': {
                    boxShadow: Theme.shadows[2]
                }
            }
        },
        '.cs-box--enum': {
            boxShadow: Theme.shadows[2],
            padding: '8px 16px',
            borderRadius: 8,
            minWidth: 100,
            $nest: {
                '.cs-width--input': {
                    width: 'calc(100% - 70px) !important'
                }
            }
        },
        '.cs-enum--value': {
            textAlign: 'center',
            wordBreak: 'break-word'
        },
        '.cs-ui--schema': {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            $nest: {
                '&> i-panel': {
                    minWidth: 150
                }
            }
        },
        'i-panel.invalid': {
            $nest: {
                'i-label': {
                    color: 'red'
                }
            }
        }
    }
})
