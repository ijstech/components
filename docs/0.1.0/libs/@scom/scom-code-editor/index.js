var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
///<amd-module name='@scom/scom-code-editor/editor.api.ts'/> 
/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Type definitions for monaco-editor
 * Released under the MIT license
*-----------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("@scom/scom-code-editor/editor.api.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionDirection = exports.KeyCode = exports.MarkerSeverity = exports.MarkerTag = void 0;
    var MarkerTag;
    (function (MarkerTag) {
        MarkerTag[MarkerTag["Unnecessary"] = 1] = "Unnecessary";
        MarkerTag[MarkerTag["Deprecated"] = 2] = "Deprecated";
    })(MarkerTag = exports.MarkerTag || (exports.MarkerTag = {}));
    var MarkerSeverity;
    (function (MarkerSeverity) {
        MarkerSeverity[MarkerSeverity["Hint"] = 1] = "Hint";
        MarkerSeverity[MarkerSeverity["Info"] = 2] = "Info";
        MarkerSeverity[MarkerSeverity["Warning"] = 4] = "Warning";
        MarkerSeverity[MarkerSeverity["Error"] = 8] = "Error";
    })(MarkerSeverity = exports.MarkerSeverity || (exports.MarkerSeverity = {}));
    /**
     * Virtual Key Codes, the value does not hold any inherent meaning.
     * Inspired somewhat from https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
     * But these are "more general", as they should work across browsers & OS`s.
     */
    var KeyCode;
    (function (KeyCode) {
        KeyCode[KeyCode["DependsOnKbLayout"] = -1] = "DependsOnKbLayout";
        /**
         * Placed first to cover the 0 value of the enum.
         */
        KeyCode[KeyCode["Unknown"] = 0] = "Unknown";
        KeyCode[KeyCode["Backspace"] = 1] = "Backspace";
        KeyCode[KeyCode["Tab"] = 2] = "Tab";
        KeyCode[KeyCode["Enter"] = 3] = "Enter";
        KeyCode[KeyCode["Shift"] = 4] = "Shift";
        KeyCode[KeyCode["Ctrl"] = 5] = "Ctrl";
        KeyCode[KeyCode["Alt"] = 6] = "Alt";
        KeyCode[KeyCode["PauseBreak"] = 7] = "PauseBreak";
        KeyCode[KeyCode["CapsLock"] = 8] = "CapsLock";
        KeyCode[KeyCode["Escape"] = 9] = "Escape";
        KeyCode[KeyCode["Space"] = 10] = "Space";
        KeyCode[KeyCode["PageUp"] = 11] = "PageUp";
        KeyCode[KeyCode["PageDown"] = 12] = "PageDown";
        KeyCode[KeyCode["End"] = 13] = "End";
        KeyCode[KeyCode["Home"] = 14] = "Home";
        KeyCode[KeyCode["LeftArrow"] = 15] = "LeftArrow";
        KeyCode[KeyCode["UpArrow"] = 16] = "UpArrow";
        KeyCode[KeyCode["RightArrow"] = 17] = "RightArrow";
        KeyCode[KeyCode["DownArrow"] = 18] = "DownArrow";
        KeyCode[KeyCode["Insert"] = 19] = "Insert";
        KeyCode[KeyCode["Delete"] = 20] = "Delete";
        KeyCode[KeyCode["Digit0"] = 21] = "Digit0";
        KeyCode[KeyCode["Digit1"] = 22] = "Digit1";
        KeyCode[KeyCode["Digit2"] = 23] = "Digit2";
        KeyCode[KeyCode["Digit3"] = 24] = "Digit3";
        KeyCode[KeyCode["Digit4"] = 25] = "Digit4";
        KeyCode[KeyCode["Digit5"] = 26] = "Digit5";
        KeyCode[KeyCode["Digit6"] = 27] = "Digit6";
        KeyCode[KeyCode["Digit7"] = 28] = "Digit7";
        KeyCode[KeyCode["Digit8"] = 29] = "Digit8";
        KeyCode[KeyCode["Digit9"] = 30] = "Digit9";
        KeyCode[KeyCode["KeyA"] = 31] = "KeyA";
        KeyCode[KeyCode["KeyB"] = 32] = "KeyB";
        KeyCode[KeyCode["KeyC"] = 33] = "KeyC";
        KeyCode[KeyCode["KeyD"] = 34] = "KeyD";
        KeyCode[KeyCode["KeyE"] = 35] = "KeyE";
        KeyCode[KeyCode["KeyF"] = 36] = "KeyF";
        KeyCode[KeyCode["KeyG"] = 37] = "KeyG";
        KeyCode[KeyCode["KeyH"] = 38] = "KeyH";
        KeyCode[KeyCode["KeyI"] = 39] = "KeyI";
        KeyCode[KeyCode["KeyJ"] = 40] = "KeyJ";
        KeyCode[KeyCode["KeyK"] = 41] = "KeyK";
        KeyCode[KeyCode["KeyL"] = 42] = "KeyL";
        KeyCode[KeyCode["KeyM"] = 43] = "KeyM";
        KeyCode[KeyCode["KeyN"] = 44] = "KeyN";
        KeyCode[KeyCode["KeyO"] = 45] = "KeyO";
        KeyCode[KeyCode["KeyP"] = 46] = "KeyP";
        KeyCode[KeyCode["KeyQ"] = 47] = "KeyQ";
        KeyCode[KeyCode["KeyR"] = 48] = "KeyR";
        KeyCode[KeyCode["KeyS"] = 49] = "KeyS";
        KeyCode[KeyCode["KeyT"] = 50] = "KeyT";
        KeyCode[KeyCode["KeyU"] = 51] = "KeyU";
        KeyCode[KeyCode["KeyV"] = 52] = "KeyV";
        KeyCode[KeyCode["KeyW"] = 53] = "KeyW";
        KeyCode[KeyCode["KeyX"] = 54] = "KeyX";
        KeyCode[KeyCode["KeyY"] = 55] = "KeyY";
        KeyCode[KeyCode["KeyZ"] = 56] = "KeyZ";
        KeyCode[KeyCode["Meta"] = 57] = "Meta";
        KeyCode[KeyCode["ContextMenu"] = 58] = "ContextMenu";
        KeyCode[KeyCode["F1"] = 59] = "F1";
        KeyCode[KeyCode["F2"] = 60] = "F2";
        KeyCode[KeyCode["F3"] = 61] = "F3";
        KeyCode[KeyCode["F4"] = 62] = "F4";
        KeyCode[KeyCode["F5"] = 63] = "F5";
        KeyCode[KeyCode["F6"] = 64] = "F6";
        KeyCode[KeyCode["F7"] = 65] = "F7";
        KeyCode[KeyCode["F8"] = 66] = "F8";
        KeyCode[KeyCode["F9"] = 67] = "F9";
        KeyCode[KeyCode["F10"] = 68] = "F10";
        KeyCode[KeyCode["F11"] = 69] = "F11";
        KeyCode[KeyCode["F12"] = 70] = "F12";
        KeyCode[KeyCode["F13"] = 71] = "F13";
        KeyCode[KeyCode["F14"] = 72] = "F14";
        KeyCode[KeyCode["F15"] = 73] = "F15";
        KeyCode[KeyCode["F16"] = 74] = "F16";
        KeyCode[KeyCode["F17"] = 75] = "F17";
        KeyCode[KeyCode["F18"] = 76] = "F18";
        KeyCode[KeyCode["F19"] = 77] = "F19";
        KeyCode[KeyCode["NumLock"] = 78] = "NumLock";
        KeyCode[KeyCode["ScrollLock"] = 79] = "ScrollLock";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the ';:' key
         */
        KeyCode[KeyCode["Semicolon"] = 80] = "Semicolon";
        /**
         * For any country/region, the '+' key
         * For the US standard keyboard, the '=+' key
         */
        KeyCode[KeyCode["Equal"] = 81] = "Equal";
        /**
         * For any country/region, the ',' key
         * For the US standard keyboard, the ',<' key
         */
        KeyCode[KeyCode["Comma"] = 82] = "Comma";
        /**
         * For any country/region, the '-' key
         * For the US standard keyboard, the '-_' key
         */
        KeyCode[KeyCode["Minus"] = 83] = "Minus";
        /**
         * For any country/region, the '.' key
         * For the US standard keyboard, the '.>' key
         */
        KeyCode[KeyCode["Period"] = 84] = "Period";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '/?' key
         */
        KeyCode[KeyCode["Slash"] = 85] = "Slash";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '`~' key
         */
        KeyCode[KeyCode["Backquote"] = 86] = "Backquote";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '[{' key
         */
        KeyCode[KeyCode["BracketLeft"] = 87] = "BracketLeft";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '\|' key
         */
        KeyCode[KeyCode["Backslash"] = 88] = "Backslash";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the ']}' key
         */
        KeyCode[KeyCode["BracketRight"] = 89] = "BracketRight";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the ''"' key
         */
        KeyCode[KeyCode["Quote"] = 90] = "Quote";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         */
        KeyCode[KeyCode["OEM_8"] = 91] = "OEM_8";
        /**
         * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
         */
        KeyCode[KeyCode["IntlBackslash"] = 92] = "IntlBackslash";
        KeyCode[KeyCode["Numpad0"] = 93] = "Numpad0";
        KeyCode[KeyCode["Numpad1"] = 94] = "Numpad1";
        KeyCode[KeyCode["Numpad2"] = 95] = "Numpad2";
        KeyCode[KeyCode["Numpad3"] = 96] = "Numpad3";
        KeyCode[KeyCode["Numpad4"] = 97] = "Numpad4";
        KeyCode[KeyCode["Numpad5"] = 98] = "Numpad5";
        KeyCode[KeyCode["Numpad6"] = 99] = "Numpad6";
        KeyCode[KeyCode["Numpad7"] = 100] = "Numpad7";
        KeyCode[KeyCode["Numpad8"] = 101] = "Numpad8";
        KeyCode[KeyCode["Numpad9"] = 102] = "Numpad9";
        KeyCode[KeyCode["NumpadMultiply"] = 103] = "NumpadMultiply";
        KeyCode[KeyCode["NumpadAdd"] = 104] = "NumpadAdd";
        KeyCode[KeyCode["NUMPAD_SEPARATOR"] = 105] = "NUMPAD_SEPARATOR";
        KeyCode[KeyCode["NumpadSubtract"] = 106] = "NumpadSubtract";
        KeyCode[KeyCode["NumpadDecimal"] = 107] = "NumpadDecimal";
        KeyCode[KeyCode["NumpadDivide"] = 108] = "NumpadDivide";
        /**
         * Cover all key codes when IME is processing input.
         */
        KeyCode[KeyCode["KEY_IN_COMPOSITION"] = 109] = "KEY_IN_COMPOSITION";
        KeyCode[KeyCode["ABNT_C1"] = 110] = "ABNT_C1";
        KeyCode[KeyCode["ABNT_C2"] = 111] = "ABNT_C2";
        KeyCode[KeyCode["AudioVolumeMute"] = 112] = "AudioVolumeMute";
        KeyCode[KeyCode["AudioVolumeUp"] = 113] = "AudioVolumeUp";
        KeyCode[KeyCode["AudioVolumeDown"] = 114] = "AudioVolumeDown";
        KeyCode[KeyCode["BrowserSearch"] = 115] = "BrowserSearch";
        KeyCode[KeyCode["BrowserHome"] = 116] = "BrowserHome";
        KeyCode[KeyCode["BrowserBack"] = 117] = "BrowserBack";
        KeyCode[KeyCode["BrowserForward"] = 118] = "BrowserForward";
        KeyCode[KeyCode["MediaTrackNext"] = 119] = "MediaTrackNext";
        KeyCode[KeyCode["MediaTrackPrevious"] = 120] = "MediaTrackPrevious";
        KeyCode[KeyCode["MediaStop"] = 121] = "MediaStop";
        KeyCode[KeyCode["MediaPlayPause"] = 122] = "MediaPlayPause";
        KeyCode[KeyCode["LaunchMediaPlayer"] = 123] = "LaunchMediaPlayer";
        KeyCode[KeyCode["LaunchMail"] = 124] = "LaunchMail";
        KeyCode[KeyCode["LaunchApp2"] = 125] = "LaunchApp2";
        /**
         * Placed last to cover the length of the enum.
         * Please do not depend on this value!
         */
        KeyCode[KeyCode["MAX_VALUE"] = 126] = "MAX_VALUE";
    })(KeyCode = exports.KeyCode || (exports.KeyCode = {}));
    /**
     * The direction of a selection.
     */
    var SelectionDirection;
    (function (SelectionDirection) {
        /**
         * The selection starts above where it ends.
         */
        SelectionDirection[SelectionDirection["LTR"] = 0] = "LTR";
        /**
         * The selection starts below where it ends.
         */
        SelectionDirection[SelectionDirection["RTL"] = 1] = "RTL";
    })(SelectionDirection = exports.SelectionDirection || (exports.SelectionDirection = {}));
});
define("@scom/scom-code-editor/monaco.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.initMonaco = exports.addLib = exports.getModels = exports.getFileModel = exports.updateFile = exports.addFile = exports.getLanguageType = void 0;
    function getLanguageType(fileName) {
        let ext = fileName.split('.').pop();
        switch (ext) {
            case 'js':
                return 'javascript';
            case 'json':
                return 'json';
            case 'tsx':
            case 'ts':
                return 'typescript';
            case 'css':
                return 'css';
            case 'sol':
                return 'solidity';
            case 'txt':
                return 'txt';
            case 'md':
                return 'markdown';
            case 'html':
            case 'htm':
                return 'html';
            case 'xml':
                return 'xml';
            case 'sh':
                return 'shell';
        }
    }
    exports.getLanguageType = getLanguageType;
    ;
    ;
    async function addFile(fileName, content) {
        let monaco = await initMonaco();
        if (monaco) {
            let model = await getFileModel(fileName);
            if (!model) {
                if (fileName?.endsWith('.tsx') || fileName?.endsWith('.ts'))
                    model = monaco.editor.createModel(content || '', "typescript", monaco.Uri.file(fileName));
                else
                    model = monaco.editor.createModel(content || '', getLanguageType(fileName) || '', monaco.Uri.file(fileName));
            }
            return model;
        }
        ;
        return null;
    }
    exports.addFile = addFile;
    ;
    async function updateFile(fileName, content) {
        let monaco = await initMonaco();
        if (monaco) {
            let model = await getFileModel(fileName);
            if (model) {
                model.setValue(content);
            }
            return model;
        }
        ;
        return null;
    }
    exports.updateFile = updateFile;
    ;
    async function getFileModel(fileName) {
        let monaco = await initMonaco();
        if (monaco) {
            let models = monaco.editor.getModels();
            for (let i = 0; i < models.length; i++) {
                let model = models[i];
                if (model.uri.path == fileName || model.uri.path == '/' + fileName)
                    return model;
            }
            ;
        }
        ;
        return null;
    }
    exports.getFileModel = getFileModel;
    ;
    async function getModels() {
        let monaco = await initMonaco();
        if (monaco) {
            return monaco.editor.getModels();
        }
    }
    exports.getModels = getModels;
    async function addLib(lib, dts) {
        let monaco = await initMonaco();
        monaco.languages.typescript.typescriptDefaults.addExtraLib(dts, lib);
    }
    exports.addLib = addLib;
    ;
    const path = components_1.application.currentModuleDir;
    async function initMonaco() {
        if (window.monaco)
            return window.monaco;
        return new Promise((resolve) => {
            window.MonacoEnvironment = {
            // getWorkerUrl: function (moduleId: any, label: any) {
            //   switch (label) {
            //     // case "json":
            //     //   return `${LibPath}lib/monaco-editor/0.32.1/min/vs/language/json/jsonWorker.js`;
            //     // case "css":
            //     //   return `${LibPath}lib/monaco-editor/0.32.1/min/vs/language/css/cssWorker.js`;
            //     // case "html":
            //     //   return `${LibPath}lib/monaco-editor/0.32.1/min/vs/language/html/htmlWorker.js`;
            //     // case "typescript":
            //     // case "javascript":
            //     //   return `${LibPath}lib/monaco-editor/0.32.1/min/vs/language/typescript/tsWorker.js`;            
            //     default:
            //       return `${LibPath}lib/monaco-editor/0.32.1/min/vs/base/worker/workerMain.js`;
            //   }
            // }
            };
            components_1.RequireJS.config({ paths: { 'vs': `${path || ''}/lib/monaco-editor/0.32.1/min/vs` } });
            components_1.RequireJS.require([`vs/editor/editor.main`], (monaco) => {
                resolve(monaco);
                if (monaco.$loaded)
                    return;
                monaco.$loaded = true;
                monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                    experimentalDecorators: true,
                    allowSyntheticDefaultImports: true,
                    jsx: monaco.languages.typescript.JsxEmit.Preserve,
                    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                    allowNonTsExtensions: true,
                    target: monaco.languages.typescript.ScriptTarget.ES2020,
                });
                //https://stackoverflow.com/questions/57146485/monaco-editor-intellisense-from-multiple-files
                monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
                monaco.languages.registerCompletionItemProvider('typescript', {
                    triggerCharacters: ['>'],
                    provideCompletionItems: (model, position) => {
                        const code = model.getValueInRange({
                            startLineNumber: position.lineNumber,
                            startColumn: 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column,
                        });
                        const tag = code.slice(code.lastIndexOf('<') + 1, code.length);
                        if (!tag || !tag.endsWith('>') || tag.startsWith('/') || tag.indexOf(' ') > 0)
                            return;
                        const word = model.getWordUntilPosition(position);
                        return {
                            suggestions: [
                                {
                                    label: `</${tag}`,
                                    kind: monaco.languages.CompletionItemKind.EnumMember,
                                    insertText: `$1</${tag}`,
                                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                    range: {
                                        startLineNumber: position.lineNumber,
                                        endLineNumber: position.lineNumber,
                                        startColumn: word.startColumn,
                                        endColumn: word.endColumn,
                                    }
                                }
                            ]
                        };
                    }
                });
            });
        });
    }
    exports.initMonaco = initMonaco;
    ;
});
define("@scom/scom-code-editor/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    components_2.Styles.cssRule("i-scom-code-editor", {
        $nest: {
            "*": {
                boxSizing: "border-box",
            },
            ".full-height": {
                height: "100vh",
            },
            ".half-width": {
                width: "50%",
            },
            ".column": {
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
            },
            ".row": {
                display: "flex",
                flexDirection: "row",
            },
            ".align-right": {
                marginLeft: "auto",
                alignSelf: "stretch",
            },
            /* Editors */
            "#flex-wrapper": {
                display: "flex",
                alignItems: "stretch",
            },
            "#operation-editor": {
                height: "60vh",
                minHeight: "260px",
            },
            "#variables-editor": {
                height: "30vh",
                alignItems: "stretch",
            },
            "#results-editor": {
                height: "90vh",
                alignItems: "stretch",
            },
            /* Toolbar */
            "#toolbar": {
                minHeight: "40px",
                backgroundColor: "#1e1e1e",
                display: "inline-flex",
                alignItems: "stretch",
            },
            "#toolbar > button, #toolbar > select, #toolbar > span, button#execute-op": {
                margin: "4px",
                padding: "4px",
            },
            "#toolbar button, #toolbar select": {
                backgroundColor: "#1e1e1e",
                color: "#eee",
                border: "1px solid #eee",
                borderRadius: "4px",
            },
            "#toolbar button:hover, i-code-editor #toolbar select:hover, i-code-editor #toolbar button:focus, i-code-editor #toolbar select:focus": {
                backgroundColor: "darkslategrey",
            },
            "#execution-tray": {
                display: "inline-flex",
                alignItems: "baseline",
            },
            "#schema-status": {
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                color: "#eee",
            },
            "#toolbar button.reload-button": {
                border: "0 none",
                padding: "4px",
                width: "30px",
                textAlign: "center",
            },
        },
    });
});
define("@scom/scom-code-editor/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditorType = void 0;
    ///<amd-module name='@scom/scom-code-editor/interface.ts'/> 
    var EditorType;
    (function (EditorType) {
        EditorType[EditorType["modified"] = 0] = "modified";
        EditorType[EditorType["original"] = 1] = "original";
    })(EditorType = exports.EditorType || (exports.EditorType = {}));
});
define("@scom/scom-code-editor/code-editor.ts", ["require", "exports", "@ijstech/components", "@scom/scom-code-editor/monaco.ts", "@scom/scom-code-editor/index.css.ts"], function (require, exports, components_3, monaco_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomCodeEditor = void 0;
    ;
    ;
    let ScomCodeEditor = class ScomCodeEditor extends components_3.Control {
        get monaco() {
            return window.monaco;
            ``;
        }
        get editor() {
            return this._editor;
        }
        ;
        get value() {
            if (this._editor)
                return this._editor.getValue();
            else
                return this._value;
        }
        ;
        set value(value) {
            this._value = value;
            if (this._editor) {
                this._editor.setValue(value);
                this._editor.setScrollTop(0);
            }
            else
                this.loadContent();
        }
        ;
        get language() {
            return this._language;
        }
        ;
        set language(value) {
            this._language = value;
            if (!this.editor) {
                this.loadContent();
            }
            else {
                const model = this.editor.getModel();
                if (model) {
                    this.monaco.editor.setModelLanguage(model, value);
                }
            }
        }
        ;
        get designMode() {
            return this._designMode;
        }
        set designMode(value) {
            this._designMode = value;
            if (this.editor)
                this.editor.updateOptions({ ...this.editor.getOptions(), readOnly: value });
        }
        get theme() {
            return this._theme || 'dark';
        }
        set theme(value) {
            this._theme = value || 'dark';
            const themeVal = value === 'light' ? 'vs' : 'vs-dark';
            this.monaco?.editor?.setTheme(themeVal);
        }
        async init() {
            super.init();
            const language = this.getAttribute("language", true);
            if (language)
                this.language = language;
            const theme = this.getAttribute("theme", true);
            if (theme)
                this.theme = theme;
            this.style.display = "inline-block";
            if (this.language)
                await this.loadContent(undefined, this.language);
        }
        ;
        focus() {
            this._editor.focus();
        }
        ;
        setCursor(line, column) {
            this.editor.setPosition({ lineNumber: line, column: column });
        }
        ;
        getErrors() {
            const markers = this.monaco.editor.getModelMarkers({ resource: this._editor.getModel()?.uri });
            return markers.filter((marker) => marker.severity === this.monaco.MarkerSeverity.Error);
        }
        async loadContent(content, language, fileName) {
            const monaco = await (0, monaco_1.initMonaco)();
            if (content == undefined)
                content = content || this._value || '';
            this._value = content;
            language = language || this._language || 'typescript';
            this._language = language;
            if (!this._editor) {
                const captionDiv = this.createElement("div", this);
                captionDiv.style.display = "inline-block";
                captionDiv.style.height = "100%";
                captionDiv.style.width = "100%";
                const customOptions = this._options || {};
                let options = {
                    theme: this.theme === 'light' ? 'vs' : 'vs-dark',
                    tabSize: 2,
                    autoIndent: 'advanced',
                    formatOnPaste: true,
                    formatOnType: true,
                    renderWhitespace: "none",
                    automaticLayout: true,
                    readOnly: this._designMode,
                    minimap: {
                        enabled: false
                    },
                    ...customOptions
                };
                this._editor = monaco.editor.create(captionDiv, options);
                if (typeof this.onAddAction === 'function') {
                    this.onAddAction(this._editor);
                }
                this._editor.onDidChangeModelContent((event) => {
                    if (typeof this.onChange === 'function')
                        this.onChange(this, event);
                });
                this._editor.onKeyDown((event) => {
                    if (typeof this.onKeyDown === 'function') {
                        this.onKeyDown(this, event);
                    }
                });
                this._editor.onKeyUp((event) => {
                    if (typeof this.onKeyUp === 'function') {
                        this.onKeyUp(this, event);
                    }
                });
                this._editor.onMouseDown((event) => {
                    if (typeof this.onMouseDown === 'function') {
                        this.onMouseDown(this, event);
                    }
                });
                this._editor.onContextMenu((event) => {
                    if (typeof this.onContextMenu === 'function') {
                        this.onContextMenu(this._editor, event);
                    }
                });
                if (fileName) {
                    let model = await (0, monaco_1.getFileModel)(fileName);
                    if (model) {
                        this._editor.setModel(model);
                        model.setValue(content);
                        return;
                    }
                }
                ;
                if (language == 'typescript' || fileName?.endsWith('.tsx') || fileName?.endsWith('.ts')) {
                    let model = monaco.editor.createModel(content || this._value || '', "typescript", fileName ? monaco.Uri.file(fileName) : undefined);
                    this._editor.setModel(model);
                }
                else {
                    let model = monaco.editor.createModel(content || this._value || '', language || this._language, fileName ? monaco.Uri.file(fileName) : undefined);
                    this._editor.setModel(model);
                }
                ;
            }
            else {
                let model = this._editor.getModel();
                if (language == 'typescript' && model && fileName && this._fileName != fileName) {
                    if (!this._fileName)
                        model.dispose();
                    model = await (0, monaco_1.getFileModel)(fileName);
                    if (!model) {
                        model = monaco.editor.createModel(content || this._value || '', "typescript", monaco.Uri.file(fileName));
                    }
                    this._editor.setModel(model);
                }
                else {
                    this._editor.setValue(content);
                    if (language && model)
                        monaco.editor.setModelLanguage(model, language);
                }
                ;
            }
            ;
            this._fileName = fileName || '';
            this._editor.setScrollTop(0);
        }
        ;
        saveViewState() {
            if (this._editor) {
                return this._editor.saveViewState();
            }
        }
        restoreViewState(state) {
            if (this._editor && state) {
                this._editor.restoreViewState(state);
            }
        }
        async updateFileName(oldValue, newValue) {
            let oldModel = await (0, monaco_1.getFileModel)(oldValue);
            if (oldModel) {
                if (!oldModel) {
                    console.error('Model not found');
                    return;
                }
                let newModel = await (0, monaco_1.getFileModel)(newValue);
                const newUri = this.monaco.Uri.parse(newValue);
                if (!newModel)
                    newModel = this.monaco.editor.createModel(oldModel.getValue(), oldModel.getLanguageId(), newUri);
                newModel.setValue(oldModel.getValue());
                this.editor.setModel(newModel);
                oldModel.dispose();
            }
        }
        dispose() {
            if (this._editor) {
                this._editor.getModel()?.dispose();
            }
        }
        disposeEditor() {
            if (this._editor) {
                this._editor.getModel()?.dispose();
                this._editor.dispose();
                const domNode = this._editor.getDomNode();
                if (domNode) {
                    if (this.contains(domNode))
                        this.removeChild(domNode);
                    domNode.remove();
                }
            }
        }
        scrollToLine(line, column) {
            const topOffset = this._editor.getTopForPosition(line, column);
            this._editor.setScrollTop(topOffset);
        }
        async loadFile(fileName) {
            let model = await (0, monaco_1.getFileModel)(fileName);
            if (model) {
                if (!this._fileName)
                    this._editor.getModel()?.dispose();
                this._fileName = fileName;
                this._editor.setModel(model);
            }
            ;
        }
        ;
        updateOptions(options) {
            this._options = options;
            if (this._editor)
                this._editor.updateOptions(options);
        }
        ;
    };
    ScomCodeEditor.addLib = monaco_1.addLib;
    ScomCodeEditor.addFile = monaco_1.addFile;
    ScomCodeEditor.getFileModel = monaco_1.getFileModel;
    ScomCodeEditor.updateFile = monaco_1.updateFile;
    ScomCodeEditor = __decorate([
        (0, components_3.customElements)('i-scom-code-editor')
    ], ScomCodeEditor);
    exports.ScomCodeEditor = ScomCodeEditor;
    ;
});
define("@scom/scom-code-editor/diff-editor.ts", ["require", "exports", "@ijstech/components", "@scom/scom-code-editor/monaco.ts", "@scom/scom-code-editor/interface.ts", "@scom/scom-code-editor/index.css.ts"], function (require, exports, components_4, monaco_2, interface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomCodeDiffEditor = void 0;
    ;
    ;
    let ScomCodeDiffEditor = class ScomCodeDiffEditor extends components_4.Control {
        constructor() {
            super(...arguments);
            this._renderSideBySide = true;
        }
        get editor() {
            return this._editor;
        }
        ;
        get originalValue() {
            if (this.editor)
                return this.editor.getOriginalEditor().getValue();
            else
                return this._originalValue;
        }
        ;
        set originalValue(value) {
            this._originalValue = value;
            if (this.editor) {
                this.editor.getOriginalEditor().setValue(value);
            }
            else
                this.loadContent(interface_1.EditorType.original);
        }
        ;
        get modifiedValue() {
            if (this.editor)
                return this.editor.getModifiedEditor().getValue();
            else
                return this._modifiedValue;
        }
        ;
        set modifiedValue(value) {
            this._modifiedValue = value;
            if (this.editor) {
                this.editor.getModifiedEditor().setValue(value);
            }
            else {
                this.loadContent(interface_1.EditorType.modified);
            }
        }
        ;
        get language() {
            return this._language;
        }
        ;
        set language(value) {
            this._language = value;
            if (!this.editor) {
                if (this.language) {
                    this.loadContent(interface_1.EditorType.original, '', this.language);
                    this.loadContent(interface_1.EditorType.modified, '', this.language);
                }
            }
            else {
                this.setModelLanguage(value, 'getOriginalEditor');
                this.setModelLanguage(value, 'getModifiedEditor');
            }
        }
        ;
        get designMode() {
            return this._designMode;
        }
        set designMode(value) {
            this._designMode = value;
            if (this.editor)
                this.editor.updateOptions({ ...this.editor.getModifiedEditor().getOptions(), readOnly: value });
        }
        get monaco() {
            return window.monaco;
        }
        get theme() {
            return this._theme || 'dark';
        }
        set theme(value) {
            this._theme = value || 'dark';
            const themeVal = value === 'light' ? 'vs' : 'vs-dark';
            this.monaco?.editor?.setTheme(themeVal);
        }
        init() {
            super.init();
            this.language = this.getAttribute("language", true);
            const theme = this.getAttribute("theme", true);
            if (theme)
                this.theme = theme;
            this._renderSideBySide = this.getAttribute("renderSideBySide", true, true);
            this.style.display = "inline-block";
        }
        ;
        setModelLanguage(value, functionName) {
            let monaco = window.monaco;
            let model = this.editor[functionName]().getModel();
            if (model) {
                monaco.editor.setModelLanguage(model, value);
            }
        }
        dispose() {
            if (this._editor) {
                const originalModel = this.getModel(interface_1.EditorType.original);
                const modifiedModel = this.getModel(interface_1.EditorType.modified);
                if (originalModel) {
                    originalModel.dispose();
                }
                if (modifiedModel) {
                    modifiedModel.dispose();
                }
            }
        }
        updateFileName() { }
        getErrors() {
            const markers = this.monaco.editor.getModelMarkers({ resource: this._editor.getModifiedEditor().getModel()?.uri });
            return markers.filter((marker) => marker.severity === this.monaco.MarkerSeverity.Error);
        }
        getEditor(type) {
            if (type === interface_1.EditorType.original)
                return this.editor.getOriginalEditor();
            else
                return this.editor.getModifiedEditor();
        }
        getModel(type) {
            return this.getEditor(type).getModel();
        }
        async loadContent(type, content, language, fileName) {
            let monaco = await (0, monaco_2.initMonaco)();
            const funcName = type === interface_1.EditorType.modified ? 'getModifiedEditor' : 'getOriginalEditor';
            const value = type === interface_1.EditorType.modified ? this._modifiedValue : this._originalValue;
            const newFileName = `${type}` + fileName;
            if (content == undefined)
                content = content || value || '';
            type === interface_1.EditorType.modified ? this._modifiedValue = content : this._originalValue = content;
            language = language || this._language || 'typescript';
            this._language = language;
            if (!this._editor) {
                let captionDiv = this.createElement("div", this);
                captionDiv.style.display = "inline-block";
                captionDiv.style.height = "100%";
                captionDiv.style.width = "100%";
                let options = {
                    theme: this.theme === 'light' ? 'vs' : 'vs-dark',
                    originalEditable: false,
                    automaticLayout: true,
                    readOnly: this._designMode,
                    renderSideBySide: this._renderSideBySide
                };
                this._editor = monaco.editor.createDiffEditor(captionDiv, options);
                this._editor.getModifiedEditor()?.onDidChangeModelContent((event) => {
                    if (typeof this.onChange === 'function')
                        this.onChange(this, event);
                });
                if (fileName) {
                    let model = await (0, monaco_2.getFileModel)(newFileName);
                    if (model) {
                        this.editor[funcName]().setModel(model);
                        model.setValue(content);
                        return;
                    }
                }
                ;
            }
            let model = this.getModel(type);
            if (model && model.getValue() === content && this._fileName === fileName) {
                return;
            }
            if (model) {
                if (fileName && this._fileName !== fileName) {
                    model.dispose();
                    model = await (0, monaco_2.getFileModel)(newFileName);
                    if (!model)
                        model = monaco.editor.createModel(content || value || '', language || this._language || 'typescript', monaco.Uri.file(newFileName));
                    this._editor[funcName]().setModel(model);
                    this._editor[funcName]().setValue(content);
                }
                else {
                    this.getEditor(type).setValue(content);
                    if (language && model)
                        monaco.editor.setModelLanguage(model, language);
                }
                ;
            }
            else {
                let model = await (0, monaco_2.getFileModel)(newFileName);
                if (!model) {
                    const file = fileName ? monaco.Uri.file(newFileName) : undefined;
                    if (language == 'typescript' || fileName?.endsWith('.tsx') || fileName?.endsWith('.ts')) {
                        model = monaco.editor.createModel(content || value || '', "typescript", file);
                    }
                    else
                        model = monaco.editor.createModel(content || value || '', language || this._language || 'typescript', file);
                }
                this._editor[funcName]().setModel(model);
            }
            this._fileName = fileName || '';
        }
        ;
        updateOptions(options) {
            this.editor.updateOptions(options);
        }
        ;
    };
    ScomCodeDiffEditor.addLib = monaco_2.addLib;
    ScomCodeDiffEditor.addFile = monaco_2.addFile;
    ScomCodeDiffEditor.getFileModel = monaco_2.getFileModel;
    ScomCodeDiffEditor.updateFile = monaco_2.updateFile;
    ScomCodeDiffEditor = __decorate([
        (0, components_4.customElements)("i-scom-code-diff-editor")
    ], ScomCodeDiffEditor);
    exports.ScomCodeDiffEditor = ScomCodeDiffEditor;
    ;
});
define("@scom/scom-code-editor", ["require", "exports", "@scom/scom-code-editor/code-editor.ts", "@scom/scom-code-editor/diff-editor.ts", "@scom/scom-code-editor/editor.api.ts"], function (require, exports, code_editor_1, diff_editor_1, Monaco) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Monaco = exports.ScomCodeDiffEditor = exports.ScomCodeEditor = void 0;
    Object.defineProperty(exports, "ScomCodeEditor", { enumerable: true, get: function () { return code_editor_1.ScomCodeEditor; } });
    Object.defineProperty(exports, "ScomCodeDiffEditor", { enumerable: true, get: function () { return diff_editor_1.ScomCodeDiffEditor; } });
    exports.Monaco = Monaco;
});
