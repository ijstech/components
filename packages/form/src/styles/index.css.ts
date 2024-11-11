import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

export const formStyle = Styles.style({
    $nest: {
        'i-vstack > .form-group': {
            width: '100%'
        }
    }
})

export const formGroupStyle = Styles.style({
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    justifyContent: 'center'
})

export const groupStyle = Styles.style({
    border: `1px solid ${Theme.divider}`,
    borderRadius: 5,
    width: '100%',
    marginBottom: 5,
})

export const groupHeaderStyle = Styles.style({
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer'
})

export const groupBodyStyle = Styles.style({
    padding: 10
})

export const collapseBtnStyle = Styles.style({
    cursor: 'pointer',
    height: Theme.typography.fontSize,
    width: Theme.typography.fontSize
})

// Controls Style
export const inputStyle = Styles.style({
    width: '100% !important',
    $nest: {
        '& > input, & > textarea': {
            width: '100% !important',
            maxWidth: '100%',
            padding: '0.5rem 1rem',
            color: Theme.input.fontColor,
            backgroundColor: Theme.input.background,
            borderColor: Theme.input.background,
            borderRadius: '0.625rem',
            outline: 'none'
        },

        'i-color .input-span': {
            borderRadius: '0.625rem',

            $nest: {
                '> span': {
                    borderRadius: '0.375rem'
                }
            }
        },

        // '& > input:focus, & > textarea:focus': {
        //     backgroundColor: `darken(${Theme.input.background}, 20%)`,
        //     borderColor: `darken(${Theme.input.background}, 20%)`,
        // }
    }
});
export const datePickerStyle = Styles.style({
    display: 'inline-flex',
    width: '100% !important',
    borderRadius: '0.625rem',
    $nest: {
        '> input': {
            width: 'calc(100% - 24px) !important',
            maxWidth: 'calc(100% - 24px)',
            padding: '0.5rem 1rem',
            color: Theme.input.fontColor,
            backgroundColor: Theme.input.background,
            borderColor: Theme.input.background,
            outline: 'none'
        },
        '> input:focus ~ .datepicker-toggle': {
            borderColor: Theme.colors.info.main
        },
        '.datepicker-toggle': {
            backgroundColor: Theme.input.background,
            width: '42px'
        }
    }
})

export const comboBoxStyle = Styles.style({
    width: '100% !important',
    $nest: {
        '.selection': {
            width: '100% !important',
            maxWidth: '100%',
            padding: '0.5rem 1rem',
            color: Theme.input.fontColor,
            backgroundColor: Theme.input.background,
            borderColor: Theme.input.background,
            borderRadius: '0.625rem!important',
        },

        '.selection input': {
            color: 'inherit',
            backgroundColor: 'inherit',
            padding: 0
        },

        // '.selection:focus-within': {
        //     backgroundColor: `darken(${Theme.input.background}, 20%)`,
        //     borderColor: `darken(${Theme.input.background}, 20%)`
        // },

        '> .icon-btn': {
            justifyContent: 'center',
            borderColor: Theme.input.background,
            borderRadius: '0.625rem',
            width: '42px'
        }
    }
})

export const buttonStyle = Styles.style({
    padding: 5
})

export const iconButtonStyle = Styles.style({
    cursor: 'pointer',
    height: Theme.typography.fontSize,
    width: Theme.typography.fontSize
})

export const checkboxStyle = Styles.style({
    $nest: {
        '.checkmark': {
            width: '22px',
            height: '22px',
            borderRadius: '6px'
        },

        '.checkmark:after': {
            width: '4px',
            height: '8px',
            top: '4px'
        }
    }
})

export const listHeaderStyle = Styles.style({
    padding: '10px 0px',
    borderBottom: `1px solid ${Theme.divider}`,
    marginBottom: 10,
    minHeight: '60px',
    alignItems: 'center',
    fontWeight: 600
})

export const listBtnAddStyle = Styles.style({
    color: Theme.colors.primary.contrastText,
    backgroundColor: Theme.colors.primary.main,
    padding: '0.5rem 1rem',
    borderRadius: 0,
    cursor: 'pointer',
})

export const listColumnHeaderStyle = Styles.style({
    padding: '10px 0',
    textAlign: 'center'
})

export const listItemStyle = Styles.style({
    $nest: {
        'i-panel': {
            $nest: {
                'i-input': {
                    width: '100% !important'
                },
                'input': {
                    width: '100% !important'
                },
                'i-color': {
                    $nest: {
                        '.i-color': {
                            width: '100% !important'
                        },
                        '.input-span': {
                            width: '100% !important'
                        }
                    }
                },
                'i-checkbox': {
                    height: 'auto !important',
                    $nest: {
                        '.i-checkbox': {
                            width: '100%',
                            justifyContent: 'center'
                        },
                        '.i-checkbox_label': {
                            display: 'none'
                        }
                    }
                }
            }
        }
    }
})

export const listVerticalLayoutStyle = Styles.style({
    $nest: {
        '& > i-grid-layout:not(:last-child)': {
            paddingBottom: 10,
            borderBottom: '1px solid var(--divider)',
        },
        '& > i-grid-layout > i-panel': {
            flexDirection: 'row',
            flexWrap: 'wrap',
            $nest: {
                '> i-hstack:first-child': {
                    width: '25% !important',
                },
                '> :nth-child(2)': {
                    width: 'calc(75% - 5px) !important'
                },
                'i-checkbox': {
                    width: '100%',
                    $nest: {
                        '.i-checkbox': {
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            justifyContent: 'flex-end',
                            gap: 5
                        },
                        '.i-checkbox_label': {
                            display: 'flex',
                            paddingLeft: 0,
                            width: '25%'
                        }
                    }
                }
            }
        }
    }
})

export const listItemBtnDelete = Styles.style({
    cursor: 'pointer',
    placeSelf: 'center',
    height: Theme.typography.fontSize,
    width: Theme.typography.fontSize
})

export const tabsStyle = Styles.style({
    marginBottom: 41,

    $nest: {
        '.tabs-nav-wrap': {
            $nest: {
                '.tabs-nav': {
                    borderColor: 'transparent',
                    height: '54px'
                },

                'i-tab': {
                    border: 0,
                    fontFamily: Theme.typography.fontFamily,
                    fontSize: Theme.typography.fontSize,
                    fontWeight: 600,
                    borderBottom: '1px solid transparent',
                    background: 'transparent',
                    color: Theme.text.secondary,
                    margin: '0 0.75rem',
                    padding: '0.5rem 0',
                    transition: 'color .2s ease',

                    $nest: {
                        "&:first-of-type": {
                            marginLeft: 0
                        },

                        '&:not(.disabled):hover': {
                            color: Theme.text.primary,
                        },

                        '&:not(.disabled).active': {
                            background: 'transparent',
                            color: Theme.colors.info.main,
                            borderBottom: `1px solid ${Theme.colors.info.main}`,
                        },

                        '.tab-item': {
                            padding: 0
                        }
                    }
                }
            }
        },
        '.tabs-content': {
            overflow: 'visible'
        }
    }
})

export const cardStyle = Styles.style({
    // background: Theme.background.main,
    border: `1px solid ${Theme.divider}`
})

export const cardHeader = Styles.style({
    padding: 20,
    borderBottom: `1px solid ${Theme.divider}`,
    cursor: 'pointer'
})

export const cardBody = Styles.style({
    padding: 20
})

export const uploadStyle = Styles.style({
    height: 'auto',
    width: '100%',
    margin: 0,
    fontFamily: Theme.typography.fontFamily,
    $nest: {
        '> .i-upload-wrapper': {
            marginBottom: 0,
            borderRadius: 5
        }
    }
});

export const tokenInputStyle = Styles.style({
    $nest: {
        '#gridTokenInput': {
            border: '1px solid var(--divider) !important',
            borderRadius: '5px !important',
            padding: '0.31rem !important',
            background: 'transparent',
            $nest: {
                '&:hover': {
                    borderColor: `${Theme.colors.primary.main} !important`
                }
            }
        },
        '#btnToken': {
            display: 'flex',
            justifyContent: 'space-between',
            $nest: {
                'i-icon': {
                    width: '20px !important',
                    height: '20px !important'
                }
            }
        },
        'i-vstack.custom-border': {
            marginBlock: '0 !important'
        }
    }
})