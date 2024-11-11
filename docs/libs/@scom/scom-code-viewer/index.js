var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-code-viewer/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.overflowStyle = exports.customMdStyles = void 0;
    exports.customMdStyles = components_1.Styles.style({
        position: 'fixed!important',
        $nest: {
            '> .modal-wrapper': {
                left: '0px !important',
                $nest: {
                    '> .modal > .i-modal_header': {
                        height: 30,
                        flexShrink: 0,
                    },
                    '> .modal > .i-modal_body': {
                        overflow: 'hidden',
                        padding: '0px',
                        width: '100%',
                        height: 'calc(100% - 30px)',
                        position: 'relative'
                    },
                }
            }
        }
    });
    exports.overflowStyle = components_1.Styles.style({
        overflow: 'hidden'
    });
});
define("@scom/scom-code-viewer", ["require", "exports", "@ijstech/components", "@scom/scom-designer", "@scom/scom-code-viewer/index.css.ts"], function (require, exports, components_2, scom_designer_1, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomCodeViewer = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    const path = components_2.application.currentModuleDir;
    const DEFAULT_LANGUAGE = 'javascript';
    let ScomCodeViewer = class ScomCodeViewer extends components_2.Module {
        constructor() {
            super(...arguments);
            this._data = {
                code: '',
                language: DEFAULT_LANGUAGE
            };
            this.fileData = { content: '', path: 'index.tsx' };
            this._fullPath = '';
            this.tag = {};
        }
        get code() {
            return this.revertHtmlTags(this._data.code || '');
        }
        set code(value) {
            this._data.code = value || '';
        }
        get language() {
            return this._data.language || DEFAULT_LANGUAGE;
        }
        set language(value) {
            this._data.language = value || DEFAULT_LANGUAGE;
        }
        get entryPoint() {
            return this._data.entryPoint || '';
        }
        set entryPoint(value) {
            this._data.entryPoint = value || '';
        }
        get fullCode() {
            return this.fileData?.content || this.code;
        }
        get isButtonsShown() {
            return this._data.isButtonsShown ?? true;
        }
        set isButtonsShown(value) {
            this._data.isButtonsShown = value ?? true;
        }
        async setData(value) {
            const code = value.code;
            if (code.startsWith('`') && code.endsWith('`')) {
                this.entryPoint = value?.entryPoint || '';
                this.isButtonsShown = value?.isButtonsShown ?? true;
                const regex = /```(\w+)?(\((.+?)\))?[\s\n]([\s\S]+)[\s\n]```/g;
                const matches = regex.exec(code);
                const path = matches?.[3] || '';
                const mainCode = matches?.[4] || '';
                this.code = mainCode;
                let language = matches?.[1] || DEFAULT_LANGUAGE;
                if (language) {
                    language = `${language}${path ? `(${path})` : ''}`;
                }
                this.language = language;
                this._fullPath = path;
                await this.fetchContent(path);
            }
            else {
                try {
                    if (value.code) {
                        value.code = atob(value.code);
                    }
                }
                catch { }
                this._data = value;
            }
            await this.renderUI();
        }
        async renderUI() {
            this.pnlButtons.visible = this.isButtonsShown;
            if (!this.hljs) {
                try {
                    this.addCSS(`${path}/lib/dark.min.css`, 'hljs');
                    this.hljs = await this.initLibs();
                }
                catch { }
            }
            this.pnlViewer.innerHTML = '';
            const pre = document.createElement('pre');
            if (this.code.startsWith('<code')) {
                const codeRegex = new RegExp(/(<code(\s*class=(\"language-[^>|<]*\"))?>)(.*?)(<\/code>)/gis);
                const matches = codeRegex.exec(this.code);
                const innerText = matches?.[4] || this.code;
                await this.getFullCode(matches?.[3]);
                const codeEl = document.createElement('code');
                codeEl.textContent = innerText;
                pre.appendChild(codeEl);
                codeEl.setAttribute('data-language', this.language);
            }
            else {
                const codeEl = document.createElement('code');
                codeEl.textContent = this.code;
                pre.appendChild(codeEl);
                codeEl.setAttribute('data-language', this.language);
            }
            this.pnlViewer.appendChild(pre);
            await this.sleep(200);
            const codeEl = pre.querySelector('code');
            if (codeEl) {
                this.hljs.highlightBlock(codeEl);
                const lg = this.language.split('(')?.[0] || '';
                if (lg)
                    codeEl.classList.add(lg);
            }
            this.updateButtons(!!this._fullPath);
        }
        revertHtmlTags(str) {
            return (str || '').replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'");
        }
        ;
        sleep(time) {
            return new Promise((res, rej) => {
                setTimeout(res, time);
            });
        }
        async getFullCode(code) {
            if (!code)
                return;
            const lgRegex = new RegExp(/language-(.*?) .*$/gi);
            const lg = code.replace(lgRegex, (_, lg) => lg);
            this.language = lg;
            const filePath = lg.substr(lg.indexOf('(') + 1, lg.indexOf(')') - lg.indexOf('(') - 1);
            this._fullPath = filePath;
            await this.fetchContent(filePath);
        }
        async fetchContent(filePath) {
            if (!filePath)
                return;
            if (filePath.startsWith('/'))
                filePath = filePath.slice(1);
            const response = await components_2.application.fetch(`${this.entryPoint}/${filePath}`);
            const script = await response.text();
            this.fileData.content = script;
            this.fileData.path = filePath || 'index.tsx';
        }
        updateButtons(hasPath) {
            this.btnEdit.visible = hasPath;
            this.btnCopy.border = hasPath ? { radius: '0 6px 6px 0', style: 'none', width: '0px' } : { radius: '6px', style: 'none', width: '0px' };
        }
        async initLibs() {
            return new Promise((resolve, reject) => {
                components_2.RequireJS.config({
                    paths: {
                        hljs: `${path}/lib/highlight.min.js`
                    }
                });
                components_2.RequireJS.require(['hljs'], function (hljs) {
                    return resolve(hljs);
                });
            });
        }
        addCSS(href, name) {
            const css = document.head.querySelector(`[name="${name}"]`);
            if (css)
                return;
            let link = document.createElement('link');
            link.setAttribute('type', 'text/css');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('name', name);
            link.href = href;
            document.head.append(link);
        }
        async onCopy(target, event) {
            event.stopPropagation();
            const code = this.querySelector('code')?.innerText || '';
            if (!code)
                return;
            navigator.clipboard.writeText(code);
            target.innerText = 'Copied';
            setTimeout(() => (target.innerText = 'Copy'), 1000);
        }
        async onEdit() {
            let currentModal = null;
            if (!this.scomDesigner) {
                this.scomDesigner = new scom_designer_1.ScomDesigner(undefined, {
                    file: { ...this.fileData },
                });
                this.scomDesigner.onTogglePreview = (isPreview) => {
                    const closeIcon = currentModal.querySelector('.i-modal_header');
                    if (isPreview) {
                        closeIcon.style.display = 'none';
                    }
                    else {
                        closeIcon.style.display = 'block';
                    }
                };
            }
            else {
                await this.scomDesigner.setValue({
                    file: { ...this.fileData }
                });
            }
            const configurator = this.scomDesigner.getConfigurators().find(c => c.target === 'Builders');
            if (configurator?.setTag) {
                configurator.setTag(this.scomDesigner.tag);
            }
            currentModal = this.scomDesigner.openModal({
                width: '100dvw',
                height: '100dvh',
                showBackdrop: false,
                popupPlacement: 'center',
                zIndex: 600,
                closeOnBackdropClick: false,
                closeIcon: { name: 'times', width: '1rem', height: '1rem', fill: Theme.text.primary, position: 'absolute', right: 16, top: 10, cursor: 'pointer' },
                padding: { top: 0, bottom: 0, left: 0, right: 0 },
                border: { radius: '0px', width: '0px', style: 'none' },
                overflow: 'hidden',
                class: index_css_1.customMdStyles,
                onClose: this.onClose.bind(this),
            });
            document.body.classList.add(index_css_1.overflowStyle);
        }
        onClose() {
            document.body.classList.remove(index_css_1.overflowStyle);
        }
        init() {
            super.init();
            const code = this.getAttribute('code', true);
            const language = this.getAttribute('language', true);
            const entryPoint = this.getAttribute('entryPoint', true);
            const isButtonsShown = this.getAttribute('isButtonsShown', true);
            code && this.setData({ code, language, entryPoint, isButtonsShown });
        }
        render() {
            return (this.$render("i-vstack", { width: '100%', background: { color: Theme.background.main }, border: { color: Theme.divider, width: '1px', style: 'solid', radius: '0.5rem' }, overflow: 'hidden' },
                this.$render("i-hstack", { id: "pnlButtons", horizontalAlignment: 'end', verticalAlignment: 'center', width: '100%', padding: { left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem' }, border: { bottom: { color: Theme.divider, width: '1px', style: 'solid' } } },
                    this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: 'center', height: '1.75rem', stack: { grow: '0', shrink: '0' }, border: { radius: 6 } },
                        this.$render("i-button", { id: "btnEdit", height: '100%', cursor: "pointer", stack: { shrink: '0' }, icon: { name: 'edit', width: '0.75rem', height: '0.75rem', fill: Theme.action.active }, background: { color: Theme.action.activeBackground }, tooltip: { content: 'Edit', placement: 'bottom' }, padding: { top: 0, bottom: 0, left: '0.75rem', right: '0.75rem' }, boxShadow: 'none', visible: false, border: { radius: '6px 0 0 6px', style: 'none', width: '0px', right: { width: '1px', style: 'solid', color: Theme.divider } }, onClick: this.onEdit }),
                        this.$render("i-button", { id: "btnCopy", height: '100%', cursor: "pointer", stack: { shrink: '0' }, icon: { name: 'copy', width: '0.75rem', height: '0.75rem', fill: Theme.action.active }, tooltip: { content: 'Copy', placement: 'bottom' }, background: { color: Theme.action.activeBackground }, padding: { top: 0, bottom: 0, left: '0.75rem', right: '0.75rem' }, boxShadow: 'none', border: { radius: '0 6px 6px 0', style: 'none', width: '0px' }, onClick: this.onCopy }))),
                this.$render("i-panel", { id: "pnlViewer", display: 'block', stack: { grow: '1', shrink: '1' }, width: '100%' })));
        }
    };
    ScomCodeViewer = __decorate([
        (0, components_2.customElements)('i-scom-code-viewer')
    ], ScomCodeViewer);
    exports.ScomCodeViewer = ScomCodeViewer;
});
