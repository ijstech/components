import * as Styles from "@ijstech/style";

let Theme = Styles.Theme.ThemeVars;

Styles.cssRule("i-markdown-editor", {
    $nest: {
        ".ProseMirror .placeholder": {
            //make placeholder unfocusable
            userSelect: "none",
            pointerEvents: "none"
        },
        '.overlay': {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 999,
            display: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer'
        }
    },
});
