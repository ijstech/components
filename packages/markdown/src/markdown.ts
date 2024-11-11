import { Control, ControlElement, customElements, ISpace, LibPath, RequireJS, SpaceValue } from "@ijstech/base";
// import "./style/markdown.css";
import './styles/index.css';
import { TxtRenderer } from './plaintify';

export interface MarkdownElement extends ControlElement {
    // caption?: string;
    // src?: string;
    // assetPath?: string;
    theme?: 'light' | 'dark';
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ["i-markdown"]: MarkdownElement;
        }
    }
}
const libs = [`${LibPath}lib/marked/marked.umd.js`];
// const headingRegex = /(#{1,6})\s(.*?)(?=\||(#{1,6})|$)/gm;
// const numberedListRegex = /(\d+)\.(\s{1,2})(.*?)(?=\||(\d+\.)|$)/gm;
// const bulletListRegex = /([-+*])\s{1,2}(.*?)(?=\||\\n|([-+*])|$)/gm;

export async function markdownToPlainText(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
        RequireJS.require(libs, async (marked: any) => {
            marked.use({
                gfm: true,
                renderer: TxtRenderer
            });
            const plainText = await marked.parse(text);
            resolve(plainText);
        });
    });
}

@customElements("i-markdown", {
    icon: "spell-check",
    className: "Markdown",
    props: {
        theme: {type: 'string'}
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            theme: {
                type: 'string',
                enum: ['light', 'dark'],
                default: 'light'
            }
        }
    }
})
export class Markdown extends Control {
    private elm: any;
    private marked: any;
    gitbookProcess: boolean = true;
    fileRoot: string;
    private _theme: 'light' | 'dark' = 'light';
    private _space: ISpace;

    constructor(parent?: Control, options?: MarkdownElement) {
        super(parent, options);
    }

    get theme() {
        return this._theme;
    }

    set theme(value: 'light' | 'dark') {
        this._theme = value;
        if (this._theme === 'light')
            this.classList.remove('toastui-editor-dark');
        else 
            this.classList.add('toastui-editor-dark');
    }

    get padding(): ISpace {
        return this._padding;
    }
    set padding(value: ISpace) {
        this._space = value;
        if (!this.elm) return;
        if (!this._padding)
            this._padding = new SpaceValue(this.elm, value, 'padding')
        else
            this._padding.update(value);
    }

    private getRenderer() {
        const renderer = {
            // image(href: string, title: string, text: string) {
            //     if (href === null) {
            //         return text;
            //     }
            //     var out = '<span><img style="width: 100%;" src="' + href + '" alt="' + text + '"';
            //     if (title) {
            //         out += ' title="' + title + '"';
            //     }
            //     out += '><span class="img-caption">' + text + '</span></span>';
            //     return out;
            // }
            link(href: string, title: string, text: string) {
                return `<a target="_blank" href="${href}" ${title ? 'title="' + title + '"' : ''}>${text}</a>`;
            }
        };
        return renderer;
    }
    
    async getTokens(text: string) {
        if (!this.marked) this.marked = await this.loadLib();
        let tokens;
        try {
            tokens = this.marked.lexer(text, {
                breaks: true
            });
        } catch (e) {}
        return tokens;
    }

    async toPlainText(text: string) {
        if (!this.marked) this.marked = await this.loadLib();
        this.marked.use({
            gfm: true,
            renderer: TxtRenderer
        });
        const plainText: string = await this.marked.parse(text);
        return plainText;
    }

    async load(text: string) {
        if (!this.marked) this.marked = await this.loadLib();
        let renderer = this.getRenderer();
        this.marked.use({
            renderer
        });
        if (text) {
            const rows = text.split(/\n{2}|(?:\r\n){2}/);
            for (let i = 0; i < rows.length; i++) {
                rows[i] = rows[i] ? await this.preParse(rows[i]) : '';
                const regex = /```((\w+)?[\s\n])*\(/g;
                const matches = regex.exec(rows[i]);
                if (matches?.length) {
                    const group = matches[1];
                    if (group)
                        rows[i] = rows[i].replace(group, group.trim());
                }
            }

            text = rows.join('\n\n');
            text = await this.marked.parse(text, {
                breaks: true
            });
            text = await this.processText(text);
        } else {
            text = '';
        };
        if (!this.elm) this.elm = this.createElement('div', this);
        this.elm.innerHTML = text;
        if (!this._padding && this._space) this.padding = this._space;
        return this.elm.innerHTML;
    }

    private async preParse(text: string) {
        const firstIndex = text.indexOf('|');
        const lastIndex = text.lastIndexOf('|');
        const tableMd = text.slice(firstIndex, lastIndex + 1);

        const tableMdRegex = /(?:^|\r?\n\r?\n)([^\r\n]*\|[^\r\n]*(\r?\n)?)+(?=\r?\n\r?\n|$)/gm; //Avoid using lookbehind
        if (!tableMdRegex.test(tableMd)) return text;
        const breakRegex = /\|(\s)*:?(-+):?(\s)*\|/gm;
        if (!breakRegex.test(tableMd)) return text;
        const splittedArr: string[] = [];
        let currentSegment = '';
        let isEscaped = false;
        
        for (let i = 0; i < tableMd.length; i++) {
            const char = tableMd[i];
            if (char === '\\' && !isEscaped) {
                isEscaped = true;
            } else if (char === '|' && !isEscaped) {
                splittedArr.push(currentSegment);
                currentSegment = '';
            } else {
                currentSegment += char;
                isEscaped = false;
            }
        }
        splittedArr.push(currentSegment);
        for (let i = 0; i < splittedArr.length; i++) {
            let child = splittedArr[i].trim() || '';
            if (child) {
                if (/^(\s)*:?-*:?(\s)*$/g.test(child)) continue;
                child = await this.marked.parse(child, {
                    breaks: true
                });
                if (child !== '\n') {
                    splittedArr[i] = child.replace(/\n/g, '').replace("|", "&#124;");
                }
            }
        }
        text = text.slice(0, firstIndex) + splittedArr.join('|');
        return text;
    }

    async beforeRender(text: string) {
        this.elm.innerHTML = text;
    }

    async processText(text: string) {
        if (this.gitbookProcess) {
            // List of sub items
            text = text.replace(/\*\*\*\*/g, '\n\t').replace(/\\/g, '');
        }

        return text;
    }


    private async loadLib() {
        return new Promise((resolve, reject) => {
            RequireJS.require(libs, async (marked: any) => {
                resolve(marked);
            });
        });
    }

    protected init() {
        super.init();
        this.elm = this.createElement('div', this);
        this.elm.classList.add('toastui-editor-contents');
        const theme = this.getAttribute('theme', true);
        if (theme) this.theme = theme;
        const padding: ISpace = this.getAttribute('padding', true);
        if (padding) {
            this._padding = new SpaceValue(this.elm as Control, padding, 'padding')
        }
    }
}
