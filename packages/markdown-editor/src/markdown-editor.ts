import { Border, Container, Control, customElements, getSpacingValue, I18n, IBorder, IFont, ISpace, LibPath, notifyEventCallback, RequireJS, SpaceValue } from "@ijstech/base";
import { Markdown } from '@ijstech/markdown';
import { Text, TextElement } from '@ijstech/text';
import './styles/index.css';
import { GroupType } from "@ijstech/types";
import { textDataSchema, textPropsConfig } from "@ijstech/text";
import { application } from "@ijstech/application";

export interface MarkdownEditorElement extends TextElement {
    mode?: 'wysiwyg' | 'markdown';
    theme?: 'light' | 'dark';
    previewStyle?: 'tab' | 'vertical';
    hideModeSwitch?: boolean;
    value?: string;
    viewer?: boolean;
    toolbarItems?: any[];
    plugins?: any[];
    widgetRules?: { rule: string | object, toDOM: (text: string) => any }[];
    placeholder?: string;
    autoFocus?: boolean;
    onChanged?: notifyEventCallback;
    onFocus?: notifyEventCallback;
    onBlur?: notifyEventCallback;
}

const TOOLBAR_ITEMS_DEFAULT = [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'task', 'indent', 'outdent'],
    ['table', 'image', 'link'],
    ['code', 'codeblock']
]

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["i-markdown-editor"]: MarkdownEditorElement;
        }
    }
}

RequireJS.config({
    paths: {
        'tui-color-picker': `${LibPath}lib/tui-editor/tui-color-picker.min.js`
    }
})

// const libs = [`${LibPath}lib/tui-editor/toastui-editor-all.min.js`];
const libPlugins = [
    `${LibPath}lib/tui-editor/toastui-editor-all.min.js`,
    `${LibPath}lib/tui-editor/toastui-editor-plugin-color-syntax.min.js`,
    `${LibPath}lib/tui-editor/toastui-editor-plugin-table-merged-cell.min.js`,
    `${LibPath}lib/tui-editor/toastui-editor-plugin-uml.min.js`,
];
const libSyntaxHighlightPlugin = [`${LibPath}lib/tui-editor/toastui-editor-plugin-code-syntax-highlight-all.min.js`];
const unSupportedLang = ['zh-TW', 'zh-CN', 'jp'];
const editorCSS = [
    { name: 'toastui-editor', href: `${LibPath}lib/tui-editor/toastui-editor.css` },
    { name: 'toastui-plugins', href: `${LibPath}lib/tui-editor/toastui-plugins.min.css` },
];
@customElements('i-markdown-editor', {
    icon: 'pen-square',
    group: GroupType.FIELDS,
    className: 'MarkdownEditor',
    props: {
        mode: { type: 'string', default: '' },
        theme: { type: 'string' },
        previewStyle: { type: 'string' },
        hideModeSwitch: { type: 'boolean', default: false },
        value: { type: 'string' },
        viewer: { type: 'boolean', default: false },
        toolbarItems: { type: 'array' },
        plugins: { type: 'array' },
        widgetRules: { type: 'array' },
        placeholder: { type: 'string', default: '' },
        ...(textPropsConfig as any)
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            value: {
                type: 'string'
            },
            mode: {
                type: 'string',
                enum: ['wysiwyg', 'markdown']
            },
            previewStyle: {
                type: 'string',
                enum: ['tab', 'vertical']
            },
            hideModeSwitch: {
                type: 'boolean',
                format: 'boolean'
            },
            viewer: {
                type: 'boolean',
                format: 'boolean'
            },
            placeholder: {
                type: 'string'
            },
            ...(textDataSchema as any),
        }
    }
})
export class MarkdownEditor extends Text {
    private editor: any;
    private editorPlugins: any[] = [];
    private editorObj: any;
    // private viewerObj: any;
    private mdViewer: Markdown;
    private elm: any;
    private _theme: 'light' | 'dark' = 'light';
    private _mode: 'markdown' | 'wysiwyg' = 'markdown';
    private _previewStyle: 'vertical' | 'tab' = 'vertical';
    private _value: string = '';
    private _viewer: boolean = false;
    private _heightValue: string = '500px';
    private _toolbarItems: any[] = TOOLBAR_ITEMS_DEFAULT;
    private _customPlugins: any[] = [];
    private _widgetRules: { rule: string | object, toDOM: (text: string) => any }[] = [];
    private _hideModeSwitch: boolean = false;
    private _placeholder: string = '';
    private _autoFocus: boolean = false;
    private overlayElm: HTMLElement;
    private isPaste: boolean = false;

    public onChanged: notifyEventCallback;
    public onFocus: notifyEventCallback;
    public onBlur: notifyEventCallback;

    setFocus() {
        if (this.editorObj) {
            this.editorObj.getCurrentModeEditor().el.querySelector('.toastui-editor-contents')?.click();
            this.editorObj.getCurrentModeEditor().moveCursorToStart(true);
        }
    }

    get mode() {
        return this._mode;
    }

    set mode(value: 'wysiwyg' | 'markdown') {
        this._mode = value;
        if (this.viewer) return;
        if (this.editorObj) {
            this.editorObj.changeMode(value, false);
        }
    }

    get theme() {
        return this._theme;
    }

    set theme(value: 'light' | 'dark') {
        this._theme = value;
        if (!this.editor) {
            if (this.mdViewer) {
                this.mdViewer.theme = value;
            }
            return;
        }
        this.renderEditor(true);
    }

    get previewStyle() {
        return this._previewStyle;
    }

    set previewStyle(value: 'tab' | 'vertical') {
        this._previewStyle = value;
        if (this.viewer) return;
        if (this.editorObj) {
            this.editorObj.changePreviewStyle(value);
        }
    }

    get viewer() {
        return this._viewer;
    }

    set viewer(value: boolean) {
        if (this._viewer === value) return;
        this._viewer = value;
        if (!this.editor) return;
        this.renderEditor(true);
    }

    set designMode(value: boolean) {
        this._designMode = value;
    }

    get value() {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
        if (this.viewer) {
            this.mdViewer.load(value);
        }
        else if (!this.viewer && this.editorObj && typeof this.editorObj.setMarkdown === 'function') {
            this.editorObj.setMarkdown(value);
        }
        // const targetObj = this.viewer ? this.viewerObj : this.editorObj;
        // if (targetObj) {
        //     targetObj.setMarkdown(value);
        // }
    }

    async setValue(value: string) {
        this._value = value;
        if (this.viewer) {
            await this.mdViewer.load(value);
        }
        else if (!this.viewer && this.editorObj && typeof this.editorObj.setMarkdown === 'function') {
            this.editorObj.setMarkdown(value);
        }
    }

    get height() {
        return this._heightValue;
    }

    set height(value: string|number) {
        this._heightValue = getSpacingValue(value) as string;
        if (this.viewer) return;
        if (this.editorObj) {
            this.editorObj.setHeight(this._heightValue);
        }
    }

    get toolbarItems() {
        return this._toolbarItems || TOOLBAR_ITEMS_DEFAULT;
    }

    set toolbarItems(items: any[]) {
        this._toolbarItems = items;
        const toolbar = this.querySelector('.toastui-editor-toolbar') as HTMLElement;
        if (toolbar && !this.toolbarItems?.length) toolbar.style.display = 'none';
        if (!this.editor) return;
        this.renderEditor(true);
    }

    get plugins() {
        return this._customPlugins || [];
    }

    set plugins(plugins: any[]) {
        this._customPlugins = plugins;
        if (!this.editor) return;
        this.renderEditor(true);
    }

    get widgetRules() {
        return this._widgetRules || [];
    }

    set widgetRules(rules: { rule: string | object, toDOM: (text: string) => any }[]) {
        this._widgetRules = rules;
        if (!this.editor) return;
        this.renderEditor(true);
    }

    get hideModeSwitch() {
        return this._hideModeSwitch ?? false;
    }

    set hideModeSwitch(value: boolean) {
        this._hideModeSwitch = value ?? false;
    }

    get autoFocus() {
        return this._autoFocus;
    }

    set autoFocus(value: boolean) {
        this._autoFocus = value ?? false;
    }

    get placeholder() {
        return this.getTranslatedText(this._placeholder || '');
    }

    set placeholder(value: string) {
        if (typeof value !== 'string') value = String(value || '');
        this._placeholder = value;
        if (this.editorObj) this.renderEditor(true);
    }

    private getTranslatedText(value: string): string {
        if (value?.startsWith('$')) {
          const translated =
            this.parentModule?.i18n?.get(value) ||
            application.i18n?.get(value) ||
            ''
          return translated;
        }
        return value;
    }

    get padding(): ISpace {
        return this._padding;
    }
    set padding(value: ISpace) {
        if (!this.elm) return;
        if (!this._padding)
            this._padding = new SpaceValue(this.elm, value, 'padding');
        else
            this._padding.update(value);
        const { top = 0, right = 0, bottom = 0, left = 0 } = value;
        const padding = `${this._padding.getSpacingValue(top)} ${this._padding.getSpacingValue(right)} ${this._padding.getSpacingValue(bottom)} ${this._padding.getSpacingValue(left)}`;
        const ProseMirrors = this.querySelectorAll('.ProseMirror');
        for (let elm of ProseMirrors) {
            (elm as HTMLElement).style.padding = padding;
        }
        this.elm.style.padding = '';
    }

    get border(): Border {
        return this._border;
    }
    set border(value: IBorder) {
        if (!this.elm) return;
        this._border = new Border(this.elm, value);
    }

    static async create(options?: MarkdownEditorElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    constructor(parent?: Control, options?: MarkdownEditorElement) {
        super(parent, options);
    }

    // private async loadLib() {
    //     return new Promise((resolve, reject) => {
    //         RequireJS.require(libs, async (marked: any) => {
    //             resolve(marked);
    //         });
    //     });
    // }

    private async loadPlugin(plugin: string[]) {
        return new Promise((resolve, reject) => {
            RequireJS.require(plugin,
                async (
                    editor: any,
                    colorSyntax: any,
                    tableMergedCell: any,
                    uml: any
                ) => {
                    this.editor = editor;
                    resolve([colorSyntax, tableMergedCell, uml]);
                }
            );
        });
    }

    private async loadSyntaxHighlightPlugin(plugin: string[]) {
        return new Promise((resolve, reject) => {
            RequireJS.require(plugin,
                async (
                    codeSyntaxHighlight: any
                ) => {
                    resolve([codeSyntaxHighlight]);
                }
            );
        });
    }

    private async loadPlugins() {
        // for (const _plugin of libPlugins) {
        //     this.editorPlugins[_plugin.name] = await this.loadPlugin(_plugin.path);
        // }
        const plugins = await this.loadPlugin(libPlugins) as any[];
        let codeSyntaxHighlight = [];
        if (!unSupportedLang.some(v => v.toLowerCase() === navigator.language?.toLowerCase())) {
            codeSyntaxHighlight = await this.loadSyntaxHighlightPlugin(libSyntaxHighlightPlugin) as any[];
        }
        this.editorPlugins = plugins.concat(codeSyntaxHighlight);
    }

    private addCSS(href: string, name: string) {
        const css = document.head.querySelector(`[name="${name}"]`);
        if (css) return;
        let link = document.createElement('link');
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('name', name);
        link.href = href;
        document.head.append(link);
    }

    private async initEditor() {
        // this.editor = await this.loadLib();
        if (!this.viewer) {
            for (const item of editorCSS) {
                this.addCSS(item.href, item.name);
            }
            await this.loadPlugins();
        }
        try {
            this.renderEditor();
        } catch { }
    }

    private renderEditor(valueChanged?: boolean) {
        // const editorPlugins = Object.values(this.editorPlugins);
        const editorPlugins = [...this.editorPlugins].filter(Boolean);
        let padding: ISpace = this.getAttribute('padding', true);
        let font: IFont = this.getAttribute('font', true);
        let border: IBorder = this.getAttribute('border', true);
        if (this.viewer) {
            if (this.editorObj) {
                this.editorObj.destroy();
            }
            if (!this.elm) {
                this.elm = this.createElement('div', this);
            } else {
                this.elm.innerHTML = '';
                this.elm.style.height = 'auto';
            }
            // this.viewerObj = this.editor.factory({
            //     el: this.elm,
            //     viewer: true,
            //     initialValue: this.value,
            //     theme: this.theme,
            //     plugins: [...editorPlugins, ...this.plugins],
            //     widgetRules: this.widgetRules,
            // });
            this.mdViewer = new Markdown();
            if (padding) this.mdViewer.padding = padding;
            if (font) this.mdViewer.font = font;
            this.mdViewer.theme = this.theme;
            this.elm.appendChild(this.mdViewer);
        } else {
            // if (this.viewerObj) {
            //     this.viewerObj.destroy();
            // }
            if (!this.elm) {
                this.elm = this.createElement('div', this);
            } else {
                this.elm.innerHTML = '';
            }
            this.overlayElm.style.display = this._designMode ? 'block' : 'none';
            const currentValue = valueChanged && this.editorObj ? this.editorObj.getMarkdown() : this.value;

            this.editorObj = new this.editor({
                el: this.elm,
                previewStyle: this.previewStyle,
                height: this.height,
                initialEditType: this.mode,
                initialValue: currentValue,
                theme: this.theme,
                toolbarItems: this.toolbarItems,
                plugins: [...editorPlugins, ...this.plugins],
                widgetRules: this.widgetRules,
                hideModeSwitch: this.hideModeSwitch,
                minHeight: this.minHeight ?? '300px',
                placeholder: this.placeholder,
                autofocus: this._designMode ? false : this.autoFocus,
                events: {
                    change: (event: any) => {
                        if (this._designMode) return;
                        if (this.isPaste) {
                            this.isPaste = false;
                            this.editorObj.setMarkdown(this.editorObj.getMarkdown(), false);
                            return;
                        }
                        if (typeof this.onObserverChanged === 'function')
                            this.onObserverChanged(this, event);
                        if (typeof this.onChanged === 'function')
                            this.onChanged(this, event);
                    },
                    focus: (event: any, data: any) => {
                        if (this._designMode) return;
                        if (this.onFocus) this.onFocus(this, event);
                    },
                    blur: (event: any) => {
                        if (this.onBlur) this.onBlur(this, event);
                    },
                    keydown: (target: any, event: KeyboardEvent) => {
                        const isPaste = event.ctrlKey && event.key === "v";
                        this.isPaste = isPaste && this.editorObj && this._widgetRules?.length > 0;
                        if (this._designMode) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    },
                    keyup: (target: any, event: KeyboardEvent) => {
                        if (this._designMode) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                }
            });

            if (this.autoFocus) {
                this.editorObj.getCurrentModeEditor().el.querySelector('.toastui-editor-contents')?.click();
                this.editorObj.getCurrentModeEditor().moveCursorToStart(true);
            }

            if (this.theme === 'light') this.elm.classList.remove('toastui-editor-dark');

            const toolbar = this.querySelector('.toastui-editor-toolbar') as HTMLElement;
            if (toolbar && !this.toolbarItems?.length) toolbar.style.display = 'none';

            if (!this._padding && padding) this.padding = padding;
        }

        this.elm.style.background = 'inherit';
        this.elm.style.fontSize = 'inherit';
        if (border) {
            this._border = new Border(this.elm, border);
            this.style.border = 'none';
            this.style.borderRadius = 'unset';
        }
    }

    getMarkdownValue() {
        if (this.editorObj && !this.viewer) {
            return this.editorObj.getMarkdown();
        }
        return '';
    }

    getEditorElm() {
        if (this.editorObj && !this.viewer) {
            return this.editorObj;
        }
        return null;
    }

    getViewerElm() {
        // if (this.viewerObj && this.viewer) {
        //     return this.viewerObj;
        // }
        if (this.mdViewer)
            return this.mdViewer;
        return null;
    }

    protected async init() {
        super.init();
        this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
        this.onFocus = this.getAttribute('onFocus', true) || this.onFocus;
        this.onBlur = this.getAttribute('onBlur', true) || this.onBlur;
        this.overlayElm = this.createElement('div', this);
        this.overlayElm.classList.add('overlay');
        const mode = this.getAttribute('mode', true, '');
        if (mode) {
            this._mode = mode;
        }
        const previewStyle = this.getAttribute('previewStyle', true, '');
        if (previewStyle) {
            this._previewStyle = previewStyle;
        }
        const value = this.getAttribute('value', true, '');
        if (value) {
            this._value = value;
        }
        const viewer = this.getAttribute('viewer', true, null);
        if (viewer !== null) {
            this.viewer = viewer;
        }
        const height = this.getAttribute('height', true, '');
        if (height) {
            this._heightValue = height;
        }
        const width = this.getAttribute('width', true, '');
        if (width) {
            this.width = width;
        }
        const theme = this.getAttribute('theme', true, '');
        if (theme) {
            this._theme = theme;
        }
        const toolbarItems = this.getAttribute('toolbarItems', true, '');
        if (toolbarItems) {
            this._toolbarItems = toolbarItems;
        }
        const plugins = this.getAttribute('plugins', true, '');
        if (plugins) {
            this._customPlugins = plugins;
        }
        const widgetRules = this.getAttribute('widgetRules', true, '');
        if (widgetRules) {
            this._widgetRules = widgetRules;
        }
        this._placeholder = this.getAttribute('placeholder', true, '');
        this._hideModeSwitch = this.getAttribute('hideModeSwitch', true, false);
        this.autoFocus = this.getAttribute('autoFocus', true, false);
        this.initEditor();
    }
}
