import {IColor, Colors} from './colors'
export {Colors}

type IColorVar = string

interface IThemeColors {
    main: IColorVar
    light: IColorVar
    dark: IColorVar
    contrastText: IColorVar
}

interface ILayout {
    container: {
        width: string
        maxWidth: string
        textAlign: string
        overflow: string
    }
}

export interface ITheme {
    action: {
        active: IColorVar
        activeBackground: IColorVar
        activeOpacity: number
        disabled: IColorVar
        disabledBackground: IColorVar
        disabledOpacity: number
        focus: IColorVar
        focusBackground: IColorVar
        focusOpacity: number
        hover: IColorVar
        hoverBackground: IColorVar
        hoverOpacity: number
        selected: IColorVar
        selectedBackground: IColorVar
        selectedOpacity: number
    }
    background: {
        default: IColorVar
        paper: IColorVar
        main: IColorVar
        modal: IColorVar
        gradient: IColorVar
    }
    breakpoints: {
        xs: number
        sm: number
        md: number
        lg: number
        xl: number
    }
    colors: {
        primary: IThemeColors
        secondary: IThemeColors
        error: IThemeColors
        warning: IThemeColors
        info: IThemeColors
        success: IThemeColors
    }
    layout: ILayout
    divider: IColorVar
    shadows: {
        0: string
        1: string
        2: string
        3: string
        4: string
    }
    text: {
        primary: IColorVar
        secondary: IColorVar
        third: IColorVar
        disabled: IColorVar
        hint: IColorVar
    }
    docs: {
        background: IColorVar
        text0: IColorVar
        text1: IColorVar
    }
    typography: {
        fontFamily: string
        fontSize: string
    }
    input: {
        background: string;
        fontColor: string;
    },
    combobox: {
        background: string;
        fontColor: string;
    }
}

export interface IThemeVariables {
    action: {
        active: string
        activeBackground: string
        activeOpacity: string
        disabled: string
        disabledBackground: string
        disabledOpacity: string
        focus: string
        focusBackground: string
        focusOpacity: string
        hover: string
        hoverBackground: string
        hoverOpacity: string
        selected: string
        selectedBackground: string
        selectedOpacity: string
    }
    background: {
        default: string
        paper: string
        main: string
        modal: string
        gradient: string
    }
    breakpoints: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
    }
    colors: {
        primary: IThemeColors
        secondary: IThemeColors
        error: IThemeColors
        warning: IThemeColors
        info: IThemeColors
        success: IThemeColors
    }
    layout: ILayout
    divider: string
    shadows: {
        0: string
        1: string
        2: string
        3: string
        4: string
    }
    text: {
        primary: string
        secondary: string
        third: string
        disabled: string
        hint: string
    }
    docs: {
        background: string
        text0: string
        text1: string
    }
    typography: {
        fontFamily: string
        fontSize: string
    }
    input: {
        background: string;
        fontColor: string;
    },
    combobox: {
        background: string;
        fontColor: string;
    }
}

export const defaultTheme: ITheme = {
    action: {
        active: 'rgba(0, 0, 0, 0.54)',
        activeBackground: 'rgba(0, 0, 0, 0.12)',
        activeOpacity: 0.12,
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(0, 0, 0, 0.26)',
        focusBackground: 'rgba(0, 0, 0, 0.12)',
        focusOpacity: 0.12,
        hover: 'rgba(0, 0, 0, 0.12)',
        hoverBackground: 'rgba(0, 0, 0, 0.04)',
        hoverOpacity: 0.04,
        selected: 'rgba(0, 0, 0, 0.14)',
        selectedBackground: 'rgba(0, 0, 0, 0.08)',
        selectedOpacity: 0.08,
    },
    background: {
        default: '#fafafa',
        paper: '#fff',
        main: '#ffffff',
        modal: '#ffffff',
        gradient: 'linear-gradient(90deg, #a8327f 0%, #d4626a 100%)',
    },
    breakpoints: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    colors: {
        error: {
            contrastText: '#FFFFFF',
            dark: '#D32F2F',
            light: '#e57373',
            main: '#f44336',
        },
        info: {
            contrastText: '#fff',
            dark: '#1976d2',
            light: '#64b5f6',
            main: '#2196f3',
        },
        primary: {
            contrastText: '#fff',
            dark: 'rgb(44, 56, 126)',
            light: 'rgb(101, 115, 195)',
            main: '#3f51b5',
        },
        secondary: {
            contrastText: '#fff',
            dark: 'rgb(171, 0, 60)',
            light: 'rgb(247, 51, 120)',
            main: '#f50057',
        },
        success: {
            contrastText: 'rgba(0, 0, 0, 0.87)',
            dark: '#388e3c',
            light: '#81c784',
            main: '#4caf50',
        },
        warning: {
            contrastText: 'rgba(0, 0, 0, 0.87)',
            dark: '#f57c00',
            light: '#ffb74d',
            main: '#ff9800',
        },
    },
    layout: {
        container: {
            width: '100%',
            maxWidth: '100%',
            textAlign: 'left',
            overflow: 'auto'
        }
    },
    shadows: {
        0: 'none',
        1: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        2: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
        3: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
        4: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    },
    text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        third: '#f6c958',
        disabled: 'rgba(0, 0, 0, 0.38)',
        hint: 'rgba(0, 0, 0, 0.38)',
    },
    docs: {
        background: '#f6f8fa',
        text0: '#393939',
        text1: '#717171',
    },
    typography: {
        fontSize: '14px',
        fontFamily: `'roboto', 'Helvetica', 'Arial', 'Lucida Grande', 'sans-serif'`,
    },
    input: {
        background: '#fff',
        fontColor: '#000'
    },
    combobox: {
        background: '#fff',
        fontColor: '#000'
    }
}
export const darkTheme: ITheme = {
    action: {
        active: '#fff',
        activeBackground: 'rgba(0, 0, 0, 0.5)',
        activeOpacity: 0.12,
        disabled: 'rgba(255,255,255,0.3)',
        disabledBackground: 'rgba(255,255,255, 0.12)',
        disabledOpacity: 0.38,
        focus: 'rgba(255,255,255, 0.3)',
        focusBackground: 'rgba(255,255,255,0.12)',
        focusOpacity: 0.12,
        hover: 'rgba(255,255,255,0.3)',
        hoverBackground: 'rgba(255,255,255,0.08)',
        hoverOpacity: 0.08,
        selected: 'rgba(255,255,255, 0.6)',
        selectedOpacity: 0.16,
        selectedBackground: 'rgba(255,255,255, 0.16)'
    },
    background: {
        default: '#303030',
        paper: '#424242',
        main: '#181e3e',
        modal: '#192046',
        gradient: 'linear-gradient(90deg, #a8327f 0%, #d4626a 100%)',
    },
    breakpoints: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
    },
    colors: {
        error: {
            contrastText: '#fff',
            dark: '#d32f2f',
            light: '#e57373',
            main: '#f44336',
        },
        info: {
            contrastText: 'rgba(0, 0, 0, 0.87)',
            dark: '#0288d1',
            light: '#4fc3f7',
            main: '#29b6f6',
        },
        primary: {
            contrastText: '#fff',
            dark: 'rgb(44, 56, 126)',
            light: 'rgb(101, 115, 195)',
            main: '#3f51b5',
        },
        secondary: {
            contrastText: '#fff',
            dark: 'rgb(171, 0, 60)',
            light: 'rgb(247, 51, 120)',
            main: '#f50057',
        },
        success: {
            contrastText: 'rgba(0, 0, 0, 0.87)',
            dark: '#388e3c',
            light: '#81c784',
            main: '#66bb6a',
        },
        warning: {
            contrastText: 'rgba(0, 0, 0, 0.87)',
            dark: '#f57c00',
            light: '#ffb74d',
            main: '#ffa726',
        },
    },
    layout: {
        container: {
            width: '100%',
            maxWidth: '100%',
            textAlign: 'left',
            overflow: 'auto'
        }
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    shadows: {
        0: 'none',
        1: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        2: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
        3: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
        4: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
    },
    text: {
        primary: '#fff',
        secondary: 'rgba(255, 255, 255, 0.7)',
        third: '#f6c958',
        disabled: 'rgba(255, 255, 255, 0.5)',
        hint: 'rgba(255, 255, 255, 0.5)',
    },
    docs: {
        background: '#010132',
        text0: '#fff',
        text1: '#fff',
    },
    typography: {
        fontSize: '14px',
        fontFamily: `'roboto', 'Helvetica', 'Arial', 'Lucida Grande', 'sans-serif'`,
    },
    input: {
        background: '#fff',
        fontColor: '#000'
    },
    combobox: {
        background: '#fff',
        fontColor: '#000'
    }
}

function isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item)
}

function mergeObject(target: any, source: any) {
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {[key]: {}})
                mergeObject(target[key], source[key])
            } else {
                Object.assign(target, {[key]: source[key]})
            }
        }
    }
}

function createTheme(theme?: ITheme): ITheme {
    let result: ITheme = JSON.parse(JSON.stringify(defaultTheme))
    mergeObject(result, theme)
    return result
}

function createThemeVars(theme: any, vars?: any, prefix?: string) {
    vars = vars || {}
    for (let v in theme) {
        if (typeof (<any>theme)[v] == 'object') {
            vars[v] = {}
            createThemeVars(
                (<any>theme)[v],
                vars[v],
                prefix ? prefix + v + '-' : v + '-'
            )
        } else {
            let name = ((prefix || '') + v)
                .split(/(?=[A-Z])/)
                .join('_')
                .toLowerCase()
            vars[v] = `var(--${name})`
        }
    }
    return vars
}

function createThemeCss(theme: any, vars?: any, prefix?: string) {
    vars = vars || {}
    for (let v in theme) {
        if (typeof (<any>theme)[v] == 'object') {
            createThemeCss((<any>theme)[v], vars, prefix ? prefix + v + '-' : v + '-')
        } else {
            let name = ((prefix || '') + v)
                .split(/(?=[A-Z])/)
                .join('_')
                .toLowerCase()
            vars[name] = theme[v]
        }
    }
    return vars
}

export const ThemeVars: IThemeVariables = createThemeVars(defaultTheme)
export const ColorVars: IColor = createThemeVars(Colors)
let themeStyle: HTMLStyleElement
export var currentTheme: ITheme

export function applyTheme(theme: ITheme) {
    let cssVars = createThemeCss(theme)
    let css = `:root{`
    for (let p in cssVars) css += `--${p}: ${cssVars[p]};`
    css += '}'
    if (!themeStyle) {
        themeStyle = document.createElement('style')
        document.head.appendChild(themeStyle)
    }
    themeStyle.textContent = css
    currentTheme = theme
}

applyTheme(defaultTheme)
