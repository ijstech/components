/// <amd-module name="@scom/scom-code-viewer/index.css.ts" />
declare module "@scom/scom-code-viewer/index.css.ts" {
    export const customMdStyles: string;
    export const overflowStyle: string;
}
/// <amd-module name="@scom/scom-code-viewer/translations.json.ts" />
declare module "@scom/scom-code-viewer/translations.json.ts" {
    const _default: {
        en: {
            warning: string;
            do_you_want_to_close_the_modal: string;
        };
        "zh-hant": {
            warning: string;
            do_you_want_to_close_the_modal: string;
        };
        vi: {
            warning: string;
            do_you_want_to_close_the_modal: string;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-code-viewer" />
declare module "@scom/scom-code-viewer" {
    import { ControlElement, Module } from '@ijstech/components';
    type ThemeType = 'light' | 'dark';
    interface ScomCodeViewerElement extends ControlElement {
        code?: string;
        language?: string;
        entryPoint?: string;
        isButtonsShown?: boolean;
        theme?: ThemeType;
        defaultLocale?: string;
        currentLocale?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-code-viewer']: ScomCodeViewerElement;
            }
        }
    }
    interface ICodeViewer {
        code?: string;
        language?: string;
        entryPoint?: string;
        isButtonsShown?: boolean;
        defaultLocale?: string;
        currentLocale?: string;
    }
    export class ScomCodeViewer extends Module {
        private pnlViewer;
        private scomDesigner;
        private hljs;
        private pnlButtons;
        private btnEdit;
        private btnCopy;
        private alertEl;
        private _data;
        private _theme;
        private fileData;
        private _fullPath;
        tag: any;
        get code(): string;
        set code(value: string);
        get language(): string;
        set language(value: string);
        get entryPoint(): string;
        set entryPoint(value: string);
        get fullCode(): string;
        get isButtonsShown(): boolean;
        set isButtonsShown(value: boolean);
        get theme(): ThemeType;
        set theme(value: ThemeType);
        get currentLocale(): string;
        set currentLocale(value: string);
        get defaultLocale(): string;
        set defaultLocale(value: string);
        setData(value: ICodeViewer): Promise<void>;
        private renderUI;
        private revertHtmlTags;
        private sleep;
        private getFullCode;
        private fetchContent;
        private fetchFile;
        private updateButtons;
        private initLibs;
        private addCSS;
        private removeCSS;
        private onCopy;
        private onEdit;
        private onImportFile;
        onClose(): void;
        private onBeforeClose;
        private handleClose;
        init(): void;
        render(): any;
    }
}
