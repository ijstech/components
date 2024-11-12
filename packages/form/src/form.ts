import { Control, ControlElement, customElements, Container, notifyMouseEventCallback } from '@ijstech/base';
import { Tabs } from '@ijstech/tab';
import { Input } from '@ijstech/input';
import { GridLayout, HStack, Panel, VStack } from '@ijstech/layout';
import { Datepicker } from '@ijstech/datepicker';
import { ComboBox } from '@ijstech/combo-box';
import { Checkbox } from '@ijstech/checkbox';
import { RadioGroup } from '@ijstech/radio';
import { Label } from '@ijstech/label';
import { Upload, UploadRawFile } from '@ijstech/upload';
import { Icon } from '@ijstech/icon';
import { Button } from '@ijstech/button';
import * as Styles from './styles/index.css';
import { Theme } from '@ijstech/style';
import { moment } from '@ijstech/moment';
import { hashFile } from '@ijstech/ipfs';

import {
    IUISchemaRules,
    IUISchemaOptions,
    IDataSchema,
    IUISchema,
    ValidationResult,
    ValidationError,
    IDataSchemaTypeName,
    IUISchemaRulesEffect,
    IInputOptions
} from './types';
import './styles/index.css';

const theme = Theme.ThemeVars;
const IPFS_Gateway = 'https://ipfs.scom.dev/ipfs/';

export { IDataSchema, IUISchema };

export interface FormElement extends ControlElement {
    jsonSchema?: IDataSchema;
    uiSchema?: IUISchema;
    data?: any;
    options?: IFormOptions;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-form']: FormElement;
        }
    }
}

interface IControl {
    input?: Control;
    getCustomData?: () => any;
    wrapper?: Panel;
    label?: Label;
    description?: Label;
    error?: Label;
}

interface IControlOptions {
    caption?: string;
    placeholder?: string;
    description?: string;
    tooltip?: string;
    readOnly?: boolean;
    required?: boolean;
    columnWidth?: string | number;
    hideLabel?: boolean;
}

interface IButtonOptions {
    caption?: string;
    backgroundColor?: string;
    fontColor?: string;
    hide?: boolean;
    onClick?: notifyMouseEventCallback;
}

export interface IFormOptions {
    columnsPerRow?: number;
    confirmButtonOptions?: IButtonOptions;
    clearButtonOptions?: IButtonOptions;
    columnWidth?: string | number;
    dateTimeFormat: {
        date?: string;
        time?: string;
        dateTime?: string;
    };
    customControls?: {
        [key: string]: {
            render: (parent?: Control) => Control;
            getData: (control: Control) => any;
            setData: (control: Control, value: any, rowData?: any) => void;
        }
    };
    onChange?: (control: Control, value?: any) => void;
}

const DEFAULT_OPTIONS = {
    columnsPerRow: 1,
    confirmButtonOptions: {
        caption: 'Confirm',
        backgroundColor: theme.colors.primary.main,
        fontColor: theme.colors.primary.contrastText,
        hide: false
    },
    clearButtonOptions: {
        caption: 'Clear',
        backgroundColor: theme.colors.primary.main,
        fontColor: theme.colors.primary.contrastText,
        hide: true
    },
    dateTimeFormat: {
        date: 'YYYY-MM-DD',
        time: 'HH:mm:ss',
        dateTime: 'YYYY-MM-DD HH:mm:ss'
    },
    columnWidth: '100%'
};

interface IRule {
    elm: Control;
    rule: IUISchemaRules;
    control?: IControl
}

@customElements('i-form', {
    props: {},
    events: {}
})
export class Form extends Control {
    private _jsonSchema: IDataSchema;
    private _uiSchema: IUISchema;
    private _formOptions: IFormOptions;
    private _formRules: IRule[] = [];
    private _formControls: {
        [scope: string]: IControl
    } = {};

    private validationData: any;
    private validationResult: ValidationResult | null;
    private isSubmitted: boolean;

    constructor(parent?: Control, options?: any) {
        super(parent, options);
    }

    protected init() {
        super.init();
        this.classList.add(Styles.formStyle);
        this._jsonSchema = this.getAttribute('jsonSchema', true);
        this._uiSchema = this.getAttribute('uiSchema', true);
        this._formOptions = this.getAttribute('options', true);
        if (!this._formOptions)
            this._formOptions = DEFAULT_OPTIONS;
        this.renderForm();
    }

    set formOptions(options: any) {
        this._formOptions = options;
    }

    get formOptions(): any {
        return this._formOptions;
    }

    set jsonSchema(jsonSchema: IDataSchema) {
        this._jsonSchema = jsonSchema;
    }

    get jsonSchema(): IDataSchema {
        return this._jsonSchema;
    }

    set uiSchema(uiSchema: IUISchema) {
        this._uiSchema = uiSchema;
    }

    get uiSchema(): IUISchema {
        return this._uiSchema;
    }

    clearFormData() {
        for (const scope in this._formControls) {
            const control = this._formControls[scope];
            const { input, error } = control;
            if (input) {
                if (error) {
                    error.removeAttribute('is-visible');
                    error.caption = '';
                    error.visible = false;
                }
                switch (input.tagName) {
                    case 'I-INPUT':
                        (input as Input).value = '';
                        break;
                    case 'I-CHECKBOX':
                        (input as Checkbox).checked = false;
                        break;
                    case 'I-DATEPICKER':
                        (input as Datepicker).value = undefined;
                        break;
                    case 'I-COMBO-BOX':
                        (input as ComboBox).clear();
                        break;
                    case 'I-VSTACK':
                        (input as Container).clearInnerHTML();
                        break;
                    case 'I-UPLOAD':
                        (input as Upload).clear();
                        break;
                }
            }
        }
    }

    setFormData(data: any) {
        for (const key in data) {
            const value = data[key];
            const scope = `#/properties/${key}`;
            this.setData(scope, value, undefined, data);
        }
        this.validateAllRule();
    }

    private setCustomData(scope: string, value: any, control?: any, customData?: any) {
        let newScope = scope;
        if (newScope.includes('/items/properties')) {
           newScope = this.replacePhrase(scope);
        }
        if (this._formOptions.customControls && !!this._formOptions.customControls[newScope]?.setData) {
            const _control = control || this._formControls[newScope].input;
            if (_control) {
                if (_control.tagName === 'I-SCOM-TOKEN-INPUT' && !value && customData) {
                    this._formOptions.customControls[newScope].setData(_control, customData.symbol, customData);
                } else {
                    this._formOptions.customControls[newScope].setData(_control, value, customData);
                }
            }
        }
    }

    private setData(scope: string, value: any, parentElm?: Element, customData?: any) {
        let _control;
        this.setCustomData(scope, value, undefined, customData);
        if (this._formControls[scope]?.input?.tagName === 'designer-template-areas'.toUpperCase()) {
            return;
        }
        if (typeof value === 'object') {
            if (value instanceof Array) {
                if (parentElm) {
                    const currentFld = scope.split('/').pop();
                    _control = parentElm.querySelector(`[array-field="${currentFld}"]`)?.lastChild as Control;
                }
                const grid = _control || this._formControls[scope]?.input;
                if (grid) {
                    grid.clearInnerHTML();
                    for (const data of value) {
                        const schema = this.getDataSchemaByScope(scope)[1]?.items;
                        this.renderCard({ parent: (grid as Container), scope, schema: (schema as IDataSchema), options: {} });
                    }
                    const listItems = grid?.querySelectorAll(':scope > [role="list-item"]');
                    if (listItems && listItems.length > 0) {
                        for (let i = 0; i < listItems.length; i++) {
                            const listItem = listItems[i];
                            const rowData = value[i];
                            const fields = listItem.querySelectorAll('[role="field"]');
                            if (grid.getAttribute('non-object') === true) {
                                const field = fields[0];
                                if (field) {
                                    if (field.tagName === 'I-INPUT') {
                                        (field as Input).value = rowData;
                                    } else if (field.tagName === 'I-CHECKBOX') {
                                        (field as Checkbox).checked = rowData;
                                    } else if (field.tagName === 'I-COMBO-BOX') {
                                        (field as ComboBox).value = rowData;
                                        // const selectedItem = (field as ComboBox).items.find(v => v.value === rowData);
                                        // if (selectedItem)
                                        //     (field as ComboBox).selectedItem = selectedItem;
                                    } else if (field.tagName === 'I-RADIO-GROUP') {
                                        (field as RadioGroup).selectedValue = rowData;
                                    } else if (field.tagName === 'I-DATEPICKER') {
                                        let datepicker = field as Datepicker;
                                        datepicker.value = moment(rowData, datepicker.dateTimeFormat || datepicker.defaultDateTimeFormat);
                                    } else {
                                        this.setCustomData(scope, rowData, field, rowData);
                                    }
                                }
                            } else {
                                for (let j = 0; j < fields.length; j++) {
                                    const field = fields[j];
                                    const fieldName = field.getAttribute('field') || '';
                                    const columnData = rowData[fieldName];
                                    if (field.tagName === 'I-INPUT') {
                                        (field as Input).value = columnData;
                                    } else if (field.tagName === 'I-CHECKBOX') {
                                        (field as Checkbox).checked = columnData;
                                    } else if (field.tagName === 'I-COMBO-BOX') {
                                        (field as ComboBox).value = columnData;
                                        // const selectedItem = (field as ComboBox).items.find(v => v.value === columnData);
                                        // if (selectedItem)
                                        //     (field as ComboBox).selectedItem = selectedItem;
                                    } else if (field.tagName === 'I-RADIO-GROUP') {
                                        (field as RadioGroup).selectedValue = columnData;
                                    } else if (field.tagName === 'I-DATEPICKER') {
                                        let datepicker = field as Datepicker;
                                        datepicker.value = moment(columnData, datepicker.dateTimeFormat || datepicker.defaultDateTimeFormat);
                                    } else if (field.tagName === 'I-UPLOAD') {
                                        this.setDataUpload(columnData, field as Upload);
                                    } else {
                                        const customScope = `${scope}/properties/${fieldName}`;
                                        this.setCustomData(customScope, columnData, field, rowData);
                                    }
                                }
                                const subArr = listItem.querySelectorAll('[role="array"]');
                                for (const subItem of subArr) {
                                    if (subItem.closest('[role="list-item"]') === listItem) {
                                        const field = subItem.getAttribute('array-field') || '';
                                        this.setData(`${scope}/items/properties/${field}`, rowData[field], listItem, rowData);
                                    }
                                }
                                const subObj = listItem.querySelectorAll('[role="object"]');
                                for (const subItem of subObj) {
                                    if (subItem.closest('[role="list-item"]') === listItem) {
                                        const field = subItem.getAttribute('object-field') || '';
                                        this.setData(`${scope}/items/properties/${field}`, rowData[field], listItem, rowData);
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if (parentElm) {
                    const currentFld = scope.split('/').pop();
                    _control = parentElm.querySelector(`[object-field="${currentFld}"]`) as Control;
                }
                for (const key in value) {
                    const data = value[key];
                    const currentScope = `${scope}/properties/${key}`;
                    this.setData(currentScope, data, _control || parentElm, data);
                }
            }
        } else {
            if (parentElm) {
                _control = parentElm.querySelector(`[scope="${scope}"]`);
                if (!_control) {
                    const customScope = scope.includes('/items/properties') ? this.replacePhrase(scope) : scope;
                    _control = parentElm.querySelector(`[custom-control="${customScope}"]`);
                }
            }
            const input = _control || this._formControls[scope]?.input;
            if (!input && value === undefined) {
                const currentFld = scope.split('/').pop();
                const objElm = parentElm?.querySelector(`[object-field="${currentFld}"]`);
                if (objElm) {
                    const _inputs = objElm.querySelectorAll(':scope > i-panel > i-vstack > [role="field"]');
                    for (const _input of _inputs) {
                        this.setData(`${scope}/properties/${_input.getAttribute('field')}`, undefined, objElm);
                    }
                }
                return;
            }
            if (input) {
                if (input.getAttribute('custom-control')) {
                    this.setCustomData(input.getAttribute('custom-control'), value, input, customData);
                } else {
                    switch (input.tagName) {
                        case 'I-INPUT':
                            (input as Input).value = value;
                            break;
                        case 'I-CHECKBOX':
                            (input as Checkbox).checked = value;
                            break;
                        case 'I-COMBO-BOX':
                            (input as ComboBox).value = value;
                            const isValid = (input as ComboBox).items.find(v => v.value === value);
                            if (!isValid) (input as ComboBox).selectedItem = (input as ComboBox).items[0];
                            // (input as ComboBox).selectedItem = (input as ComboBox).items.find(v => v.value === value) || (input as ComboBox).items[0];
                            break;
                        case 'I-DATEPICKER':
                            let datepicker = input as Datepicker;
                            datepicker.value = moment(value, datepicker.dateTimeFormat || datepicker.defaultDateTimeFormat);
                            break;
                        case 'I-UPLOAD':
                            this.setDataUpload(value, input as Upload);
                            break;
                    }
                }
            }
        }
    }

    async getFormData(isErrorShown?: boolean): Promise<any> {
        if (!this._jsonSchema) return undefined;
        const data = await this.getDataBySchema(this._jsonSchema, '#', isErrorShown);
        if (isErrorShown) {
            this.checkArrayErrors();
        }
        this.isSubmitted = false;
        return data;
    }

    private async getDataBySchema(schema: IDataSchema, scope: string = '#', isErrorShown?: boolean, parentElm?: Element, listItem?: any, parentScope?: string) {
        if (!schema) return undefined;

        const customParentScope = parentScope ? `${parentScope}${scope.replace('#', '')}` : scope;
        let _control;
        // if (parentElm) {
        //     _control = parentElm.querySelector(`[scope="${scope}"]`);
        // }
        let control: Control | Element | undefined;
        if (listItem) {
            const fieldName = scope.split('/').pop();
            control = listItem.querySelector(`[scope="${scope}"]`);
            if (!control) {
                const flds = listItem.querySelectorAll(`[field="${fieldName}"]`);
                const currentScope = scope.replace('#', '');
                for (const fld of flds) {
                    const _fldScope = fld.getAttribute('scope');
                    if (_fldScope && _fldScope.endsWith(currentScope)) {
                        control = fld;
                        break;
                    }
                }
            }
            if (!control && this._formOptions.customControls) {
                if (this._formOptions.customControls[customParentScope]) {
                    control = listItem.querySelector(`[custom-control="${customParentScope}"]`);
                } else if (this._formOptions.customControls[scope] && listItem.parentElement?.hasAttribute('non-object')) {
                    control = listItem.querySelector(`[custom-control="${scope}"]`);
                }
            }
        }
        else {
            control = _control || this._formControls[scope]?.input;
        }
        const checkValidation = () => {
            if (isErrorShown && control) {
                const actControl = control as any;
                if (actControl.querySelector('i-color') && typeof actControl.onClosed === 'function') {
                    actControl.onClosed();
                } else if (typeof actControl.onChanged === 'function') {
                    actControl.onChanged();
                }
            }
        }

        if (this._formOptions.customControls && typeof this._formOptions.customControls[customParentScope]?.getData === 'function') {
            checkValidation();
            return this._formOptions.customControls[customParentScope].getData((control as Control));
        }
        if (schema.type === 'string') {
            if (control) {
                checkValidation();
                switch (control.tagName) {
                    case 'I-INPUT':
                        return (control as Input).value;
                    case 'I-COMBO-BOX':
                        return (control as ComboBox).selectedItem?.value;
                    case 'I-DATEPICKER':
                        let datepicker = control as Datepicker;
                        return datepicker.value?.format(datepicker.dateTimeFormat || datepicker.defaultDateTimeFormat);
                    case 'I-UPLOAD':
                        const uploader = control as Upload;
                        const file = uploader.fileList[0];
                        if (file) {
                            if (schema.format === 'data-url') {
                                const dataUrl = await uploader.toBase64(file);
                                return dataUrl;
                            } else if (schema.format === 'data-cid') {
                                let cid = file.cid?.cid;
                                if (!cid) return undefined;
                                try {
                                    try {
                                        let result = await fetch(`https://ipfs.scom.dev/ipfs/${cid}`);
                                    } catch {
                                        await uploader.upload();
                                    }
                                } catch { }
                                return cid;
                            } else return undefined;
                        } else
                            return undefined;
                    default:
                        return undefined;
                }
            } else
                return undefined;
        } else if (schema.type === 'integer') {
            if (control) {
                checkValidation();
                switch (control.tagName) {
                    case 'I-INPUT':
                        const val = (control as Input).value;
                        return this.isNumber(val) ? parseInt(val) : undefined;
                    case 'I-COMBO-BOX':
                        return parseFloat((control as ComboBox).selectedItem?.value || '');
                    default:
                        return undefined;
                }
            } else
                return undefined;
        } else if (schema.type === 'number') {
            if (control) {
                checkValidation();
                switch (control.tagName) {
                    case 'I-INPUT':
                        const val = (control as Input).value;
                        return this.isNumber(val) ? parseFloat(val) : undefined;
                    case 'I-COMBO-BOX':
                        return parseFloat(((control as ComboBox).value as any)?.value);
                    default:
                        return undefined;
                }
            } else
                return undefined;
        } else if (schema.type === 'boolean') {
            if (control) {
                checkValidation();
                switch (control.tagName) {
                    case 'I-CHECKBOX':
                        return (control as Checkbox).checked;
                    default:
                        return undefined;
                }
            }
        } else if (schema.type === 'object') {
            const properties = schema.properties;
            if (!properties) return undefined;
            const obj: any = {};
            for (const propertyName in properties) {
                const currentSchema = properties[propertyName];
                const currentScope = `${scope}/properties/${propertyName}`;
                obj[propertyName] = await this.getDataBySchema((currentSchema as IDataSchema), currentScope, isErrorShown, parentElm, listItem, parentScope);
            }
            return obj;
        } else if (schema.type === 'array') {
            if (parentElm) {
                _control = parentElm.querySelector('[role="list-item"]')?.parentElement;
            } else if (listItem) {
                _control = listItem.querySelector('[role="list-item"]')?.parentElement;
            }
            const grid = _control || this._formControls[scope]?.input;
            const listItems = grid?.querySelectorAll(':scope > [role="list-item"]');
            if (!(schema.items instanceof Array) && typeof schema.items === 'object') {
                const currentSchema = schema.items;
                if (listItems && listItems.length > 0) {
                    const list: any[] = [];
                    const newScope = currentSchema.type === 'string' ? scope + '/items' : '#'
                    for (let i = 0; i < listItems.length; i++) {
                        const listItem: Element = listItems[i];
                        const data = await this.getDataBySchema((currentSchema as IDataSchema), newScope, isErrorShown, parentElm, listItem, customParentScope);
                        list.push(data);
                    }
                    return list;
                }
            }
        }

    }

    private isNumber(value: string | number) {
        if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
            return false;
        }
        return true;
    }

    private checkArrayErrors() {
        if (!this.validationResult || this.validationResult.valid) return;
        const lbArrayError = this.querySelectorAll('[role="error"][array-scope]');
        lbArrayError.forEach(elm => {
            this.checkError(elm as Label);
        })
    }

    private checkError(lbError: Label) {
        if (!lbError) return;
        const listItem = lbError.closest('[role="list-item"]');
        let error;
        if (!listItem) {
            error = this.validationResult?.errors.find(f => f.scope === lbError.getAttribute('array-scope'));
        } else {
            const parentArr = listItem.parentElement;
            if (!parentArr) return;
            let arrIdx = -1;
            for (let i = 0; i < parentArr.childElementCount; i++) {
                if (parentArr.childNodes[i] === listItem) {
                    arrIdx = i;
                    break;
                }
            }
            if (arrIdx > -1) {
                const arrayScope = `${lbError.getAttribute('array-scope')}_${arrIdx + 1}`;
                error = this.validationResult?.errors.find(f => f.scope.endsWith(arrayScope));
            }
        }
        if (error) {
            lbError.setAttribute('is-visible', '')
            lbError.caption = `${lbError.getAttribute('array-caption') || 'This '} ${error.message}`;
            lbError.visible = true;
        } else {
            lbError.removeAttribute('is-visible');
            lbError.caption = '';
            lbError.visible = false;
        }
    }

    private findTabByElm(elm: Element) {
       const wrapper = elm.closest('.content-pane');
       if (wrapper && this.contains(wrapper)) {
            const tabsContent = wrapper.closest('.tabs-content');
            if (tabsContent) {
                let wrapperIdx: number = -1;
                for (let i = 0; i < tabsContent.childElementCount; i++) {
                    if (wrapper === tabsContent.childNodes[i]) {
                        wrapperIdx = i;
                        break;
                    }
                }
                if (wrapperIdx > -1) {
                    const tabs = tabsContent.closest('i-tabs') as Tabs;
                    if (tabs) {
                        tabs.activeTabIndex = wrapperIdx;
                        this.findTabByElm(tabs);
                    }
                }
            }
       }
    }

    renderForm() {
        this.clearInnerHTML();
        this._formRules = [];
        this._formControls = {};
        let controls;
        if (this._uiSchema) {
            this.renderFormByUISchema((this as any), this._uiSchema);
            this.setupRules();
        } else {
            this.renderFormByJSONSchema((this as any), this._jsonSchema);
        }
        // if (controls)
        //     this.appendChild(controls);
        const pnlButton = new HStack(undefined, {
            justifyContent: 'end',
            alignItems: 'center',
            gap: 5,
            padding: {
                top: 10,
                bottom: 10
            }
        });

        if (!this._formOptions.confirmButtonOptions)
            this._formOptions.confirmButtonOptions = DEFAULT_OPTIONS.confirmButtonOptions;
        if (!this._formOptions.clearButtonOptions)
            this._formOptions.clearButtonOptions = DEFAULT_OPTIONS.clearButtonOptions;
        if (!this._formOptions.clearButtonOptions?.hide) {
            const btnClear = new Button(pnlButton, {
                caption: this._formOptions.clearButtonOptions.caption || DEFAULT_OPTIONS.clearButtonOptions.caption,
                font: {
                    color: this._formOptions.clearButtonOptions.fontColor || DEFAULT_OPTIONS.clearButtonOptions.fontColor
                },
                background: {
                    color: this._formOptions.clearButtonOptions.backgroundColor || DEFAULT_OPTIONS.clearButtonOptions.backgroundColor
                },
                padding: { top: '0.65rem', bottom: '0.65rem', left: '1rem', right: '1rem' },
                border: { radius: '0px' }
            });
            btnClear.classList.add(Styles.buttonStyle);
            if (this._formOptions.clearButtonOptions?.onClick)
                btnClear.onClick = this._formOptions.clearButtonOptions.onClick;
            else
                btnClear.onClick = () => {
                    this.clearFormData();
                };
            pnlButton.appendChild(btnClear);
        }
        if (!this._formOptions.confirmButtonOptions?.hide) {
            const btnConfirm = new Button(pnlButton, {
                caption: this._formOptions.confirmButtonOptions.caption || DEFAULT_OPTIONS.confirmButtonOptions.caption,
                font: {
                    color: this._formOptions.confirmButtonOptions.fontColor || DEFAULT_OPTIONS.confirmButtonOptions.fontColor
                },
                background: {
                    color: this._formOptions.confirmButtonOptions.backgroundColor || DEFAULT_OPTIONS.confirmButtonOptions.backgroundColor
                },
                padding: { top: '0.65rem', bottom: '0.65rem', left: '1rem', right: '1rem' },
                border: { radius: '0px' }
            });
            btnConfirm.classList.add(Styles.buttonStyle);
            btnConfirm.onClick = async (target: Control, event: MouseEvent) => {
                this.validationData = await this.getFormData();
                this.validationResult = this.validate(this.validationData, this._jsonSchema, { changing: false });
                this.isSubmitted = true;
                await this.getFormData(true);
                if (this.validationResult && !this.validationResult.valid && this.uiSchema) {
                    const firstErrorElement = this.querySelector('i-label[role="error"][is-visible]');
                    if (firstErrorElement) {
                        this.findTabByElm(firstErrorElement);
                    }
                } else if (this.validationResult?.valid && this._formOptions.confirmButtonOptions?.onClick) {
                    this._formOptions.confirmButtonOptions.onClick(target, event);
                }
                this.validationData = null;
                this.validationResult = null;
            };
            pnlButton.appendChild(btnConfirm);
        }
        this.appendChild(pnlButton);
    }

    // Build form base on JSON Schema
    private renderFormByJSONSchema(parent: Container, schema: IDataSchema, scope: string = '#', hideLabel: boolean = false, subLevel: boolean = false, options: { idx?: number, schemaOptions?: IUISchemaOptions, elementLabelProp?: string, labelProp?: Label, parentProp?: string } = {}): Control | undefined {
        if (!parent || !schema) return undefined;
        const { idx, schemaOptions, elementLabelProp, parentProp } = options;
        let labelProp = options.labelProp;
        const currentField = scope.substr(scope.lastIndexOf('/') + 1);
        if (elementLabelProp && elementLabelProp != currentField) labelProp = undefined;
        const labelName = schema.title || (scope != '#/' ? this.convertFieldNameToLabel(currentField) : '');
        const columnWidth = this._formOptions.columnWidth ? this._formOptions.columnWidth : '100px';
        const idxScope = idx !== undefined ? `${scope}_${idx}` : scope;
        const defaultValue = schema.default;

        let isRequired = false;
        let arrRequired: string[] = [];

        if (schema.required instanceof Array)
            arrRequired = schema.required;
        else
            isRequired = !!schema.required;
        const controlOptions: IControlOptions = {
            caption: labelName,
            description: schema.description,
            tooltip: schema.tooltip,
            placeholder: schema.placeholder,
            columnWidth: columnWidth,
            readOnly: schema.readOnly,
            required: isRequired,
            hideLabel: hideLabel
        }

        // Check has custom control
        if (this._formOptions.customControls) {
            let customControlScope = parentProp ? `${parentProp}${scope.replace('#', '')}` : scope;
            if (customControlScope.includes('/items/properties')) {
                customControlScope = this.replacePhrase(customControlScope);
            }
            if (this._formOptions.customControls[customControlScope]) {
                const customRenderer = this._formOptions.customControls[customControlScope];
                const wrapper = new Panel(parent, {
                    width: controlOptions.columnWidth
                });
                wrapper.classList.add(Styles.formGroupStyle);
                const control = customRenderer.render(parent);
                control.setAttribute('custom-control', customControlScope);
                control.setAttribute('field', scope.substr(scope.lastIndexOf('/') + 1));
                control.setAttribute('role', 'field');
                if (control.tagName === 'I-SCOM-TOKEN-INPUT') {
                    control.classList.add(Styles.tokenInputStyle);
                }
                (control as any).onChanged = () => {
                    this.validateOnValueChanged(control, parent, customControlScope, labelName);
                    if (!this.isSubmitted && this._formOptions.onChange) {
                        this._formOptions.onChange(control, customRenderer.getData(control as Control));
                    }
                }
                let label: Label | undefined;
                if (!hideLabel) {
                    label = this.renderLabel({parent: wrapper, options: controlOptions, type: 'caption'});
                }
                const vstack = new VStack(wrapper, { gap: 4 });
                vstack.appendChild(control);
                const error = this.renderLabel({ parent: vstack, options: controlOptions, type: 'error'});
                this._formControls[customControlScope] = {
                    input: control,
                    getCustomData: () => customRenderer.getData(control),
                    label,
                    error
                }
                return;
            }
        }
        // Combo Box
        if ((schema.enum && schema.enum.length > 0) || (schema.oneOf && schema.oneOf.length > 0)) {
            let items: any[] = [];
            if (schema.oneOf && schema.oneOf.length > 0) {
                items = schema.oneOf.map(item => {
                    let data: any = {
                        label: item.title || '',
                        value: item.const
                    };
                    if (item.description)
                        data.description = item.description;
                    if (item.icon)
                        data.icon = item.icon;
                    return data;
                });

            } else if (schema.enum && schema.enum.length > 0) {
                items = schema.enum.map(item => ({
                    label: item,
                    value: item
                }));
            }
            if (schemaOptions?.format === "radio") {
                items = items.map(v => ({
                    caption: v.label,
                    value: v.value
                }));
                return this.renderRadioGroup({parent, scope, items, options: controlOptions, labelProp, defaultValue});
            }
            return this.renderComboBox({parent, scope, items, options: controlOptions, labelProp, defaultValue});
        } else if (schema.type === 'string') {
            // Date Picker
            if (['date', 'time', 'date-time'].includes(schema.format || '')) {

                let datePickerType = schema.format;
                if (schema.format === 'date-time')
                    datePickerType = 'dateTime';
                return this.renderDatePicker({ parent, scope, type: datePickerType || '', options: controlOptions, defaultValue });
            }
            // Uploader
            else if (schema.format === 'data-url') {
                return this.renderUploader({parent, scope, options: controlOptions, defaultValue});
            }
            // Uploader (IPFS)
            else if (schema.format === 'data-cid') {
                return this.renderUploader({parent, scope, options: controlOptions, defaultValue});
            }
            // Color Picker
            else if (schema.format === 'color') {
                return this.renderColorPicker({parent, scope, options: controlOptions, labelProp, defaultValue});
            }
            // Textarea
            else if (schemaOptions?.multi === true) {
                return this.renderTextArea({parent, scope, options: controlOptions, labelProp, defaultValue});
            }
            // Input
            else {
                return this.renderInput({parent, scope, options: controlOptions, labelProp, defaultValue});
            }
        }
        // Number Input
        else if (['integer', 'number'].includes(schema.type?.toString() || '')) {
            return this.renderNumberInput({parent, scope, options: controlOptions, labelProp, defaultValue});
        }
        // Checkbox
        else if (schema.type === 'boolean') {
            return this.renderCheckBox({parent, scope, options: controlOptions, labelProp, defaultValue});
        }
        // Group Box / Sublevel
        else if (schema.type === 'object') {
            const properties = schema.properties;
            if (!properties) return undefined;
            let wrapperObj;
            let wrapper;
            let container;
            if (scope !== '#' && !subLevel) {
                wrapperObj = this.renderGroup({parent, options: controlOptions});
                wrapper = wrapperObj.wrapper;
                container = wrapperObj.body;
            } else {
                wrapper = new Panel(parent);
                container = wrapper;
            }
            let form = new GridLayout(container, {
                gap: {column: 10, row: 10},
                columnsPerRow: this._formOptions.columnsPerRow || DEFAULT_OPTIONS.columnsPerRow
            });
            form.setAttribute('role', 'object');
            form.setAttribute('object-field', currentField);
            for (const propertyName in properties) {
                let currentSchema: any = properties[propertyName];
                if (!currentSchema?.required && arrRequired.includes(propertyName)) {
                    currentSchema.required = true;
                }
                this.renderFormByJSONSchema(form, currentSchema, `${idxScope}/properties/${propertyName}`, false, false, { idx, elementLabelProp, labelProp });
            }
            // if (scope !== '#' && wrapperObj && wrapperObj.body)
            //     wrapperObj.body.append(form);
            // else if (wrapper)
            //     wrapper.append(form);
            this._formControls[scope] = {
                wrapper
            };
            return wrapper;
        }
        // Card List
        else if (schema.type === 'array') {
            if (!schema.items) return undefined;
            const isVertical = (schemaOptions?.detail as IUISchema)?.type === 'VerticalLayout';
            const { body, btnAdd, columnHeader } = this.renderList({parent, scope, options: controlOptions, isVertical, defaultValue});
            // Render list header
            if (typeof schema.items === 'object' && !(schema.items instanceof Array)) {
                if (schema.items.type === 'object') {
                    const properties = schema.items.properties as IDataSchema;
                    let hasSublevel = Object.values(properties).find((value) => value.type === 'object' || value.type === 'array');
                    if (!hasSublevel && !isVertical) {
                        // Render header
                        const templateColumns = [];
                        for (let i = 0; i < Object.values(properties).length; i++)
                            templateColumns.push('1fr');
                        templateColumns.push('50px');
                        const header = new GridLayout(columnHeader, {
                            templateColumns,
                            gap: {
                                column: 5,
                                row: 5
                            }
                        });
                        header.classList.add(Styles.listColumnHeaderStyle);
                        for (const fieldName in properties) {
                            const property = properties[fieldName];
                            const caption = property.title || this.convertFieldNameToLabel(fieldName);
                            this.renderLabel({parent: header, options: { caption, required: !!property.required }});
                        }
                    }
                } else {
                    body.setAttribute('non-object', 'true');
                }
            }
            if (btnAdd) {
                btnAdd.onClick = () => {
                    const lbError = btnAdd.parentElement?.querySelector('[role="error"][array-scope]') as Label;
                    if (lbError && lbError.hasAttribute('is-visible')) {
                        lbError.removeAttribute('is-visible')
                        lbError.caption = '';
                        lbError.visible = false;
                    }
                    if (schemaOptions && schemaOptions.detail) {
                        this.renderCard({parent: body, scope, schema: (schema.items as IDataSchema), options: controlOptions, uiSchema: (schemaOptions.detail as IUISchema), elementLabelProp: schemaOptions.elementLabelProp});
                    } else if (schema.items instanceof Array) {
                        // Todo
                    } else if (typeof schema.items === 'object') {
                        if (schema.items.type === 'object') {
                            // Grid
                            const properties = schema.items.properties as IDataSchema;
                            if (!properties || (properties && Object.values(properties).length > 0)) {
                                this.renderCard({parent: body, scope, schema: schema.items, options: controlOptions});
                            }
                        } else {
                            this.renderCard({parent: body, scope, schema: schema.items, options: controlOptions});
                        }
                    }
                };
            }
        } else if (schema.type === 'null') {
            return undefined;
        } else if (schema.type === 'any') {
            // To do
            return undefined;
        } else return undefined;
    }

    private replacePhrase = (str: string) => {
        return str.replace(/([^\/]+)\/items\/properties/g, function (match, p1) {
            if (p1 === 'properties') {
                return match;
            }
            return `${p1}/properties`;
        });
    }

    // Build form base on UI Schema
    private renderFormByUISchema(parent: Container, uiSchema: IUISchema, carryData?: any, jsonSchema?: IDataSchema, elementLabelProp?: string, labelProp?: Label, parentProp?: string) {
        if (!parent || !uiSchema) return null;
        const { elements, type, scope, label, options, rule } = uiSchema;
        if (type === 'VerticalLayout') {
            const elm = new VStack(parent, {
                justifyContent: 'center',
                alignItems: 'center'
            });
            if (elements)
                elements.map(v => {
                    this.renderFormByUISchema(elm, v, carryData, jsonSchema, elementLabelProp, labelProp, parentProp);
                });

            if (rule) this._formRules.push({ elm, rule });
            return elm;
        } else if (type === 'HorizontalLayout') {
            const elm = new GridLayout(parent, {
                width: '100%',
                gap: { column: 16 },
                columnsPerRow: elements?.length || 1
            });
            if (elements)
                elements.map(v => {
                    this.renderFormByUISchema(elm, v, carryData, jsonSchema, elementLabelProp, labelProp, parentProp);
                });
            if (rule) this._formRules.push({ elm, rule });
            return elm;
        } else if (type === 'Group') {

            const groupObj = this.renderGroup({parent, options: {
                required: false,
                caption: (typeof label === 'string' ? label : ''),
                columnWidth: '100%',
                description: '',
                readOnly: false
            }
            });
            if (elements) {
                elements.map(v => {
                    if (groupObj.body)
                        this.renderFormByUISchema(groupObj.body, v, carryData, jsonSchema, elementLabelProp, labelProp, parentProp);
                });
            }
            if (rule) this._formRules.push({ elm: groupObj.wrapper, rule });
            return groupObj.wrapper;
            // return elm;
        } else if (type === 'Categorization') {
            let elm = new Tabs(parent);
            elm.classList.add(Styles.tabsStyle);
            // elm.classList.add(jsonUITabStyle);
            // let formTabs = document.getElementById('formTabs') as Tabs;
            // if (formTabs) formTabs.visible = true;
            if (elements) {
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    this.renderFormByUISchema(elm, element, { tabs: elm, index: i }, jsonSchema, elementLabelProp, labelProp, parentProp)
                }
                elm.activeTabIndex = 0;
            }
            // elm = formTabs;
            if (rule) this._formRules.push({ elm, rule });
            return elm;
        } else if (type === 'Category') {
            let caption;
            if (label !== false) {
                caption = label;
            }
            if (carryData && carryData.tabs && carryData.index != undefined) {
                const children = new Panel(undefined, {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                });
                if (elements) {
                    for (const element of elements) {
                        let ui = this.renderFormByUISchema(children, element, carryData, jsonSchema, elementLabelProp, labelProp, parentProp);
                        if (ui) children.append(ui);
                    }
                }

                let tabCaption = (typeof caption == 'boolean') ? '' : caption;
                const tab = (carryData.tabs as Tabs).add({ caption: tabCaption, children: children });
                if (rule) this._formRules.push({ elm: tab, rule });
            }
        } else if (type === 'Control' && scope) {
            const [key, dataSchema] = this.getDataSchemaByScope(scope, jsonSchema);
            const stub = new Panel(parent, {
                padding: {
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 5
                }
            });

            stub.classList.add('form-group');
            let caption, labelElm, descriptionElm;
            let formControlElm = new Panel();
            formControlElm.classList.add('form-control');
            let hideLabel = false;
            if (label !== false) {
                caption = label as string;
                if (!caption)
                    caption = this.convertFieldNameToLabel(key);
            }
            this.renderFormByJSONSchema(formControlElm, dataSchema, scope, false, false, { schemaOptions: options, elementLabelProp, labelProp, parentProp });

            if (formControlElm)
                stub.append(formControlElm);
            if (descriptionElm)
                stub.append(descriptionElm);
            if (rule) this._formRules.push({ elm: stub, rule, control: this._formControls[scope] });
            return stub;
        } else
            return null;
    }

    // Setup Rules
    private setupRules() {
        if (!this._formRules || (this._formRules && this._formRules.length === 0)) return;
        for (const ruleObj of this._formRules) {
            const { elm, rule, control: inputControl } = ruleObj;
            if (!elm) continue;
            if (!rule) continue;
            if (rule && (!rule.condition || !rule.effect)) continue;
            if (rule && rule.condition && (!rule.condition.scope || !rule.condition.schema)) continue;
            if (rule.condition?.scope) {
                const control = this._formControls[rule.condition.scope].input;
                if (!control) continue;
                this.setupControlRule(elm, rule.effect, control, rule.condition.schema, inputControl, this._formControls[rule.condition.scope].getCustomData);
            }
        }
        this.validateAllRule();
    }

    private setupControlRule(elm: Control, effect: IUISchemaRulesEffect | undefined, control: Control, schema: IDataSchema, inputControl?: IControl, getCustomData?: () => any) {
        if (!elm || !effect || !control || !schema) return;
        if (control.tagName === 'I-INPUT') {
            let cachedOnChanged: any;
            if ((control as Input).onChanged)
                cachedOnChanged = (control as Input).onChanged;
            (control as Input).onChanged = () => {
                if (cachedOnChanged)
                    cachedOnChanged();
                const value = (control as Input).value;
                this.validateRule(elm, effect, value, schema, inputControl);
            };
        } else if (control.tagName === 'I-COMBO-BOX') {
            let cachedOnChanged: any;
            if ((control as ComboBox).onChanged)
                cachedOnChanged = (control as ComboBox).onChanged;
            (control as ComboBox).onChanged = () => {
                if (cachedOnChanged)
                    cachedOnChanged();
                const value = ((control as ComboBox).selectedItem)?.value;
                this.validateRule(elm, effect, value, schema, inputControl);
            };
        } else if (control.tagName === 'I-DATEPICKER') {
            let cachedOnChanged: any;
            if ((control as Datepicker).onChanged)
                cachedOnChanged = (control as Datepicker).onChanged;
            (control as Datepicker).onChanged = () => {
                if (cachedOnChanged)
                    cachedOnChanged();
                const value = (control as Datepicker).value;
                this.validateRule(elm, effect, value, schema, inputControl);
            };
        } else if (control.tagName === 'I-CHECKBOX') {
            let cachedOnChanged: any;
            if ((control as Checkbox).onChanged)
                cachedOnChanged = (control as Checkbox).onChanged;
            (control as Checkbox).onChanged = () => {
                if (cachedOnChanged)
                    cachedOnChanged();
                const value = (control as Checkbox).checked;
                this.validateRule(elm, effect, value, schema, inputControl);
            };
        } else if (control.tagName === 'I-RADIO-GROUP') {
            let cachedOnChanged: any;
            if ((control as RadioGroup).onChanged)
                cachedOnChanged = (control as RadioGroup).onChanged;
            (control as RadioGroup).onChanged = () => {
                if (cachedOnChanged)
                    cachedOnChanged();
                const value = (control as RadioGroup).selectedValue;
                this.validateRule(elm, effect, value, schema, inputControl);
            };
        } else if (getCustomData) {
            let cachedOnChanged: any;
            if ((control as Input).onChanged)
                cachedOnChanged = (control as Input).onChanged;
            (control as Input).onChanged = () => {
                if (cachedOnChanged)
                    cachedOnChanged();
                const value = getCustomData();
                this.validateRule(elm, effect, value, schema, inputControl);
            };
        }
    }

    private validateRule(elm: Control, effect: IUISchemaRulesEffect, value: any, schema: IDataSchema, inputControl?: IControl) {
        let isValid = false;
        if (schema.const) {
            if (value === schema.const)
                isValid = true;
        } else if (schema.enum) {
            const stringEnum = schema.enum.map((v: any) => v.toString());
            if (stringEnum.includes(value))
                isValid = true;
        } else if (schema.not) {
            if (value !== schema.not.const.toString())
                isValid = true;
            else if (schema.not.enum) {
                const stringEnum = schema.not.enum.map((v: any) => v.toString());
                if (stringEnum.includes(value))
                    isValid = true;
            }
        }
        if (effect === 'HIDE')
            elm.visible = !isValid;
        else if (effect === 'SHOW')
            elm.visible = isValid;
        else if (effect === 'ENABLE') {
            if (inputControl && inputControl.input) {
                if(inputControl.input.tagName === 'I-COMBO-BOX') {
                    (inputControl.input as ComboBox).readOnly = !isValid
                }
                else
                    (inputControl.input as Input).enabled = isValid
            }
            else elm.enabled = isValid;
        }
        else if (effect === 'DISABLE') {
            if (inputControl && inputControl.input) {
                if(inputControl.input.tagName === 'I-COMBO-BOX') {
                    (inputControl.input as ComboBox).readOnly = isValid
                }
                else
                    (inputControl.input as Input).enabled = !isValid
            }
            else elm.enabled = !isValid;
        }
    }

    private validateAllRule() {
        if (!this._formRules || (this._formRules && this._formRules.length === 0)) return;
        for (const ruleObj of this._formRules) {
            const { elm, rule, control: inputControl } = ruleObj;
            if (!elm) continue;
            if (!rule) continue;
            if (rule && (!rule.condition || !rule.effect)) continue;
            if (rule && rule.condition && (!rule.condition.scope || !rule.condition.schema)) continue;
            if (rule.condition?.scope) {
                const formControl = this._formControls[rule.condition.scope];
                const control = formControl.input;
                if (!control) continue;
                let value;
                if (control.tagName === 'I-INPUT') {
                    value = (control as Input).value;
                } else if (control.tagName === 'I-COMBO-BOX') {
                    value = ((control as ComboBox).selectedItem)?.value
                } else if (control.tagName === 'I-DATEPICKER') {
                    value = (control as Datepicker).value;
                } else if (control.tagName === 'I-CHECKBOX') {
                    value = (control as Checkbox).checked;
                } else if (control.tagName === 'I-RADIO-GROUP') {
                    value = (control as RadioGroup).selectedValue;
                } else if (formControl.getCustomData) {
                    value = formControl.getCustomData();
                }
                this.validateRule(elm, (rule.effect as IUISchemaRulesEffect), value, rule.condition.schema, inputControl);
            }
        }
    }

    private getDataSchemaByScope(scope: string, jsonSchema?: IDataSchema): [key: string, dataSchema: IDataSchema] {
        const segments = scope.split('/');
        let obj: IDataSchema = {};
        let preObj: IDataSchema = {};
        let parentObj: IDataSchema = {};
        for (const segment of segments) {
            parentObj = preObj;
            preObj = obj;
            if (segment === '#')
                obj = jsonSchema || this._jsonSchema;
            else
                obj = (obj as any)[segment];

        }
        const key = segments[segments.length - 1];
        if (obj == undefined) console.log('No corresponding scope:', scope);
        else if (!obj.required && typeof parentObj.required === 'object' && parentObj.required.includes(key)) {
            obj = {
                ...obj,
                required: true
            } as any;
        }
        return [segments[segments.length - 1], obj];
    }

    // Render Controls
    private renderGroup(groupOption: {parent: Container, options: IControlOptions}) {
        const {parent, options} = groupOption;
        const wrapper = new Panel(parent);
        wrapper.classList.add(Styles.groupStyle);
        const header = new Panel(wrapper);
        header.classList.add(Styles.groupHeaderStyle);
        const hstack = new HStack(header, { gap: 2 });
        new Label(hstack, { caption: options.caption });
        if (options.required) {
            new Label(hstack, {
                caption: '*',
                font: { color: '#ff0000' }
            });
        }
        const icon = new Icon(header, {
            name: 'chevron-up'
        });
        const body = new Panel(wrapper);
        body.classList.add(Styles.groupBodyStyle);
        // Collapse
        icon.onClick = header.onClick = () => {
            body.visible = !body.visible;
            icon.name = `chevron-${body.visible ? 'up' : 'down'}`;
        };
        icon.classList.add(Styles.collapseBtnStyle);
        return { wrapper, body };
    }

    // private renderTabs(parent: Container, options: IControlOptions) {
    //     const tabs = new Tabs(parent);
    //     return tabs;
    // }
    //
    // private renderTab(tabs: Tabs, caption?: string) {
    //     if (!tabs)
    //         return null;
    //     return tabs.add({caption: caption || `Sheet ${tabs.items.length + 1}`});
    // }

    private renderLabel(labelOption: {parent: Container, options: IControlOptions, type?: 'caption' | 'description' | 'error'}) {
        const {parent, options} = labelOption;
        let {type} = labelOption;
        if(!type) type = 'caption';
        let label;
        if (type === 'caption') {
            const hstack = new HStack(parent, {
                alignItems: 'center',
                gap: 2,
                width: '100%'
            });
            label = new Label(hstack, {
                caption: options?.caption
            });
            if (options.required) {
                new Label(hstack, {
                    caption: '*',
                    font: { color: '#ff0000' }
                });
            }
            if (options.tooltip) {
                new Icon(hstack, {
                    width: '1rem',
                    height: '1rem',
                    name: 'info-circle',
                    margin: { left: 2 },
                    tooltip: { content: options.tooltip, placement: 'bottom' }
                });
            }
        } else if (type === 'description') {
            label = new Label(parent, {
                caption: options.description,
                margin: { top: 2 },
                visible: !!options.description
            });
        } else {
            label = new Label(parent, {
                visible: false,
                font: { color: '#ff0000' },
                margin: { top: 2 }
            });
            label.setAttribute('role', 'error');
        }
        return label;
    }
    private renderInput(inputOption: { parent: Container, scope: string, options: IControlOptions, labelProp?: Label, defaultValue: any }) {
        const {parent, scope, options, labelProp, defaultValue} = inputOption;
        const field = scope.substr(scope.lastIndexOf('/') + 1);
        const wrapper = new Panel(parent, {
            width: options.columnWidth
        });
        wrapper.classList.add(Styles.formGroupStyle);
        let label;
        if (!options.hideLabel) {
            label = this.renderLabel({parent: wrapper, options, type: 'caption'});
        }
        const vstack = new VStack(wrapper, { gap: 4 });
        const inputOpt: IInputOptions = {
            inputType: 'text',
            height: '42px',
            width: '100%',
        }
        if (defaultValue) {
            inputOpt.value = defaultValue.toString();
        }
        const input = new Input(vstack, inputOpt);
        input.onChanged = () => {
            if (labelProp)
                labelProp.caption = input.value;
            this.validateOnValueChanged(input, parent, scope, options?.caption);
            if (!this.isSubmitted && this._formOptions.onChange) {
                this._formOptions.onChange(input, (input as Input).value);
            }
        }
        input.setAttribute('role', 'field');
        input.setAttribute('scope', scope);
        input.setAttribute('field', field);
        input.setAttribute('dataType', 'string');
        if (options.readOnly !== undefined) {
            input.setAttribute('readOnly', options.readOnly.toString());
        }
        if (options.placeholder !== undefined) {
            input.setAttribute('placeholder', options.placeholder);
        }
        input.classList.add(Styles.inputStyle);
        const description = this.renderLabel({ parent:vstack, options, type: 'description'});
        const error = this.renderLabel({parent: vstack, options, type: 'error'});
        this._formControls[scope] = {
            wrapper,
            label,
            input,
            description,
            error
        };
        return wrapper;
    }

    private renderNumberInput(numberInputOption: {parent: Container, scope: string, options: IControlOptions, labelProp?: Label, defaultValue: any}) {
        const {parent, scope, options, labelProp, defaultValue} = numberInputOption;
        const field = scope.substr(scope.lastIndexOf('/') + 1);
        const wrapper = new Panel(parent, { width: options.columnWidth });
        wrapper.classList.add(Styles.formGroupStyle);
        let label;
        if (!options.hideLabel) {
            label = this.renderLabel({parent: wrapper, options, type: 'caption'});
        }
        const vstack = new VStack(wrapper, { gap: 4 });
        const inputOpt: IInputOptions = {
            inputType: 'number',
            height: '42px',
            width: '100%',
        }
        if (defaultValue) {
            const numDefaultValue = parseFloat(defaultValue);
            if(!isNaN(numDefaultValue))
                inputOpt.value = numDefaultValue;
        }
        const input = new Input(vstack, inputOpt);
        input.onChanged = () => {
            if (labelProp)
                labelProp.caption = input.value;
            this.validateOnValueChanged(input, parent, scope, options?.caption);
            if (!this.isSubmitted && this._formOptions.onChange) {
                this._formOptions.onChange(input, (input as Input).value);
            }
        }
        input.setAttribute('role', 'field');
        input.setAttribute('scope', scope);
        input.setAttribute('field', field);
        input.setAttribute('dataType', 'number');
        if (options.readOnly !== undefined) {
            input.setAttribute('readOnly', options.readOnly.toString());
        }
        if (options.placeholder !== undefined) {
            input.setAttribute('placeholder', options.placeholder);
        }
        input.classList.add(Styles.inputStyle);
        const description = this.renderLabel({parent: vstack, options, type: 'description'});
        const error = this.renderLabel({parent: vstack, options, type: 'error'});
        this._formControls[scope] = {
            wrapper,
            label,
            input,
            description,
            error
        };
        return wrapper;
    }

    private renderTextArea(textAreaOption: {parent: Container, scope: string, options: IControlOptions, labelProp?: Label, defaultValue: any}) {
        const {parent, scope, options, labelProp, defaultValue} = textAreaOption;
        const field = scope.substr(scope.lastIndexOf('/') + 1);
        const wrapper = new Panel(parent);
        wrapper.classList.add(Styles.formGroupStyle);
        let label;
        if (!options.hideLabel) {
            label = this.renderLabel({parent: wrapper, options, type: 'caption'});
        }
        const vstack = new VStack(wrapper);
        const inputOpt: IInputOptions = {
            inputType: 'textarea',
            height: 'unset',
            rows: 5
        };
        if (defaultValue) {
            inputOpt.value = defaultValue.toString();
        }
        const input = new Input(vstack, inputOpt);
        input.onChanged = () => {
            if (labelProp)
                labelProp.caption = input.value;
            this.validateOnValueChanged(input, parent, scope, options?.caption);
            if (!this.isSubmitted && this._formOptions.onChange) {
                this._formOptions.onChange(input, (input as Input).value);
            }
        }
        input.setAttribute('role', 'field');
        input.setAttribute('scope', scope);
        input.setAttribute('field', field);
        input.setAttribute('dataType', 'string');
        if (options.readOnly !== undefined) {
            input.setAttribute('readOnly', options.readOnly.toString());
        }
        if (options.placeholder !== undefined) {
            input.setAttribute('placeholder', options.placeholder);
        }
        input.classList.add(Styles.inputStyle);
        const description = this.renderLabel({parent: vstack, options, type: 'description'});
        const error = this.renderLabel({parent: vstack, options, type: 'error'});
        this._formControls[scope] = {
            wrapper,
            label,
            input,
            description,
            error
        };
        return wrapper;
    }

    private renderColorPicker(colorPickerOption: {parent: Container, scope: string, options: IControlOptions, labelProp?: Label, defaultValue: any}) {
        const {parent, scope, options, labelProp, defaultValue} = colorPickerOption;
        const field = scope.substr(scope.lastIndexOf('/') + 1);
        const wrapper = new Panel(parent);
        wrapper.classList.add(Styles.formGroupStyle);
        let label;
        if (!options.hideLabel) {
            label = this.renderLabel({parent: wrapper, options, type: 'caption'});
        }
        const vstack = new VStack(wrapper, { gap: 4 });
        const inputOpt: IInputOptions = {
            inputType: 'color',
            height: '42px',
            width: '100%'
        }
        if (defaultValue) {
            inputOpt.value = defaultValue.toString();
        }
        const input = new Input(vstack, inputOpt);
        input.onClosed = () => {
            if (labelProp)
                labelProp.caption = input.value;
            this.validateOnValueChanged(input, parent, scope, options?.caption);
            if (!this.isSubmitted && this._formOptions.onChange) {
                this._formOptions.onChange(input, (input as Input).value);
            }
        }
        input.setAttribute('role', 'field');
        input.setAttribute('scope', scope);
        input.setAttribute('field', field);
        input.setAttribute('dataType', 'string');
        if (options.readOnly !== undefined) {
            input.setAttribute('readOnly', options.readOnly.toString());
        }
        input.classList.add(Styles.inputStyle);
        const description = this.renderLabel({ parent: vstack, options, type: 'description'});
        const error = this.renderLabel({ parent: vstack, options, type: 'error'});
        this._formControls[scope] = {
            wrapper,
            label,
            input,
            description,
            error
        };
        return wrapper;
    }

    private renderUploader(uploaderOption: {parent: Container, scope: string, options: IControlOptions, defaultValue: any}) {
        const {parent, scope, options, defaultValue} = uploaderOption;
        const field = scope.substr(scope.lastIndexOf('/') + 1);
        const wrapper = new Panel(parent);
        wrapper.classList.add(Styles.formGroupStyle);
        let label;
        if (!options.hideLabel) {
            label = this.renderLabel({ parent: wrapper, options, type:'caption'});
        }
        const vstack = new VStack(wrapper, { gap: 4 });
        const uploader = new Upload(vstack, {
            draggable: true
        });
        uploader.classList.add(Styles.uploadStyle);
        uploader.setAttribute('role', 'field');
        uploader.setAttribute('scope', scope);
        uploader.setAttribute('field', field);
        uploader.setAttribute('dataType', 'string');
        uploader.onChanged = () => {
            this.validateOnValueChanged(uploader, parent, scope, options?.caption);
            if (!this.isSubmitted && this._formOptions.onChange) {
                this._formOptions.onChange(uploader);
            }
        }
        const description = this.renderLabel({ parent: vstack, options, type: 'description'});
        const error = this.renderLabel({ parent: vstack, options, type: 'error'});
        this._formControls[scope] = {
            wrapper,
            label,
            input: uploader,
            description,
            error
        };
        // if(defaultValue) {
        //
        // }
        return wrapper;
    }

    private renderDatePicker(datePickerOption: { parent: Container, scope: string, type: string, options: IControlOptions, defaultValue: any } ) {
        const {parent, scope, type, options, defaultValue } = datePickerOption;
        const field = scope.substr(scope.lastIndexOf('/') + 1);
        if (type != 'date' && type != 'time' && type != 'dateTime') return this.renderInput({parent, scope, options, defaultValue});
        const wrapper = new Panel(parent);
        wrapper.classList.add(Styles.formGroupStyle);
        let label;
        if (!options.hideLabel) {
            label = this.renderLabel({ parent: wrapper, options, type: 'caption'});
        }
        const vstack = new VStack(wrapper, { gap: 4 });
        let dateTimeFormat = '';
        if (type === 'date')
            dateTimeFormat = this._formOptions.dateTimeFormat?.date || DEFAULT_OPTIONS.dateTimeFormat.date;
        else if (type === 'dateTime')
            dateTimeFormat = this._formOptions.dateTimeFormat?.dateTime || DEFAULT_OPTIONS.dateTimeFormat.dateTime;
        else if(type === 'time')
            dateTimeFormat = this._formOptions.dateTimeFormat?.time || DEFAULT_OPTIONS.dateTimeFormat.time;

        let defaultDate;
        if(defaultValue) {
            defaultDate = moment(defaultValue, dateTimeFormat);
        }
        const input = new Datepicker(vstack, {
            type,
            height: '42px',
            dateTimeFormat,
            value: defaultDate || null
        });
        input.onChanged = () => {
            this.validateOnValueChanged(input, parent, scope, options?.caption);
            if (!this.isSubmitted && this._formOptions.onChange) {
                this._formOptions.onChange(input, (input as Datepicker).value);
            }
        }
        input.setAttribute('role', 'field');
        input.setAttribute('scope', scope);
        input.setAttribute('field', field);
        input.setAttribute('dataType', 'string');
        input.classList.add(Styles.datePickerStyle);
        const description = this.renderLabel({parent: vstack, options, type: 'description'});
        const error = this.renderLabel({parent: vstack, options, type: 'error'});
        this._formControls[scope] = {
            wrapper,
            label,
            input,
            description,
            error
        };
        // if(defaultValue) {
        //     input.setAttribute('value', defaultValue);
        // }
        return wrapper;
    }

    private renderComboBox(comboBoxOption: {parent: Container, scope: string, items: {
        label: string,
        value: string
    }[], options: IControlOptions, labelProp?: Label, defaultValue: any}) {
        const {parent, scope, items, options, labelProp, defaultValue } = comboBoxOption;
        const field = scope.substr(scope.lastIndexOf('/') + 1);
        const wrapper = new Panel(parent);
        wrapper.classList.add(Styles.formGroupStyle);
        let label;
        if (!options.hideLabel) {
            label = this.renderLabel({parent: wrapper, options, type: 'caption'});
        }
        const vstack = new VStack(wrapper, { gap: 4 });
        let matchItem: any;
        if(defaultValue) {
            matchItem = items.find(item => item.value.toString() === defaultValue.toString());
        }
        const input = new ComboBox(vstack, {
            items,
            height: '42px',
            icon: {
                name: 'caret-down'
            },
            selectedItem: matchItem || null
        });
        input.onChanged = () => {
            if (labelProp) {
                // labelProp.caption = input.value;
                // console.log('input.value', input.value)
            }
            this.validateOnValueChanged(input, parent, scope, options?.caption);
            if (!this.isSubmitted && this._formOptions.onChange) {
                this._formOptions.onChange(input, ((input as ComboBox).selectedItem)?.value);
            }
        }
        input.setAttribute('role', 'field');
        input.setAttribute('scope', scope);
        input.setAttribute('field', field);
        input.setAttribute('dataType', 'string');
        if (options.readOnly !== undefined) {
            input.setAttribute('readOnly', options.readOnly.toString());
        }
        input.classList.add(Styles.comboBoxStyle);
        const description = this.renderLabel({ parent: vstack, options, type: 'description'});
        const error = this.renderLabel({parent: vstack, options, type: 'error'});
        this._formControls[scope] = {
            wrapper,
            label,
            input,
            description,
            error
        };

        return wrapper;
    }

    private renderRadioGroup(radioGroupOption: { parent: Container, scope: string, items: {
        caption: string,
        value: string
    }[], options: IControlOptions, labelProp?: Label, defaultValue: any} ) {
        const {parent, scope, items, options, labelProp, defaultValue} = radioGroupOption;
        const field = scope.substr(scope.lastIndexOf('/') + 1);
        const wrapper = new Panel(parent);
        wrapper.classList.add(Styles.formGroupStyle);
        let label;
        if (!options.hideLabel) {
            label = this.renderLabel({ parent: wrapper, options, type: 'caption'});
        }
        const vstack = new VStack(wrapper, { gap: 4 });
        const input = new RadioGroup(vstack, {
            radioItems: items
        });
        input.onChanged = () => {
            if (labelProp) {
                // labelProp.caption = input.value;
                // console.log('input.value', input.selectedValue)
            }
            this.validateOnValueChanged(input, parent, scope, options?.caption);
            if (!this.isSubmitted && this._formOptions.onChange) {
                this._formOptions.onChange(input, (input as RadioGroup).selectedValue);
            }
        }
        input.setAttribute('role', 'field');
        input.setAttribute('scope', scope);
        input.setAttribute('field', field);
        input.setAttribute('dataType', 'string');
        // input.classList.add(Styles.radioGroupStyle)
        const description = this.renderLabel({ parent: vstack, options, type: 'description'});
        const error = this.renderLabel({parent: vstack, options, type: 'error'});
        this._formControls[scope] = {
            wrapper,
            label,
            input,
            description,
            error
        };
        if(defaultValue) {
            // input.selectedValue = defaultValue.toString();
            input.setAttribute('selectedValue', defaultValue.toString())
        }
        return wrapper;
    }

    private renderCheckBox(checkBoxOption: { parent: Container, scope: string, options: IControlOptions, labelProp?: Label, defaultValue: any}) {
        const {parent, scope, options, labelProp, defaultValue } = checkBoxOption;
        const field = scope.substr(scope.lastIndexOf('/') + 1);
        const wrapper = new Panel(parent);
        wrapper.classList.add(Styles.formGroupStyle);
        const vstack = new VStack(wrapper, { gap: 4, width: '100%' });
        const input = new Checkbox(vstack, {
            caption: options.caption
        });
        input.onChanged = () => {
            if (labelProp)
                labelProp.caption = input.checked.toString();
            this.validateOnValueChanged(input, parent, scope, options?.caption);
            if (!this.isSubmitted && this._formOptions.onChange) {
                this._formOptions.onChange(input, (input as Checkbox).checked);
            }
        }
        input.setAttribute('role', 'field');
        input.setAttribute('scope', scope);
        input.setAttribute('field', field);
        input.setAttribute('dataType', 'boolean');
        if (options.readOnly !== undefined) {
            input.setAttribute('readOnly', options.readOnly.toString());
        }
        input.classList.add(Styles.checkboxStyle);
        const description = this.renderLabel({parent: vstack, options, type: 'description'});
        const error = this.renderLabel({ parent: vstack, options, type:'error'});
        this._formControls[scope] = {
            wrapper,
            input,
            description,
            error
        };
        if(defaultValue && typeof defaultValue === 'boolean') {
            // input.checked = defaultValue;
            input.setAttribute('checked', defaultValue.toString());
        }
        return wrapper;
    }

    private renderList(listOption: {parent: Container, scope: string, options: IControlOptions, isVertical?: boolean, defaultValue: any}): {
        wrapper: Container,
        columnHeader: Container,
        body: Container,
        btnAdd: Button
    } {
        const {parent, scope, options, isVertical} = listOption;
        const wrapper = new Panel(parent);
        const field = scope.split('/').pop() || '';
        wrapper.setAttribute('array-field', field);
        wrapper.setAttribute('role', 'array');
        // const header = new HStack(wrapper, {justifyContent: "space-between", alignItems: 'center'});
        const header = new GridLayout(wrapper, { templateColumns: ['1fr', '80px'] });
        header.classList.add(Styles.listHeaderStyle);
        const hstack = new HStack(header, { gap: 2 });
        new Label(hstack, { caption: options.caption });
        if (options.required) {
            new Label(hstack, {
                caption: '*',
                font: { color: '#ff0000' }
            });
        }
        const btnAdd = new Button(header, { caption: 'Add' });
        btnAdd.setAttribute('action', 'add');
        btnAdd.prepend(new Icon(undefined, {
            name: 'plus',
            width: '1em',
            height: '1em',
            fill: theme.colors.primary.contrastText,
        }));
        btnAdd.classList.add(Styles.listBtnAddStyle);
        let lbError;
        if (options.required) {
            lbError = new Label(header, {
                visible: false,
                font: { color: '#ff0000', bold: false },
                margin: { top: 2 }
            });
            lbError.setAttribute('role', 'error');
            lbError.setAttribute('array-scope', this.replacePhrase(scope));
            lbError.setAttribute('array-caption', options.caption || '');
        }
        const columnHeader = new VStack(wrapper);
        const body = new VStack(wrapper, {
            gap: 10
        });
        if (isVertical) {
            body.setAttribute('layout', 'Vertical');
            body.classList.add(Styles.listVerticalLayoutStyle);
        }
        this._formControls[scope] = {
            wrapper,
            error: lbError,
            input: body
        };
        return {
            wrapper,
            columnHeader,
            body,
            btnAdd
        };
    }

    private renderCard(cardOption: {parent: Container, scope: string, schema: IDataSchema, options: IControlOptions, uiSchema?: IUISchema, elementLabelProp?: string, btnAdd?: Button}) {
        const {parent, scope, schema, options, uiSchema, elementLabelProp, btnAdd} = cardOption;
        if (!schema.type) return;
        const isVertical = parent.getAttribute('layout') === 'Vertical';
        const setEnableBtnAdd = () => {
            if (schema.maxItems) {
                let _btnAdd = btnAdd || parent.parentElement?.querySelector('[action="add"]');
                if (_btnAdd) {
                    _btnAdd.enabled = parent.childElementCount < schema.maxItems;
                }
            }
        }
        if (schema.type === 'object') {
            const properties = schema.properties as IDataSchema;
            let hasSubLevel = !!Object.values(properties).find((value) => value.type === 'object' || value.type === 'array');
            if (!hasSubLevel) {
                const templates = [];
                for (let i = 0; i < Object.values((properties)).length; i++) {
                    templates.push('1fr');
                }
                if (!isVertical) {
                    templates.push('50px');
                }
                const row = new GridLayout(parent, {
                    // templateRows: isVertical ? templates : undefined,
                    templateColumns: isVertical ? undefined : templates,
                    gap: {
                        column: 5,
                        row: isVertical ? 8 : 5
                    },
                    verticalAlignment: isVertical ? undefined : 'start',
                    alignItems: isVertical ? undefined : 'center',
                    justifyContent: isVertical ? undefined : 'center'
                });

                row.classList.add(Styles.listItemStyle);
                row.setAttribute('role', 'list-item');
                if (isVertical) {
                    const btnDelete = new Icon(row, {
                        name: 'times',
                        margin: { left: 'auto' }
                    });
                    btnDelete.classList.add(Styles.listItemBtnDelete);
                    btnDelete.onClick = () => {
                        row.remove();
                        setEnableBtnAdd();
                        if (this._formOptions.onChange) {
                            this._formOptions.onChange(parent);
                        }
                    };
                    for (const fieldName in properties) {
                        const property = properties[fieldName];
                        this.renderFormByJSONSchema(row, (property as IDataSchema), `#/properties/${fieldName}`, false, false, { parentProp: scope });
                    }

                } else {
                    for (const fieldName in properties) {
                        const property = properties[fieldName];
                        this.renderFormByJSONSchema(row, (property as IDataSchema), `#/properties/${fieldName}`, !hasSubLevel, false, { parentProp: scope });
                    }
                    const btnDelete = new Icon(row, {
                        name: 'trash'
                    });
                    btnDelete.classList.add(Styles.listItemBtnDelete);
                    btnDelete.onClick = () => {
                        row.remove();
                        if (this._formOptions.onChange) {
                            this._formOptions.onChange(parent);
                        }
                        setEnableBtnAdd();
                    };
                }
            } else {
                const card = new Panel(parent);
                card.classList.add(Styles.cardStyle);
                card.setAttribute('role', 'list-item');
                const headerStack = new GridLayout(card, { gap: {column: 5, row: 5}, templateColumns: ['1fr', '30px', '30px'] });
                headerStack.classList.add(Styles.cardHeader);
                const bodyStack = new VStack(card);
                bodyStack.classList.add(Styles.cardBody);
                // const badgeRowNum = new Label(headerStack, {caption: (parent.querySelectorAll('[role="list-item"]')?.length) || 1});
                const pnlElmLabel = new Panel(headerStack);
                const labelProp = new Label(pnlElmLabel);
                const btnDelete = new Icon(headerStack, { name: 'trash' });
                const btnCollapse = new Icon(headerStack, { name: 'chevron-down' });
                btnCollapse.onClick = headerStack.onClick = () => {
                    bodyStack.visible = !bodyStack.visible;
                    btnCollapse.name = `chevron-${bodyStack.visible ? 'up' : 'down'}`;
                };
                btnDelete.classList.add(Styles.listItemBtnDelete);
                btnDelete.onClick = () => {
                    card.remove();
                    if (this._formOptions.onChange) {
                        this._formOptions.onChange(parent);
                    }
                    setEnableBtnAdd();
                };
                btnCollapse.classList.add(Styles.listItemBtnDelete);
                if (uiSchema && uiSchema.elements) {
                    this.renderFormByUISchema(bodyStack, uiSchema, null, schema, elementLabelProp, labelProp)
                }
                else {
                    this.renderFormByJSONSchema(bodyStack, schema, `${scope}/items`, true, hasSubLevel, { elementLabelProp, parentProp: scope });
                }
            }
        } else {
            const templateColumns = ['1fr', '50px'];
            const row = new GridLayout(parent, {
                templateColumns,
                gap: {
                    column: 5,
                    row: 5
                },
                verticalAlignment: 'center',
                alignItems: 'center',
                justifyContent: 'center'
            });
            row.classList.add(Styles.listItemStyle);
            row.setAttribute('role', 'list-item');
            this.renderFormByJSONSchema(row, (schema as IDataSchema), `${scope}/items`, true);
            const btnDelete = new Icon(row, {
                name: 'trash'
            });
            btnDelete.classList.add(Styles.listItemBtnDelete);
            btnDelete.onClick = () => {
                row.remove();
                if (this._formOptions.onChange) {
                    this._formOptions.onChange(parent);
                }
                setEnableBtnAdd();
            };
        }
        setEnableBtnAdd();
    }

    // Validation
    private validateOnValueChanged = async (currentControl: Control, parent: Container, scope: string, caption?: string) => {
        const data = this.validationData ?? await this.getFormData();
        const validationResult = this.validationResult ?? this.validate(data, this.jsonSchema, { changing: false });
        let showErrMsg: boolean = false;
        let errMsg: string = '';
        const isNonObject = parent.closest('[non-object="true"]');
        let _scope = scope;
        const parentListItem = parent.closest('[role="list-item"]');
        if (parentListItem && !isNonObject) {
            let parentFields: { key: string, idx: number }[] = [];
            const getParentIdxs = async (_parent: any) => {
                if (!_parent) return;
                const parentElm = _parent.closest('[role="array"]');
                const arrayField = parentElm?.getAttribute('array-field');
                if (arrayField) {
                    const parentList = parentElm.querySelectorAll(':scope > i-vstack > [role="list-item"]');
                    for (let i = 0; i < parentList.length; i++) {
                        if (parentList[i] === _parent) {
                            parentFields.push({ key: arrayField, idx: i });
                            await getParentIdxs(parentElm.closest('[role="list-item"]'));
                            break;
                        }
                    }
                }
            };
            await getParentIdxs(parentListItem);

            // Remove items props
            if (scope.includes('/items/properties')) {
                _scope = this.replacePhrase(scope);
            }
            const scopeWithoutIdx = _scope.replace('#', '');

            const getListFields = (property: string) => {
                const regex = /\w+\[\d+\]/g;
                const matches = property.match(regex);
                return matches || [];
            }
            let nestedScopeKeys = _scope.replace(/\/properties/g, '').split('/');
            parentFields.forEach(field => {
            const idx = nestedScopeKeys.findIndex(v => v === field.key);
            if (idx > -1) { nestedScopeKeys[idx + 1] = `${nestedScopeKeys[idx + 1]}_${field.idx + 1}` }
            });
            let nestedScope = nestedScopeKeys.join('/properties/');
            if (parentFields[0]) {
                _scope = `${_scope}_${parentFields[0].idx + 1}`;
            }
            nestedScope = nestedScope.replace('#', '');
            _scope = _scope.replace('#', '');
            const parentControl = currentControl.parentElement;
            const lbError = (parentControl?.querySelector('[role="error"]') || parent.querySelector('[role="error"]') || parent) as Label;
            const err = validationResult.errors.find(f => {
                const listFields = getListFields(f.property).reverse();
                if (f.scope.endsWith(_scope) || f.scope.endsWith(nestedScope) || f.scope.endsWith(scopeWithoutIdx)) {
                    for (let idx = 0; idx < listFields.length; idx++) {
                        const fld = listFields[idx];
                        const parentFld = parentFields[idx];
                        if (fld !== `${parentFld.key}[${parentFld.idx}]`) return false;
                    }
                    return true;
                }
                return false;
            });

            /* let lbArrayError = parent.closest('[role="array"]')?.querySelector('[role="error"][array-scope]') as Label;
            if (lbArrayError && lbArrayError.hasAttribute('is-visible')) {
                lbArrayError.removeAttribute('is-visible')
                lbArrayError.caption = '';
                lbArrayError.visible = false;
            } */
            if (!lbError) return;
            if (err) {
                lbError.setAttribute('is-visible', '')
                lbError.caption = `${caption || ''} ${err.message}`;
                lbError.visible = true;
            } else {
                lbError.removeAttribute('is-visible');
                lbError.caption = '';
                lbError.visible = false;
            }
            return;
        }
        let itemScope = scope;
        let itemControl: IControl = {};
        if (isNonObject) {
            const parentItem = currentControl.closest('[non-object]') as HTMLElement;
            const allItems = parentItem.querySelectorAll('[role="field"]');
            for (let idx = 0; idx <= allItems.length; idx++) {
                if (allItems[idx] === currentControl) {
                    itemScope = `${scope.replace(/\/items$/, '')}_${idx + 1}`;
                    break;
                }
            }
            const parentControl = currentControl.parentElement;
            const lbError = (parentControl?.querySelector('[role="error"]') || parent.querySelector('[role="error"]')) as Label;
            itemControl = { error: lbError };
        }
        if (validationResult?.valid == false) {
            const err = validationResult.errors.find(f => f.scope === (isNonObject ? itemScope : scope));
            if (err) {
                showErrMsg = true;
                errMsg = err.message;
            }
        }
        const control = isNonObject ? itemControl : this._formControls[_scope];
        if (control) {
            const { error, description } = control;
            if (showErrMsg) {
                if (description) {
                    description.visible = false;
                }
                if (error) {
                    error.setAttribute('is-visible', '')
                    error.caption = `${isNonObject ? 'Item' : (caption || '')} ${errMsg}`;
                    error.visible = true;
                }
            } else {
                if (description && description.caption) {
                    description.visible = true;
                }
                if (error) {
                    error.removeAttribute('is-visible')
                    error.caption = '';
                    error.visible = false;
                }
            }
        }
    };

    private checkPropertyChange(value: any, schema: IDataSchema, property: string): ValidationResult {
        return this.validate(value, schema, { changing: property || 'property' });
    }

    private mustBeValid(result: ValidationResult): void {
        if (!result.valid) {
            throw new TypeError(result.errors.map(function (error) {
                return 'for property ' + error.property + ': ' + error.message;
            }).join(', \n'));
        }
    }

    validate(instance: any, schema: IDataSchema, options: any): ValidationResult {
        if (!options) options = {};
        var _changing = options.changing;

        function getType(schema: any) {
            return schema.type;
        }

        var errors: ValidationError[] = [];

        // validate a value against a property definition
        function checkProp(value: any, schema: any, path: string, scope: string, i?: any, isNonObjArrayItem?: boolean): ValidationError[] | null {
            if (isNonObjArrayItem && typeof i === 'number') {
                // array's item is not object
                if (typeof (value) === 'object') {
                    value = value[Object.keys(value)[0]];
                    // if the value is null, it will be NaN. NaN can't be checked
                    if (isNaN(value) && (schema.type === 'number' || schema.type === 'integer')) value = '';
                }
                scope = scope + '_' + (i + 1).toString();
            } else {
                // array's item is object
                const parsedPath = path.split('.');
                let parsedScope = scope.split('/');
                let parentProp: string = '';
                if (parsedScope.length > 1) {
                    parsedScope = parsedScope.splice(0, parsedScope.length - 2);
                    parentProp = parsedScope[parsedScope.length - 1].split('_')[0];
                }
                let idxOfArray: number = -1;
                parsedPath.forEach((value) => {
                    if (value.includes(parentProp)) {
                        let matches = value.match(/\[(.*?)\]/);
                        if (matches) idxOfArray = parseInt(matches[1]) + 1;
                    }
                });

                if (idxOfArray > 0 && getType(schema) != 'object') {
                    scope = scope + '_' + idxOfArray;
                }
            }

            var l;
            path += path ? typeof i == 'number' ? '[' + i + ']' : typeof i == 'undefined' ? '' : '.' + i : i;

            function addError(message: string, scope: string, overwritePath?: string) {
                errors.push({ property: overwritePath || path, scope: scope, message: message });
            }

            if ((typeof schema != 'object' || schema instanceof Array) && (path || typeof schema != 'function') && !(schema && getType(schema))) {
                if (typeof schema == 'function') {
                    if (!(value instanceof schema)) {
                        addError('is not an instance of the class/constructor ' + (schema as any).name, scope);
                    }
                } else if (schema) {
                    addError('Invalid schema/property definition ' + schema, scope);
                }
                return null;
            }
            if (_changing && schema.readOnly) {
                addError('is a readonly field, it can not be changed', scope);
            }
            if (schema.extends) { // if it extends another schema, it must pass that schema as well
                checkProp(value, schema.extends, path, scope, i);
            }

            // validate a value against a type definition
            function checkType(type: IDataSchemaTypeName | IDataSchemaTypeName[], value: any, scope: string): ValidationError[] {
                if (type) {
                    if (type == 'string' && value instanceof moment) return [];
                    if (type != 'any' &&
                        (type == 'null' ? value !== null : typeof value != type) &&
                        !(value instanceof Array && type == 'array') &&
                        // !(value instanceof Date && type == 'date') &&
                        typeof type == 'string' &&
                        !(type == 'integer' && value % 1 === 0)
                    ) {
                        return [{
                            property: path,
                            scope: scope,
                            message: value + ' - ' + (typeof value) + ' value found, but a ' + type + ' is required'
                        }];
                    }
                    if (type instanceof Array) {
                        let unionErrors: ValidationError[] = [];
                        for (var j = 0; j < type.length; j++) { // a union type
                            if (!(unionErrors = checkType(type[j], value, scope)).length) {
                                break;
                            }
                        }
                        if (unionErrors.length) {
                            return unionErrors;
                        }
                    } else if (typeof type == 'object') {
                        var priorErrors = errors;
                        errors = [];
                        checkProp(value, type, path, scope);
                        var theseErrors = errors;
                        errors = priorErrors;
                        return theseErrors;
                    }
                }
                return [];
            }

            const isEmptyValue = value === undefined || value === '' || (value instanceof Array && (!value.length || value.findIndex(v => v === undefined || v === '') !== -1) && schema.items?.type === 'object')
            if (isEmptyValue) {
                if (schema.required && typeof schema.required === 'boolean') {
                    // addError("is missing and it is required", scope + '_' + idxOfArray);
                    addError('is missing and it is required', scope);
                }
            } else {

                // Check if required is an array and type is object
                if (getType(schema) === 'object' && schema.required instanceof Array) {
                    for (let requiredField of schema.required) {
                        if (value[requiredField] === undefined || value[requiredField] === '' || (value[requiredField] instanceof Array && !value[requiredField].length)) {
                            addError(`is missing and it is required`, scope + '/properties/' + requiredField, requiredField);
                        }
                    }
                }

                errors = errors.concat(checkType(getType(schema), value, scope));
                if (schema.disallow && !checkType(schema.disallow, value, scope).length) {
                    addError(' disallowed value was matched', scope);
                }
                if (value !== null) {
                    if (value instanceof Array) {
                        if (schema.items) {
                            var itemsIsArray = schema.items instanceof Array;
                            var propDef = schema.items;
                            for (i = 0, l = value.length; i < l; i += 1) {
                                if (itemsIsArray)
                                    propDef = schema.items[i];
                                if (options.coerce)
                                    value[i] = options.coerce(value[i], propDef);
                                if (schema.items.type == 'object') {
                                    var errors2 = checkProp(value[i], propDef, path, scope, i);
                                    if (errors2)
                                        errors.concat(errors2);
                                }
                            }
                        }
                        if (schema.minItems && value.length < schema.minItems) {
                            addError('There must be a minimum of ' + schema.minItems + ' in the array', scope);
                        }
                        if (schema.maxItems && value.length > schema.maxItems) {
                            addError('There must be a maximum of ' + schema.maxItems + ' in the array', scope);
                        }
                    } else if (schema.properties || schema.additionalProperties) {
                        errors.concat(checkObj(value, schema.properties, path, schema.additionalProperties, scope));
                    }
                    if (schema.items && schema.items.type != 'object') {
                        // schema has items and Non-obj array
                        const itemSchema = { required: schema.required, ...schema.items };
                        if (schema.items.type === 'array' && value instanceof Array) {
                            checkProp(value, itemSchema, path, scope);
                        } else {
                            for (let i = 0; i < value.length; i++) {
                                checkProp(value[i], itemSchema, path, scope, i, true);
                            }
                        }
                    }
                    if (schema.pattern && typeof value == 'string' && !value.match(schema.pattern)) {
                        addError('does not match the regex pattern ' + schema.pattern, scope);
                    }
                    if (schema.maxLength && typeof value == 'string' && value.length > schema.maxLength) {
                        addError('may only be ' + schema.maxLength + ' characters long', scope);
                    }
                    if (schema.minLength && typeof value == 'string' && value.length < schema.minLength) {
                        addError('must be at least ' + schema.minLength + ' characters long', scope);
                    }
                    if (typeof schema.minimum !== 'undefined' && typeof value == typeof schema.minimum &&
                        schema.minimum > value) {
                        addError('must have a minimum value of ' + schema.minimum, scope);
                    }
                    if (typeof schema.maximum !== 'undefined' && typeof value == typeof schema.maximum &&
                        schema.maximum < value) {
                        addError('must have a maximum value of ' + schema.maximum, scope);
                    }
                    if (schema['enum']) {
                        var enumer = schema['enum'];
                        l = enumer.length;
                        var found;
                        for (var j = 0; j < l; j++) {
                            if (enumer[j] === value) {
                                found = 1;
                                break;
                            }
                        }
                        if (!found) {
                            addError('does not have a value in the enumeration ' + enumer.join(', '), scope);
                        }
                    }
                    if (typeof schema.maxDecimal == 'number' &&
                        (value.toString().match(new RegExp('\\.[0-9]{' + (schema.maxDecimal + 1) + ',}')))) {
                        addError('may only have ' + schema.maxDecimal + ' digits of decimal places', scope);
                    }

                    // Todo: Additional validations
                    if (value !== '') {
                        if (schema.format === 'wallet-address') {
                            const regex = new RegExp('^((0x[a-fA-F0-9]{40})|([13][a-km-zA-HJ-NP-Z1-9]{25,34})|(X[1-9A-HJ-NP-Za-km-z]{33})|(4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}))$');
                            if (!regex.test(value)) addError('is not a valid wallet address', scope);
                        } else if (schema.format === 'cid') {
                            const regex = new RegExp('^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$');
                            if (!regex.test(value)) addError('is not a valid cid', scope);
                        } else if (schema.format === 'cid-v0') {
                            const regex = new RegExp('^(Qm[1-9A-HJ-NP-Za-km-z]{44,})$');
                            if (!regex.test(value)) addError('is not a valid version 0 cid', scope);
                        } else if (schema.format === 'cid-v1') {
                            const regex = new RegExp('^(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$');
                            if (!regex.test(value)) addError('is not a valid version 1 cid', scope);

                        } else if (schema.format === 'uuid') {
                            const regex = new RegExp('^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$');
                            if (!regex.test(value)) addError('is not a valid uuid', scope);
                        } else if (schema.format === 'url') {
                            const regex = new RegExp('^(https?|ftp)://[a-zA-Z0-9.-]+.[a-zA-Z]{2,}(?:/[^s]*)?$')
                            if (!regex.test(value)) addError('is not a valid URL', scope);
                        }
                    }
                }
            }
            return null;
        }

        // validate an object against a schema
        function checkObj(instance: any, objTypeDef: any, path: string, additionalProp: any, scope: string): ValidationError[] {

            if (typeof objTypeDef == 'object') {
                if (typeof instance != 'object' || instance instanceof Array) {
                    errors.push({ property: path, scope: scope, message: 'an object is required' });
                }

                for (var i in objTypeDef) {
                    if (objTypeDef.hasOwnProperty(i) && i != '__proto__' && i != 'constructor') {
                        var value = instance.hasOwnProperty(i) ? instance[i] : undefined;
                        // skip _not_ specified properties
                        if (value === undefined && options.existingOnly) continue;
                        var propDef = objTypeDef[i];
                        // set default
                        if (value === undefined && propDef['default']) {
                            value = instance[i] = propDef['default'];
                        }
                        if (options.coerce && i in instance) {
                            value = instance[i] = options.coerce(value, propDef);
                        }
                        checkProp(value, propDef, path, scope + '/properties/' + i, i);
                    }
                }
            }
            for (i in instance) {
                if (instance.hasOwnProperty(i) && !(i.charAt(0) == '_' && i.charAt(1) == '_') && objTypeDef && !objTypeDef[i] && additionalProp === false) {
                    if (options.filter) {
                        delete instance[i];
                        continue;
                    } else {
                        errors.push({
                            property: path, message: 'The property ' + i +
                                ' is not defined in the schema and the schema does not allow additional properties',
                            scope: scope
                        });
                    }
                }
                var requires = objTypeDef && objTypeDef[i] && objTypeDef[i].requires;
                if (requires && !(requires in instance)) {
                    errors.push({
                        property: path,
                        scope: scope,
                        message: 'the presence of the property ' + i + ' requires that ' + requires + ' also be present'
                    });
                }
                value = instance[i];
                if (additionalProp && (!(objTypeDef && typeof objTypeDef == 'object') || !(i in objTypeDef))) {
                    if (options.coerce) {
                        value = instance[i] = options.coerce(value, additionalProp);
                    }
                    checkProp(value, additionalProp, path, scope + '/properties/' + i, i);
                }
                if (!_changing && value && value.$schema) {
                    const errors2 = checkProp(value, value.$schema, path, scope + '/properties/' + i, i);
                    if (errors2)
                        errors = errors.concat(errors2);
                }
            }
            return errors;
        }

        const root = '#';

        if (schema) {
            checkProp(instance, schema, '', root, _changing || '');
        }
        if (!_changing && instance && instance.$schema) {
            checkProp(instance, instance.$schema, '', root, '');
        }
        return { valid: !errors.length, errors: errors };
    };

    // Utils
    private convertFieldNameToLabel(name: string) {
        let label = '';
        for (let i = 0; i < name.length; i++) {
            let char = name[i];
            if (i == 0) {
                label += char.toUpperCase();
                continue;
            }
            if (char == char.toUpperCase())
                label += ` ${char}`;
            else
                label += char;
        }
        return label;
    }

    private setDataUpload(url: string, control: Upload) {
        if (!url || !control) return;
        const getImageTypeFromUrl = (url: string) => {
            const extension = url.match(/\.([^.]+)$/);
            switch (extension && extension[1].toLowerCase()) {
                case 'jpg':
                case 'jpeg':
                    return 'image/jpeg';
                case 'gif':
                    return 'image/gif';
                case 'svg':
                    return 'image/svg';
                default:
                    return 'image/png';
            }
        };
        const getExtensionFromType = (fileType: string) => {
            return fileType.split('/')[1];
        };
        try {
            let imgUrl = url;
            const regex = new RegExp('^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$');
            if (regex.test(url)) {
                // cid
                imgUrl = IPFS_Gateway + imgUrl;
            } else if (url.startsWith('ipfs://')) {
                imgUrl = imgUrl.replace('ipfs://', IPFS_Gateway);
            }
            fetch(imgUrl)
                .then(response => response.arrayBuffer())
                .then(async (arrayBuffer) => {
                    const fileType = getImageTypeFromUrl(imgUrl);
                    const blob = new Blob([arrayBuffer], { type: fileType });
                    const fileName = `image-${Date.now()}.${getExtensionFromType(fileType)}`;
                    const file: UploadRawFile = new File([blob], fileName, { type: fileType });
                    file.cid = await hashFile(file);
                    control.fileList = [file];
                    control.preview(imgUrl);
                });
        } catch {
            control.fileList = [];
        }
    }
}
