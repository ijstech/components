import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-nav', {
    border: `1px solid ${Theme.divider}`,
    $nest: {
        '> i-vstack': {
            alignItems: 'center',
            height: '100%',
            $nest: {
                '.search-container': {
                    width: '100%',
                    padding: 10,
                    borderBottom: `1px solid ${Theme.divider}`,
                    alignItems: 'center',
                    gap: 5,
                    $nest: {
                        '.clear': {
                            cursor: 'pointer'
                        },
                        'i-input': {
                            $nest: {
                                'input': {
                                    background: 'transparent',
                                    border: '0',
                                    borderBottom: `1px solid ${Theme.divider}`
                                }
                            }
                        }
                    }
                },
                '.nav-wrapper': {
                    width: '100%',
                    overflow: 'auto',
                    paddingBottom: 50
                }
            }
        },
        'i-nav-item': {
            cursor: 'pointer',
            background: Theme.background.main,
            borderLeft: '3px solid transparent',
            borderBottom: `1px solid ${Theme.divider}`,
            $nest: {
                '> i-grid-layout': {
                    height: 50,
                    padding: 10,
                    gap: 5,
                    alignItems: 'center'
                },
                'i-icon': {
                    height: Theme.typography.fontSize,
                    width: Theme.typography.fontSize,
                    fill: Theme.colors.primary.main
                },
                '&.active': {
                    color: Theme.colors.primary.contrastText,
                    background: Theme.colors.primary.main,
                    borderLeft: `3px solid ${Theme.colors.primary.main}`
                }
            }
        }
    }
})
