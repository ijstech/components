import * as Styles from "@ijstech/style";
let Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-datepicker', {
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
        '> input': {
            borderRadius: "inherit",
            padding: "1px 0.5rem",
            border: `0.5px solid ${Theme.divider}`,
            boxSizing: 'border-box',
            outline: 'none',
            fontSize: 'inherit',
            color: Theme.input.fontColor,
            background: 'transparent',
            verticalAlign: 'top',
            borderTopRightRadius: '0px !important',
            borderBottomRightRadius: '0px !important',
            borderRight: 'none !important',
            height: '100%'
        },
        '> input[type=text]:focus': {
          borderColor: Theme.colors.info.main
        },
        'i-icon': {
            fill: Theme.colors.primary.contrastText,   
        },
        '.datepicker-toggle': {
          display: 'inline-flex',
          position: 'relative',
          // backgroundColor: "#6c757d",
          backgroundColor: 'transparent',
          border: `0.5px solid ${Theme.divider}`,
          padding: "7px",
          marginLeft: "-1px",
          cursor: "pointer",
          justifyContent: 'center',
          alignItems: 'center',
          verticalAlign: 'top',
          borderRadius: "inherit",
          borderTopLeftRadius: '0px !important',
          borderBottomLeftRadius: '0px !important',
          height: '100%'
        },
        "> .datepicker-toggle:hover": {
          backgroundColor: "#545b62",
        },
        '.datepicker': {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          border: 0,
          padding: 0,
          opacity: 0,
          cursor: 'pointer',
        },
        '.datepicker::-webkit-calendar-picker-indicator': {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          cursor: 'pointer',
        }
    }
})