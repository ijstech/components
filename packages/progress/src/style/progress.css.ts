import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

const loading = Styles.keyframes({
    '0%': {
        left: '-100%'
    },
    '100%': {
        left: '100%'
    }
})

Styles.cssRule('i-progress', {
    display: 'block',
    maxWidth: '100%',
    verticalAlign: 'baseline',
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.fontSize,
    color: Theme.text.primary,
    position: 'relative',
    $nest: {
        '&.is-loading .i-progress_overlay': {
            transform: 'translateZ(0)',
            animation: `${loading} 3s infinite`
        },
        '.i-progress': {
            boxSizing: 'border-box',
            margin: 0,
            minWidth: 0,
            width: '100%',
            display: 'block'
        },
        '.i-progress--grid': {
            display: 'grid',
            gap: 20,
            gridTemplateColumns: 'auto 1fr 80px',
            alignItems: 'center'
        },
        '.i-progress--exception': {
            $nest: {
                '> .i-progress_wrapbar > .i-progress_overlay': {
                    backgroundColor: Theme.colors.error.light
                },
                '> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item': {
                    backgroundColor: Theme.colors.error.light
                },
                '.i-progress_item.i-progress_item-start': {
                    borderColor: Theme.colors.error.light
                },
                '.i-progress_item.i-progress_item-end': {
                }
            }
        },
        '.i-progress--success': {
            $nest: {
                '> .i-progress_wrapbar > .i-progress_overlay': {
                    backgroundColor: Theme.colors.success.light
                },
                '> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item': {
                    backgroundColor: Theme.colors.success.light
                },
                '.i-progress_item.i-progress_item-start': {
                    borderColor: Theme.colors.success.light
                },
                '.i-progress_item.i-progress_item-end': {
                }
            }
        },
        '.i-progress--warning': {
            $nest: {
                '> .i-progress_wrapbar > .i-progress_overlay': {
                    backgroundColor: Theme.colors.warning.light
                },
                '> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item': {
                    backgroundColor: Theme.colors.warning.light
                },
                '.i-progress_item.i-progress_item-start': {
                    borderColor: Theme.colors.warning.light
                },
                '.i-progress_item.i-progress_item-end': {
                }
            }
        },
        '.i-progress--active': {
            $nest: {
                '> .i-progress_wrapbar > .i-progress_overlay': {
                    backgroundColor: Theme.colors.primary.light
                },
                '> .i-progress_wrapbar > .i-progress_bar .i-progress_bar-item': {
                    backgroundColor: Theme.colors.primary.light
                },
                '.i-progress_item.i-progress_item-start': {
                    backgroundColor: 'transparent',
                    borderColor: Theme.colors.primary.light
                }
            }
        },
        '.i-progress_wrapbar': {
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
            minWidth: 0,
            order: 2,
            minHeight: 2,
            borderRadius: 'inherit',
            backgroundColor: Theme.divider,
            $nest: {
                '&.has-steps': {
                    backgroundColor: 'transparent',
                },
                '.i-progress_bar': {
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1px',
                    $nest: {
                        '&.has-bg': {
                            backgroundColor: Theme.divider
                        },
                        '.i-progress_bar-item': {
                            flex: 'auto',
                            backgroundColor: Theme.divider
                        }
                    }
                },
                '.i-progress_overlay': {
                    position: 'absolute',
                    minWidth: 0,
                    height: '100%'
                }
            }
        },
        '.i-progress_item': {
            boxSizing: 'border-box',
            margin: '0px -1.2px 0px 0px',
            minWidth: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            $nest: {
                '&.i-progress_item-start': {
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderImage: 'initial',
                    borderRadius: 14,
                    borderColor: Theme.divider,
                    padding: '4px 12px',
                    order: 1
                },
                '&.i-progress_item-end': {
                    boxSizing: 'border-box',
                    margin: 0,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'default',
                    position: 'relative',
                    order: 3,
                    alignItems: 'flex-start',
                }
            }
        },
        '&.i-progress--stretch': {
            $nest: {
                '@media only screen and (max-width: 768px)': {
                    $nest: {
                        '.i-progress_wrapbar': {
                            display: 'none !important'
                        },
                        '.i-progress_item-end': {
                            display: 'none !important'
                        },
                        '.is-mobile': {
                            display: 'inline-block'
                        },
                        '.i-progress--grid': {
                            gridTemplateColumns: 'auto',
                            justifyContent: 'center'
                        }
                    }
                }
            }
        },
        '.i-progress--circle ~ .i-progress_text': {
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            textAlign: 'center',
            transform: 'translateY(-50%)'
        },
        '.i-progress--line ~ .i-progress_text': {
            display: 'inline-block',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
        },
        '.i-progress--line': {
            borderRadius: 'inherit'
        }
    }
})
