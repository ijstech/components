import * as Styles from '@ijstech/style'
const Theme = Styles.Theme.ThemeVars

Styles.cssRule('i-tree-view', {
  display: 'block',
  overflowY: 'auto',
  overflowX: 'hidden',
  fontFamily: Theme.typography.fontFamily,
  fontSize: Theme.typography.fontSize,
  $nest: {
    '.i-tree-node_content': {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '1em',
      border: '1px solid transparent'
    },
    '> i-tree-node > .i-tree-node_content': {
      paddingLeft: 0
    },
    'i-tree-node': {
      display: 'block',
      position: 'relative'
    },
    '> i-tree-node:not(.has-children) .i-tree-node_icon:not(.custom-icon)': {
      display: 'none'
    },
    'i-tree-node.is-checked > .i-tree-node_children': {
      display: 'block'
    },
    'i-tree-node.is-checked > .i-tree-node_content > .i-tree-node_icon': {
      transform: 'rotate(90deg)'
    },
    'input[type="checkbox"]': {
      position: 'absolute',
      clip: 'rect(0, 0, 0, 0)',
    },
    '.i-tree-node_children': {
      display: 'none',
    },
    '.i-tree-node_label': {
      position: 'relative',
      display: 'inline-block',
      color: Theme.text.primary,
      cursor: 'pointer',
      fontSize: 'inherit',
    },
    '.i-tree-node_icon': {
      display: 'inline-block',
      transition: 'all ease 0.4s',
      $nest: {
        'svg': {
          width: 14,
          height: 14
        },
        'i-image': {
          display: 'flex'
        },
        '&:not(.custom-icon)': {
          display: 'none'
        }
      }
    },
    'input ~ .i-tree-node_icon:not(.custom-icon), input ~ .is-right > .i-tree-node_icon:not(.custom-icon)': {
      display: 'inline-block'
    },
    'input ~ .i-tree-node_label': {
      maxWidth: 'calc(100% - 15px)'
    },
    '.i-tree-node_icon + .i-tree-node_label': {
      paddingLeft: '0.3em'
    },
    '&.i-tree-view': {
      padding: 0,
      position: 'relative',
      $nest: {
        '.is-checked:before': {
          borderLeft: `1px solid ${Theme.divider}`,
          height: 'calc(100% - 1em)',
          top: '1em'
        },
        '.i-tree-node_children > .is-checked:before': {
          height: 'calc(100% - 25px)',
          top: 25
        },
        'i-tree-node.active > .i-tree-node_content': {
          backgroundColor: Theme.action.selectedBackground,
          // border: `1px solid ${Theme.colors.info.dark}`,
          color: Theme.action.selected,
          $nest: {
            '> .i-tree-node_label': {
              color: Theme.action.selected
            }
          }
        },
        '.i-tree-node_content:hover': {
          backgroundColor: Theme.action.hoverBackground,
          color: Theme.action.hover,
          $nest: {
            '> .is-right .button-group *': {
              display: 'inline-flex'
            },
            '.hide-on-show': {
              display: 'none !important'
            }
          }
        },
        'input[type="checkbox"]': {
          margin: 0
        },
        '.i-tree-node_label': {
          padding: '.2rem .3rem .2em 0',
          maxWidth: 'calc(100% - 30px)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }
    },
    '&.shown-line': {
      $nest: {
        '> i-tree-node.has-children': {
          marginLeft: '1em'
        },
        'input ~ .i-tree-node_label:before': {
          background: Theme.colors.primary.main,
          color: Theme.colors.primary.contrastText,
          position: 'relative',
          zIndex: '1',
          float: 'left',
          margin: '0 1em 0 -2em',
          width: '1em',
          height: '1em',
          borderRadius: '0.2em',
          content: "'+'",
          textAlign: 'center',
          lineHeight: '.9em',
        },
        'input:checked ~ .i-tree-node_label:before': {
          content: "'–'",
        },
        'i-tree-node': {
          padding: '0 0 1em 1em',
          $nest: {
            '&.active': {
              $nest: {
                '> .i-tree-node_label': {
                  color: '#55f',
                }
              }
            },
          },
        },
        '.i-tree-node_children i-tree-node': {
          padding: '.5em 0 0 .9em'
        },
        'i-tree-node:last-of-type:before': {
          height: '1em',
          bottom: 'auto',
        },
        ' i-tree-node:before': {
          position: 'absolute',
          top: '0',
          bottom: '0',
          left: '-.1em',
          display: 'block',
          width: '1px',
          borderLeft: `1px solid ${Theme.divider}`,
          content: "''",
        },
        '.i-tree-node_icon:not(.custom-icon)': {
          display: 'none'
        },
        '.i-tree-node_content': {
          paddingLeft: `0 !important`
        },
        'i-tree-node .i-tree-node_label:after': {
          position: 'absolute',
          top: '.25em',
          left: '-1em',
          display: 'block',
          height: '0.5em',
          width: '1em',
          borderBottom: `1px solid ${Theme.divider}`,
          borderLeft: `1px solid ${Theme.divider}`,
          borderRadius: ' 0 0 0 0',
          content: "''",
        },
        'i-tree-node input:checked ~ .i-tree-node_label:after': {
          borderRadius: '0 .1em 0 0',
          borderTop: `1px solid ${Theme.divider}`,
          borderRight: `0.5px solid ${Theme.divider}`,
          borderBottom: '0',
          borderLeft: '0',
          bottom: '0',
          height: 'auto',
          top: '.5em'
        },
        '.i-tree-node_label': {
          overflow: 'unset'
        }
      }
    },
    '.text-input': {
      border: 'none',
      outline: '0',
      height: '100%',
      width: '100%',
      $nest: {
        '&:focus': {
          borderBottom: `2px solid ${Theme.colors.primary.main}`
        }
      }
    },
    '.button-group': {
      display: 'inline-flex',
      alignItems: 'center',
      position: 'relative',
      zIndex: 999,
      transition: '.3s all ease',
      gap: 5,
      cursor: 'pointer',
      marginLeft: 5,
      $nest: {
        '*': {
          display: 'none'
        }
      }
    },
    '.is-right': {
      marginLeft: 'auto',
      width: 'auto'
    }
  }
})
