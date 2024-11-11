import * as Styles from "@ijstech/style";
let Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-range', {
    position: 'relative',
    display: 'inline-block',
    fontFamily: Theme.typography.fontFamily,
    fontSize: Theme.typography.fontSize,
    '$nest': {
        "*": {
            boxSizing: "border-box",
        },
        '> span': {
            overflow: 'hidden',
        },
        '> span > label': {
            boxSizing: 'border-box',
            color: Theme.text.primary,
            display: 'inline-block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle',
            textAlign: 'right',
            paddingRight: 4,
            height: '100%'
        },
        '.slider': {
            position: 'relative',
            display: 'inline-block',
        },
        'input[type="range"]': {
            '-webkit-appearance': 'none',
            appearance: 'none',
            background: '#d3d3d3',
            backgroundImage: `linear-gradient(var(--track-color, ${Theme.colors.info.main}), var(--track-color, ${Theme.colors.info.main}))`,
            backgroundSize: '0% 100%',
            backgroundRepeat: 'no-repeat !important',
            borderRadius: '0.5rem',
            opacity: 0.7,
            border: 0,
            margin: 0,
            width: 'inherit',
            boxSizing: 'border-box',
            outline: 'none',
            verticalAlign: 'middle'
        },
        'input[type="range"]:not(:disabled)': {
            cursor: 'pointer',
        },
        'input[type="range"]:hover': {
            opacity: 1
        },
        'input[type="range"]:focus': {
            outline: 'none',
        },
        'input[type="range"]::-webkit-slider-runnable-track': {
            '-webkit-appearance': 'none',
            boxShadow: 'none',
            border: 'none',
            background: 'transparent',
            borderRadius: '0.5rem',
            height: '0.3rem',
            marginLeft: '-6.5px',
            marginRight: '-6.5px'
        },
        'input[type="range"]::-webkit-slider-thumb': {
            '-webkit-appearance': 'none',
            appearance: 'none',
            marginTop: '-5px',
            backgroundColor: `var(--track-color, ${Theme.colors.info.main})`,
            borderRadius: '0.5rem',
            height: '1rem',
            width: '1rem',
        },
        '.range-labels': {
            display: 'flex',
            justifyContent: 'space-between',
            height: 'auto',
            overflow: 'hidden',
            listStyle: 'none',
        },
        '.range-labels li': {
            padding: '0 0.25rem'
        },
        '&.--step input[type="range"]': {
            opacity: 1,
            $nest: {
                '&::-webkit-slider-runnable-track': {
                    zIndex: 2
                },
                '&::-webkit-slider-thumb': {
                    zIndex: 2
                }
            }
        },
        '.slider-step': {
            position: "absolute",
            zIndex: 0,
            top: 2,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'transparent'
        },
        '.step-dot': {
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            width: '3px',
            height: '10px',
            backgroundColor: "#a7a9ac"
        },
        '.tooltip': {
            visibility: 'hidden',
            minWidth: 35,
            maxWidth: 70,
            overflowWrap: 'break-word',
            backgroundColor: 'rgba(0, 0, 0, 0.78)',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '6px',
            padding: '8px',
            position: 'absolute',
            zIndex: 1,
            bottom: '150%',
            left: '0%',
            marginLeft: '-20px',
            opacity: 0,
            transition: 'opacity 0.3s',
            $nest: {
                '&::after': {
                    content: "''",
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    marginLeft: '-5px',
                    borderWidth: '5px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(0, 0, 0, 0.78) transparent transparent transparent'
                }
            }
        },
        'input[type="range"]:hover + .tooltip': {
            visibility: 'visible',
            opacity: 1,
        }
    }
})