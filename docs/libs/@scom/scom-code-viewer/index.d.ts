/// <amd-module name="@scom/scom-code-viewer/index.css.ts" />
declare module "@scom/scom-code-viewer/index.css.ts" {
    export const customMdStyles: string;
    export const overflowStyle: string;
}
/// <amd-module name="@scom/scom-code-viewer" />
declare module "@scom/scom-code-viewer" {
    import { ControlElement, Module } from '@ijstech/components';
    interface ScomCodeViewerElement extends ControlElement {
        code?: string;
        language?: string;
        entryPoint?: string;
        isButtonsShown?: boolean;
        theme?: 'light' | 'dark';
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
    }
    export class ScomCodeViewer extends Module {
        private pnlViewer;
        private scomDesigner;
        private hljs;
        private pnlButtons;
        private btnEdit;
        private btnCopy;
        private _data;
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
        setData(value: ICodeViewer): Promise<void>;
        private renderUI;
        private revertHtmlTags;
        private sleep;
        private getFullCode;
        private fetchContent;
        private updateButtons;
        private initLibs;
        private addCSS;
        private onCopy;
        private onEdit;
        onClose(): void;
        init(): void;
        render(): any;
    }
}
