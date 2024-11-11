import * as Styles from "@ijstech/style";
let Theme = Styles.Theme.ThemeVars;

const gradient = 'linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)'
const opacity = `var(--opacity-color, linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%))`;

Styles.cssRule('i-color', {
  $nest: {
    '.i-color': {
      minHeight: 25,
      height: '100%',
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center'
    },
    '.input-span': {
      height: '100%',
      minWidth: 100,
      display: 'inline-flex',
      alignItems: 'center',
      border: `1px solid ${Theme.divider}`,
      padding: 4,
      $nest: {
        'span': {
          background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=) #fff',
          height: '100%',
          width: '100%',
          minHeight: 12,
          display: 'inline-block'
        }
      }
    },
    '.color-picker-modal': {
      $nest: {
        '.custom-range': {
          $nest: {
            'input[type="range"]::-webkit-slider-thumb': {
              backgroundColor: 'rgb(248, 248, 248)',
              width: 12,
              height: 12,
              marginTop: -3,
              boxShadow: 'rgba(0, 0, 0, 0.37) 0px 1px 4px 0px'
            },
            'input[type="range"]': {
              borderRadius: 2,
              opacity: 1,
              height: 7
            },
            'input[type="range"]::-webkit-slider-runnable-track': {
              borderRadius: 2,
              opacity: 1,
              height: 7,
              marginLeft: -7,
              marginRight: -7
            }
          }
        },
        '.color-palette': {
          $nest: {
            'input[type="range"]': {
              backgroundImage: gradient
            },
            'input[type="range"]::-webkit-slider-runnable-track': {
              background: gradient
            }
          }
        },
        '.color-slider': {
          $nest: {
            'input[type="range"]': {
              backgroundImage: opacity,
              background: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center, ${opacity}`
            },
            'input[type="range"]::-webkit-slider-runnable-track': {
              background: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center, var(--opacity-color)`
            }
          }
        },
        '.pnl-select': {
          'boxShadow': 'rgba(0, 0, 0, 0.3) 0px 0px 2px, rgba(0, 0, 0, 0.3) 0px 4px 8px'
        },
        '.color-picker': {
          justifyContent: 'center',
          alignItems: 'center'
        },
        '.color-input-group': {
          width: 165,
          display: 'flex',
          gap: '2px',
          flex: '1'
        },
        '.color-input': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          $nest: {
            'input': {
              fontSize: 11,
              width: '100%',
              borderRadius: 2,
              border: 'none',
              boxShadow: 'rgb(218, 218, 218) 0px 0px 0px 1px inset',
              height: 20,
              textAlign: 'center',
              letterSpacing: 1.5
            },
            'span': {
              fontSize: 11
            }
          }
        },
        '.selected-color': {
          position: 'relative',
          width: 24,
          height: 24,
          borderRadius: '50%',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset',
          background: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center`,
          overflow: 'hidden',
          $nest: {
            'i-panel': {
              backgroundColor: 'var(--selected-color)'
            }
          }
        },
        '.color-preview': {
          userSelect: 'none',
          touchAction: 'none',
          $nest: {
            '> i-panel': {
              width: '100%',
              height: '100%',
              position: 'absolute',
              inset: '0px',
              background: 'linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0))',
              $nest: {
                '> i-panel': {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  inset: '0px',
                  background: 'linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0))'
                }
              }
            },
            '#iconPointer': {
              width: 12,
              height: 12,
              borderRadius: '50%',
              boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1.25px',
              transform: 'translate(-6px, -6px)',
              position: 'absolute',
              cursor: 'default',
              top: 0,
              left: 0,
              $nest: {
                '&::before': {
                  width: 12,
                  height: 12,
                  content: '""',
                  position: 'absolute',
                  borderRadius: '50%',
                  boxShadow: 'rgb(128, 128, 128) 0px 0px 0px 0.75px inset',
                }
              }
            }
          }
        },
        'i-icon svg': {
          fill: 'inherit'
        },
        '.modal': {
          paddingBlock: 0,
          backgroundColor: 'transparent'
        }
      }
    }
  }
})
