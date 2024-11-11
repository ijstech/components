import {
    Container,
    customElements,
    ControlElement,
    Control
} from '@ijstech/base';
import { Panel, VStack, HStack, GridLayout } from '@ijstech/layout';
import { Tabs } from '@ijstech/tab';
import { Label } from '@ijstech/label';
import { Input } from '@ijstech/input';
import { ComboBox, IComboItem } from '@ijstech/combo-box';
import { Checkbox } from '@ijstech/checkbox';
import { Button } from '@ijstech/button';
import { Icon } from '@ijstech/icon';
import { SchemaDesignerUI, ISchemaDesignerUI } from './uiSchema';
import { IdUtils } from '@ijstech/base';
export { ISchemaDesignerUI };
import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;
import './style/schema-designer.css';

type IDataType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';

const dataTypes = [
    { label: 'string', value: 'string' },
    { label: 'number', value: 'number' },
    { label: 'integer', value: 'integer' },
    { label: 'boolean', value: 'boolean' },
    { label: 'object', value: 'object' },
    { label: 'array', value: 'array' }
]

const formatTypes = [
    { label: 'text', value: 'text' },
    { label: 'date', value: 'date' },
    { label: 'time', value: 'time' },
    { label: 'date-time', value: 'date-time' },
    { label: 'color', value: 'color' },
    { label: 'wallet-address', value: 'wallet-address' },
    { label: 'cid', value: 'cid' },
    { label: 'cid-v0', value: 'cid-v0' },
    { label: 'cid-v1', value: 'cid-v1' },
    { label: 'uuid', value: 'uuid' }
]

interface ITypeSchema {
    field: string,
    type: string,
    options?: any[],
    defaultValue?: any
}

const objectSchema: ITypeSchema[] = [
    { field: 'title', type: 'string' },
    { field: 'description', type: 'string' },
    { field: 'const', type: 'string' },
    { field: 'default', type: 'string' },
    { field: 'minProperties', type: 'number' },
    { field: 'maxProperties', type: 'number' },
    { field: 'additionalProperties', type: 'boolean' },
    { field: 'deprecated', type: 'boolean' },
    { field: 'readOnly', type: 'boolean' },
    { field: 'writeOnly', type: 'boolean' }
]

const arraySchema: ITypeSchema[] = [
    { field: 'title', type: 'string' },
    { field: 'const', type: 'string' },
    { field: 'default', type: 'string' },
    { field: 'minItems', type: 'number' },
    { field: 'maxItems', type: 'number' },
    { field: 'uniqueItems', type: 'boolean' },
    { field: 'deprecated', type: 'boolean' },
    { field: 'readOnly', type: 'boolean' },
    { field: 'writeOnly', type: 'boolean' }
]

const stringSchema: ITypeSchema[] = [
    { field: 'pattern', type: 'string' },
    { field: 'format', type: 'string', options: formatTypes },
    { field: 'title', type: 'string' },
    { field: 'const', type: 'string' },
    { field: 'default', type: 'string' },
    { field: 'minLength', type: 'number' },
    { field: 'maxLength', type: 'number' },
    { field: 'deprecated', type: 'boolean' },
    { field: 'readOnly', type: 'boolean' },
    { field: 'writeOnly', type: 'boolean' }
]

const numberSchema: ITypeSchema[] = [
    { field: 'title', type: 'string' },
    { field: 'const', type: 'number' },
    { field: 'default', type: 'number' },
    { field: 'multipleOf', type: 'number' },
    { field: 'minimum', type: 'number' },
    { field: 'maximum', type: 'number' },
    { field: 'exclusiveMinimum', type: 'number' },
    { field: 'exclusiveMaximum', type: 'number' },
    { field: 'deprecated', type: 'boolean' },
    { field: 'readOnly', type: 'boolean' },
    { field: 'writeOnly', type: 'boolean' }
]

const booleanSchema: ITypeSchema[] = [
    { field: 'title', type: 'string' },
    { field: 'const', type: 'boolean', options: [{ label: 'true', value: true }, { label: 'false', value: false }] },
    { field: 'default', type: 'boolean', options: [{ label: 'true', value: true }, { label: 'false', value: false }], defaultValue: { label: '', value: false } },
    { field: 'deprecated', type: 'boolean' },
    { field: 'readOnly', type: 'boolean' },
    { field: 'writeOnly', type: 'boolean' }
]

export interface ISchemaDesignerData {
    type: IDataType,
    properties: {
        [key: string]: {
            type: IDataType,
            title?: string,
            description?: string,
            pattern?: number | string,
            format?: string,
            const?: string | number | boolean,
            default?: string | number | boolean,
            multipleOf?: number,
            minimum?: number,
            maximum?: number,
            exclusiveMinimum?: number,
            exclusiveMaximum?: number,
            minLength?: number,
            maxLength?: number,
            minItems?: number,
            maxItems?: number,
            uniqueItems?: boolean,
            deprecated?: boolean,
            readOnly?: boolean,
            writeOnly?: boolean,
            additionalProperties?: boolean,
            enum?: string[] | number[],
            oneOf?: { title?: string, const: number | string }[],
            items?: ISchemaDesignerData | false,
            prefixItems?: {
                type?: string | number,
                enum?: string | number
            }[],
            required?: string[]
        }
    },
    required?: string[]
}

type IControl = { [key: string]: Control };
const controls: { [key: string]: Control | IControl } = {};

export interface SchemaDesignerElement extends ControlElement {
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-schema-designer']: SchemaDesignerElement
        }
    }
}

@customElements('i-schema-designer')
export class SchemaDesigner extends Container {
    private txtSchema: Input;
    private pnlSchemaBuilder: Panel;
    private schema: ISchemaDesignerData;
    private pnlUISchema: Panel;
    private uiSchemaPanel: SchemaDesignerUI;

    static async create(options?: SchemaDesignerElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    constructor(parent?: Container, options?: SchemaDesignerElement) {
        super(parent, options);
    }

    refresh() {
        super.refresh();
    }

    protected init() {
        super.init();
        this.initUI();
    }

    getJsonData() {
        return this.schema || {};
    }

    getJsonUI() {
        return this.uiSchemaPanel?.getUISchema() || {};
    }

    private async getJSON(_controls: Control | IControl | string[]) {
        if (_controls === undefined) return undefined;
        if (_controls instanceof Control) {
            const control = _controls;
            if (control.getAttribute('ignore-field')) return undefined;
            if (control.tagName === 'I-CHECKBOX')
                return (control as Checkbox).checked;
            if (control.tagName === 'I-COMBO-BOX') {
                return ((control as ComboBox).selectedItem)?.value;
            }
            if (control.tagName === 'I-INPUT') {
                const inputType = (control as Input).inputType;
                if (inputType === 'text')
                    return (control as Input).value;
                if (inputType === 'number') {
                    const value = parseInt((control as Input).value);
                    return isNaN(value) ? undefined : value;
                }
                return (control as Input).value;
            }
            return (control as any).value;
        }
        if (_controls instanceof Array || typeof _controls !== 'object') {
            return _controls;
        }
        let data: any = {};
        const keys = Object.keys(_controls).sort(function (a, b) { return (_controls[a] as any).itemIdx - (_controls[b] as any).itemIdx })
        for (const key of keys) {
            const value = await this.getJSON(_controls[key]);
            if (key === 'itemIdx' && typeof value === 'number') {
                continue;
            }
            if (key === this.uuid) {
                data['properties'] = value;
            } else if (value instanceof Array) {
                if (key === 'prefixItems') {
                    data[key] = value.map((v) => {
                        if (v.type) {
                            return { type: v.type };
                        }
                        return { enum: v.enum };
                    });
                } else if (value.length) {
                    data[key] = value;
                }
            } else if (value !== '' && value !== undefined) {
                data[key] = value;
            }
        }
        return data;
    }

    private async updateJsonData() {
        let schema: any = {
            type: 'object',
            required: controls['required'],
            properties: await this.getJSON(controls[this.uuid])
        };
        for (const obj of objectSchema) {
            const value = await this.getJSON(controls[obj.field]);
            if (value !== '' && value !== undefined) {
                schema[obj.field] = value;
            }
        }
        this.schema = schema;
        this.txtSchema.value = JSON.stringify(schema, null, 4);
        this.uiSchemaPanel.schema = schema;
    }

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

    private generateFieldName(requiredElm: VStack) {
        while (true) {
            const fieldName = `item-${IdUtils.generateUUID(4)}`;
            const oldField = requiredElm.querySelector(`[field-required='${fieldName.toLowerCase()}']`);
            if (!oldField) {
                return fieldName;
            }
        }
    }

    private createDataSchema(parent: Panel, dataType: IDataType, parentFields?: string[], parentType?: IDataType, field?: string, listRequired?: string[], subIdx?: number) {
        const pnlSchema = new Panel();
        const isChildren = !!field;
        let fields = [...(parentFields || [])];
        let schemaDesigner: any = [];
        let isExpanded = true;
        let type = dataType;
        let requiredFields: string[] = [];
        let subItemIdx = 0;
        parent.append(pnlSchema);
        const pnlForm = new Panel(undefined, {
            padding: { left: 10, right: 10 }
        });
        if (parentType === 'array') {
            fields.push('items');
            pnlSchema.setAttribute('role', 'sub-items');
        }
        if (isChildren) {
            fields.push(this.uuid);
            fields.push(field || '');
            schemaDesigner = this.addSchemaByType(fields, dataType);
            this.updateControls(controls, [...fields, 'itemIdx'], subIdx);
            pnlForm.setAttribute('role', 'form-item');
            const updateParentFields = (newParentFields: string, parentIdx: number) => {
                fields.splice(parentIdx - 1, 1, newParentFields)
            }
            (pnlForm as any).updateFields = (newParentField: string, parentIdx: number) => updateParentFields(newParentField, parentIdx);
            pnlForm.append(schemaDesigner);
        }
        const hasAction = dataType === 'object' || dataType === 'array';
        const btnAddItem = new Button(undefined, {
            caption: 'Add Item',
            padding: { top: 6, bottom: 6, left: 16, right: 16 }
        });
        btnAddItem.prepend(new Icon(undefined, {
            name: 'plus',
            width: '1em',
            height: '1em',
            fill: Theme.colors.primary.contrastText,
        }));
        const hStackActions = new HStack(undefined, {
            verticalAlignment: 'center',
            wrap: 'wrap',
            gap: 10,
            margin: { top: 10 }
        });
        const hStackAdd = new HStack(hStackActions, {
            verticalAlignment: 'center',
            gap: 10,
            visible: hasAction
        });
        btnAddItem.onClick = async () => {
            const fieldName = this.generateFieldName(parent.querySelector("[role='fields-required']") as VStack);
            this.createDataSchema(pnlForm, 'object', fields, type, fieldName, requiredFields, subItemIdx++);
            requiredFields.push(fieldName);
            if (!vStackRequired.hasChildNodes()) {
                const lb = new Label(vStackRequired, {
                    caption: 'Required',
                    margin: { top: isChildren ? 10 : 0 }
                });
                lb.classList.add('form-label');
            }
            const chkBox = new Checkbox(undefined, {
                caption: fieldName,
                checked: true
            });
            chkBox.onChanged = () => {
                const currentFieldName = pnlGroupRequired.getAttribute('field-required');
                if (chkBox.checked) {
                    if (!requiredFields.some(v => v.toLowerCase() === currentFieldName.toLowerCase())) {
                        requiredFields.push(currentFieldName);
                    }
                } else {
                    const idx = requiredFields.findIndex(v => v.toLowerCase() === currentFieldName.toLowerCase());
                    if (idx !== -1) {
                        requiredFields.splice(idx, 1);
                    }
                }
                this.updateJsonData();
            };
            const pnlGroupRequired = new Panel();
            pnlGroupRequired.classList.add('form-group');
            const pnlControl = new Panel(pnlGroupRequired);
            pnlControl.classList.add('form-control');
            pnlControl.appendChild(chkBox);
            pnlGroupRequired.setAttribute('field-required', fieldName);
            vStackRequired.appendChild(pnlGroupRequired);
            await this.updateJsonData();
            this.uiSchemaPanel.updateActionsItems();
        }
        hStackAdd.appendChild(btnAddItem);
        hStackAdd.setAttribute('role', 'add-new-item');
        btnAddItem.setAttribute('action', 'add-item');
        const vStackRequired = new VStack(undefined, {
            gap: 10,
            verticalAlignment: 'center'
        });
        vStackRequired.setAttribute('role', 'fields-required');
        this.updateControls(controls, [...fields, 'required'], requiredFields);
        let btnDelete: any = [];
        let inputDescription: any = [];
        let iconRemoveDescription: any = [];
        let iconRenameInvalid: any = [];
        let btnExpand: any = [];
        let iconExpand: any = [];
        const onExpand = (src?: Control) => {
            isExpanded = !isExpanded;
            schemaDesigner.visible = isExpanded;
            vStackRequired.visible = isExpanded;
            hStackActions.visible = isExpanded;
            if (src) {
                btnExpand.caption = isExpanded ? 'Hide' : 'Show';
                iconExpand.name = isExpanded ? 'angle-up' : 'angle-down';
            }
        }
        if (isChildren) {
            btnExpand = new Button(undefined, {
                caption: 'Show',
                display: 'flex',
                width: '100%',
                padding: { top: 6, bottom: 6, left: 12, right: 12 }
            });
            iconExpand = new Icon(undefined, {
                name: 'angle-down',
                width: '1.125em',
                height: '1.125em',
                fill: Theme.colors.primary.contrastText,
            });
            btnExpand.prepend(iconExpand);
            btnExpand.onClick = onExpand;
            inputDescription = new Input(undefined, {
                inputType: 'text',
            });
            iconRemoveDescription = new Icon(undefined, {
                name: 'times-circle',
                visible: false,
                width: 12,
                height: 12,
                position: 'absolute',
                top: 5,
                right: 5,
                fill: Theme.colors.secondary.main,
                tooltip: {
                    content: 'Remove this property',
                    trigger: 'hover',
                }
            });
            iconRemoveDescription.onClick = () => {
                iconRemoveDescription.visible = false;
                inputDescription.value = '';
                this.updateJsonData();
            }
            this.updateControls(controls, [...fields, 'description'], inputDescription);
            inputDescription.onChanged = () => {
                iconRemoveDescription.visible = !!inputDescription.value;
                this.updateJsonData();
            }
            iconRenameInvalid = new Icon(undefined, {
                name: 'exclamation-circle',
                width: 12,
                height: 12,
                fill: Theme.colors.secondary.main,
                tooltip: {
                    content: 'Invalid field',
                    trigger: 'hover',
                },
                visible: false
            });
            btnDelete = new Button(undefined, {
                caption: 'Delete',
                background: { color: `${Theme.colors.secondary.main} !important` },
                display: 'flex',
                width: '100%',
                padding: { top: 6, bottom: 6, left: 12, right: 12 },
            });
            btnDelete.prepend(new Icon(undefined, {
                name: 'trash',
                width: '1em',
                height: '1em',
                fill: Theme.colors.primary.contrastText,
            }));
            btnDelete.setAttribute('action', 'delete');
            btnDelete.onClick = async () => {
                parent.removeChild(pnlSchema);
                this.updateControls(controls, fields);
                const elm = parent.querySelector("[role='fields-required']") as VStack;
                if (elm) {
                    const fieldName = fields[fields.length - 1] || '';
                    if (listRequired && listRequired.length) {
                        const idx = listRequired.findIndex(v => v.toLowerCase() === fieldName.toLowerCase());
                        if (idx !== -1) {
                            listRequired.splice(idx, 1);
                        }
                    }
                    const fieldRequired = elm.querySelector(`[field-required='${fieldName.toLowerCase()}']`);
                    if (fieldRequired) {
                        elm.removeChild(fieldRequired);
                        if (elm.childNodes.length === 1) {
                            elm.clearInnerHTML();
                        }
                    }
                }
                await this.updateJsonData();
                let deleteFields: string[] = [];
                for (const field of fields) {
                    if (deleteFields.length > 1 && deleteFields[deleteFields.length - 1] !== this.uuid && field !== this.uuid) {
                        continue;
                    }
                    deleteFields.push(field);
                }
                this.uiSchemaPanel.deleteUISchema(deleteFields);
                this.uiSchemaPanel.updateActionsItems();
            }
            onExpand();
        }
        pnlForm.append(vStackRequired);
        pnlForm.append(hStackActions);
        const pnlSchemaItem = new Panel(pnlSchema, {
            border: { width: 1, style: 'solid', color: '#DADDE1', radius: '1em' },
            padding: { top: 10, bottom: 10, left: 10, right: 10 },
            margin: { top: isChildren ? 20 : 0 }
        });
        pnlSchemaItem.classList.add('data-schema');
        const vStack = new VStack(pnlSchemaItem, { gap: 10 });
        pnlSchemaItem.appendChild(pnlForm);
        if (!isChildren) {
            const hStack = new HStack(vStack, {
                gap: 10,
                justifyContent: 'start',
                alignItems: 'center'
            });
            const hStackRoot = new HStack(hStack, {
                gap: 10,
                verticalAlignment: 'center'
            });
            hStackRoot.classList.add('cs-wrapper--header');
            new Label(hStackRoot, {
                caption: 'Root',
                font: { size: '1rem', bold: true }
            });
            new Label(hStackRoot, {
                caption: 'object',
                font: { size: '1rem' },
                opacity: 0.65
            });
        } else {
            const hStack = new HStack(vStack, {
                gap: 10,
                verticalAlignment: 'center'
            });
            const hStackChild = new HStack(hStack, {
                gap: 10,
                wrap: 'wrap',
                width: 'calc(100% - 120px)',
                padding: { left: 10, right: 10 },
            });
            const pnlPropertyGroup = new Panel(hStackChild, {
                width: 'calc(33.33% - 7px)',
                minWidth: 100
            });
            pnlPropertyGroup.classList.add('form-group');
            const lbPropertyName = new Label(pnlPropertyGroup, {
                caption: 'Property Name'
            });
            lbPropertyName.classList.add('form-label');
            const pnlPropertyControl = new Panel(pnlPropertyGroup);
            pnlPropertyControl.classList.add('form-control');
            const inputPropertyName = new Input(pnlPropertyControl, {
                inputType: 'text',
                value: field
            });
            pnlPropertyControl.appendChild(iconRenameInvalid);
            inputPropertyName.onChanged = async () => {
                const currentFieldName = inputPropertyName.value;
                if (currentFieldName && /^[a-zA-Z0-9_-]*$/.test(currentFieldName)) {
                    const requiredElm = parent.querySelector("[role='fields-required']") as VStack;
                    const oldField = requiredElm.querySelector(`[field-required='${currentFieldName.toLowerCase()}']`);
                    if (oldField) {
                        iconRenameInvalid.visible = true;
                        iconRenameInvalid.tooltip.content = 'Duplicate field';
                    } else {
                        iconRenameInvalid.visible = false;
                        const lastIndex = fields.length - 1;
                        const oldControl = this.getControlByPath(fields);
                        const oldFieldName = fields[lastIndex];
                        const oldFields = [...fields];
                        this.updateControls(controls, [...fields]);
                        fields.splice(lastIndex, 1);
                        fields.push(currentFieldName);
                        this.updateControls(controls, [...fields], oldControl);
                        const childForms = pnlForm.querySelectorAll("[role='form-item']");
                        for (const chidlForm of childForms) {
                            (chidlForm as any).updateFields(currentFieldName, fields.length);
                        }
                        const requiredElm = parent.querySelector("[role='fields-required']") as VStack;
                        if (requiredElm) {
                            if (listRequired && listRequired.length) {
                                const idx = listRequired.findIndex(v => v.toLowerCase() === oldFieldName.toLowerCase());
                                if (idx !== -1) {
                                    listRequired.splice(idx, 1, currentFieldName);
                                }
                            }
                            const fieldRequired = requiredElm.querySelector(`[field-required='${oldFieldName.toLowerCase()}']`) as any;
                            if (fieldRequired) {
                                fieldRequired.setAttribute('field-required', currentFieldName.toLowerCase());
                                fieldRequired.options['field-required'] = currentFieldName.toLowerCase();
                                (fieldRequired.firstChild.firstChild as ComboBox).caption = currentFieldName;
                            }
                        }
                        await this.updateJsonData();
                        this.uiSchemaPanel.updateUISchemaItemsByRename(oldFields, fields);
                    }
                } else {
                    iconRenameInvalid.visible = true;
                    iconRenameInvalid.tooltip.content = 'Invalid field';
                }
            }

            const pnlTypeGroup = new Panel(hStackChild, {
                width: 'calc(33.33% - 7px)',
                minWidth: 100
            });
            pnlPropertyGroup.classList.add('form-group');
            const lbTypeName = new Label(pnlTypeGroup, {
                caption: 'Type'
            });
            lbTypeName.classList.add('form-label');
            const pnlTypeControl = new Panel(pnlTypeGroup);
            pnlTypeControl.classList.add('form-control');
            const cbbType = new ComboBox(pnlTypeControl, {
                items: dataTypes,
                selectedItem: dataTypes.find(v => v.value === 'object'),
                icon: { name: 'caret-down', width: '16px', height: '16px' }
            });
            cbbType.onChanged = async () => {
                const selectedItem = cbbType.selectedItem as IComboItem;
                const value = selectedItem.value as IDataType;
                if (value === type) return;
                requiredFields = [];
                pnlForm.clearInnerHTML();
                schemaDesigner.clearInnerHTML();
                schemaDesigner = this.addSchemaByType(fields, value);
                schemaDesigner.visible = isExpanded;
                vStackRequired.clearInnerHTML();
                this.updateControls(controls, [...fields, 'required'], requiredFields);
                this.updateControls(controls, [...fields, 'description'], inputDescription);
                pnlForm.append(schemaDesigner);
                pnlForm.append(vStackRequired);
                pnlForm.append(hStackActions);
                if (value === 'object' || value === 'array') {
                    btnAddItem.enabled = true;
                    hStackAdd.visible = true;
                } else {
                    btnAddItem.enabled = false;
                    hStackAdd.visible = false;
                }
                type = value;
                await this.updateJsonData();
                this.uiSchemaPanel.deleteUISchema(fields, true);
                this.uiSchemaPanel.updateUISchemaByType(fields);
            }

            const pnlDescriptionGroup = new Panel(hStackChild, {
                width: 'calc(33.33% - 7px)',
                minWidth: 100
            });
            pnlDescriptionGroup.classList.add('form-group');
            const lbDescriptionName = new Label(pnlDescriptionGroup, {
                caption: 'Description'
            });
            lbDescriptionName.classList.add('form-label');
            const pnlDescriptionControl = new Panel(pnlDescriptionGroup);
            pnlDescriptionControl.classList.add('form-control');
            pnlDescriptionControl.appendChild(inputDescription);
            pnlDescriptionControl.appendChild(iconRemoveDescription);

            const hStackGroupBtn = new HStack(hStack, {
                gap: 10,
                width: 100,
                wrap: 'wrap',
                verticalAlignment: 'center'
            });
            hStackGroupBtn.appendChild(btnDelete);
            hStackGroupBtn.appendChild(btnExpand);
        }
    }

    private renderEnum(parentFields: string[], type: 'text' | 'number', parentList?: string[]): Panel {
        let listEnum: any[] = [];
        if (parentList) {
            listEnum = parentList;
        } else {
            this.updateControls(controls, [...parentFields, 'enum'], listEnum);
        }
        const hStackEnum = new HStack(undefined, {
            gap: 8,
            verticalAlignment: 'center',
            wrap: 'wrap'
        });
        hStackEnum.setAttribute('role', 'fields-enum');
        const btnAdd = new Button(undefined, {
            caption: 'Add',
            enabled: false,
            padding: { top: 6, bottom: 6, left: 16, right: 16 },
        });
        const inputEnum = new Input(undefined, {
            inputType: type,
        });
        inputEnum.classList.add('cs-width--input');
        inputEnum.onChanged = () => {
            const val = inputEnum.value;
            if (type === 'number') {
                btnAdd.enabled = val !== '' && !isNaN(Number(val)) && !listEnum.some(v => v === Number(val));
            } else {
                btnAdd.enabled = val && !listEnum.some(v => v.toString().toLowerCase() === val.toString().toLowerCase());
            }
        }
        btnAdd.onClick = async () => {
            const val = inputEnum.value;
            if (((type === 'number' && !isNaN(val)) || type === 'text' && val) && !listEnum.some(v => v.toString().toLowerCase() === val.toString().toLowerCase())) {
                listEnum.push(type === 'number' ? Number(val) : val);
                inputEnum.value = '';
                btnAdd.enabled = false;
                const pnlEnum = new Panel(hStackEnum, {
                    position: 'relative',
                    display: 'flex',
                    padding: { top: 8, bottom: 8, left: 16, right: 16 },
                    border: { radius: 8 },
                    background: { color: Theme.action.selected }
                });
                const iconTimes = new Icon(pnlEnum, {
                    name: 'times',
                    width: 14,
                    height: 14,
                    fill: Theme.colors.secondary.main,
                    position: 'absolute',
                    right: 2,
                    top: 2
                });
                iconTimes.onClick = async () => {
                    const idx = listEnum.findIndex(v => v.toString().toLowerCase() === val.toString().toLowerCase());
                    listEnum.splice(idx, 1);
                    if (!parentList) {
                        iconRemove.visible = !!listEnum.length;
                    }
                    hStackEnum.removeChild(pnlEnum);
                    await this.updateJsonData();
                    this.uiSchemaPanel.updateUISchemaByType([...parentFields], true);
                }
                const lbVal = new Label(pnlEnum, {
                    caption: val,
                    font: { size: '12px' },
                    minWidth: 20,
                    padding: { top: 0, bottom: 0, left: 0, right: 0 }
                });
                lbVal.classList.add('cs-enum--value');
                if (!parentList) {
                    iconRemove.visible = true;
                }
                await this.updateJsonData();
                this.uiSchemaPanel.updateUISchemaByType([...parentFields], true);
            }
        }
        const pnlEnumGroup = new Panel(undefined, {
            width: '100%',
            margin: { top: 8 }
        });
        pnlEnumGroup.classList.add('form-group');
        let iconRemove: any = [];
        if (!parentList) {
            iconRemove = new Icon(undefined, {
                name: 'times-circle',
                visible: false,
                width: 12,
                height: 12,
                position: 'absolute',
                top: 5,
                right: 5,
                fill: Theme.colors.secondary.main,
                tooltip: {
                    content: 'Remove this property',
                    trigger: 'hover',
                }
            });
            iconRemove.onClick = async () => {
                hStackEnum.clearInnerHTML();
                listEnum.splice(0, listEnum.length);
                iconRemove.visible = false;
                await this.updateJsonData();
                this.uiSchemaPanel.updateUISchemaByType([...parentFields], true);
            }
            pnlEnumGroup.classList.add('cs-box--enum');
            pnlEnumGroup.appendChild(iconRemove);
        }
        const lbEnum = new Label(pnlEnumGroup, {
            caption: 'Enum'
        });
        lbEnum.classList.add('form-label');
        const pnlEnumControl = new Panel(pnlEnumGroup);
        pnlEnumControl.classList.add('form-control');
        pnlEnumControl.appendChild(hStackEnum);
        const hStackInputEnum = new Panel(pnlEnumControl, {
            gap: 8,
            margin: { top: 8 },
            wrap: 'wrap',
            verticalAlignment: 'center'
        });
        hStackInputEnum.appendChild(inputEnum);
        hStackInputEnum.appendChild(btnAdd);
        return pnlEnumGroup;
    }

    private renderOneOf(parentFields: string[], type: 'text' | 'number', parentList?: string[]): Panel {
        let listOneOf: any[] = [];
        if (parentList) {
            listOneOf = parentList;
        } else {
            this.updateControls(controls, [...parentFields, 'oneOf'], listOneOf);
        }
        const hStackOneOf = new HStack(undefined, {
            gap: 8,
            verticalAlignment: 'center',
            wrap: 'wrap'
        });
        hStackOneOf.setAttribute('role', 'fields-one-of');
        const btnAdd = new Button(undefined, {
            caption: 'Add',
            enabled: false,
            padding: { top: 6, bottom: 6, left: 16, right: 16 },
            maxHeight: 25
        });
        const inputOneOfTitle = new Input(undefined, {
            inputType: 'text',
        });
        const inputOneOfValue = new Input(undefined, {
            inputType: type,
        });
        inputOneOfTitle.onChanged = () => {
            const title = inputOneOfTitle.value || '';
            const val = inputOneOfValue.value;
            if (type === 'number') {
                btnAdd.enabled = title && val !== '' && !isNaN(Number(val)) && !listOneOf.some(v => v.const === Number(val) || v.title.toLowerCase() === title.toLowerCase());
            } else {
                btnAdd.enabled = title && val && !listOneOf.some(v => v.const.toString().toLowerCase() === val.toString().toLowerCase() || v.title.toLowerCase() === title.toLowerCase());
            }
        }
        inputOneOfValue.onChanged = () => {
            const title = inputOneOfTitle.value;
            const val = inputOneOfValue.value;
            if (type === 'number') {
                btnAdd.enabled = title && val !== '' && !isNaN(Number(val)) && !listOneOf.some(v => v.const === Number(val) || v.title.toLowerCase() === title.toLowerCase());
            } else {
                btnAdd.enabled = title && val && !listOneOf.some(v => v.const.toString().toLowerCase() === val.toString().toLowerCase() || v.title.toLowerCase() === title.toLowerCase());
            }
        }
        btnAdd.onClick = async () => {
            const title = inputOneOfTitle.value;
            const val = inputOneOfValue.value;
            if (((type === 'number' && !isNaN(val)) || type === 'text' && val) && !listOneOf.some(v => v.const.toString().toLowerCase() === val.toString().toLowerCase())) {
                listOneOf.push({ title, const: type === 'number' ? Number(val) : val });
                inputOneOfTitle.value = '';
                inputOneOfValue.value = '';
                btnAdd.enabled = false;
                const pnlEnum = new Panel(hStackOneOf, {
                    position: 'relative',
                    display: 'flex',
                    padding: { top: 8, bottom: 8, left: 16, right: 16 },
                    border: { radius: 8 },
                    background: { color: Theme.action.selected }
                });
                const iconTimes = new Icon(pnlEnum, {
                    name: 'times',
                    width: 14,
                    height: 14,
                    fill: Theme.colors.secondary.main,
                    position: 'absolute',
                    right: 2,
                    top: 2
                });
                iconTimes.onClick = async () => {
                    const idx = listOneOf.findIndex(v => v.const.toString().toLowerCase() === val.toString().toLowerCase());
                    listOneOf.splice(idx, 1);
                    if (!parentList) {
                        iconRemove.visible = !!listOneOf.length;
                    }
                    hStackOneOf.removeChild(pnlEnum);
                    await this.updateJsonData();
                    this.uiSchemaPanel.updateUISchemaByType([...parentFields], true);
                }
                const lbVal = new Label(pnlEnum, {
                    caption: title,
                    font: { size: '12px' },
                    minWidth: 20,
                    padding: { top: 0, bottom: 0, left: 0, right: 0 }
                });
                lbVal.classList.add('cs-enum--value');
                if (!parentList) {
                    iconRemove.visible = true;
                }
                await this.updateJsonData();
                this.uiSchemaPanel.updateUISchemaByType([...parentFields], true);
            }
        }
        let iconRemove: any = [];
        if (!parentList) {
            iconRemove = new Icon(undefined, {
                name: 'times-circle',
                visible: false,
                width: 12,
                height: 12,
                position: 'absolute',
                top: 5,
                right: 5,
                fill: Theme.colors.secondary.main,
                tooltip: {
                    content: 'Remove this property',
                    trigger: 'hover',
                }
            });
            iconRemove.onClick = async () => {
                hStackOneOf.clearInnerHTML();
                listOneOf.splice(0, listOneOf.length);
                iconRemove.visible = false;
                await this.updateJsonData();
                this.uiSchemaPanel.updateUISchemaByType([...parentFields], true);
            }
        }
        const pnlOneOfGroup = new Panel(undefined, {
            margin: { top: 8 }
        });
        pnlOneOfGroup.classList.add('`form-group');
        if (!parentList) {
            pnlOneOfGroup.classList.add('cs-box--enum');
        }
        pnlOneOfGroup.appendChild(iconRemove);
        const lbOneOf = new Label(pnlOneOfGroup, {
            caption: 'One Of'
        });
        lbOneOf.classList.add('form-label');
        const pnlOneOfControl = new Panel(pnlOneOfGroup);
        pnlOneOfControl.classList.add('form-control');
        pnlOneOfControl.appendChild(hStackOneOf);
        const hStackOneOfInput = new HStack(pnlOneOfControl, {
            gap: 8,
            margin: { top: 8 },
            wrap: 'wrap',
            verticalAlignment: 'end'
        });
        const pnlOneOfInput = new Panel(hStackOneOfInput, {
            margin: { top: 8 }
        });
        pnlOneOfInput.classList.add('form-group', 'cs-width--input');
        const lbTitle = new Label(pnlOneOfInput, {
            caption: 'Title'
        });
        const pnlControlTitle = new Panel(pnlOneOfInput);
        pnlControlTitle.classList.add('form-control');
        pnlControlTitle.appendChild(inputOneOfTitle);
        const lbConst = new Label(pnlOneOfInput, {
            caption: 'Const'
        });
        const pnlControlConst = new Panel(pnlOneOfInput);
        pnlControlConst.classList.add('form-control');
        pnlControlConst.appendChild(inputOneOfValue);
        hStackOneOfInput.appendChild(btnAdd);
        return pnlOneOfGroup;
    }

    private renderPrefixItems(parentFields: string[]): VStack {
        let listType: any[] = [];
        this.updateControls(controls, [...parentFields, 'prefixItems'], listType);
        const vStackPrefixItems = new VStack(undefined, {
            gap: 8,
            verticalAlignment: 'center',
            wrap: 'wrap',
            minWidth: 180
        });
        vStackPrefixItems.setAttribute('role', 'prefix-items');
        const hStackAdd = new HStack(vStackPrefixItems, {
            verticalAlignment: 'center',
            gap: 10,
        });
        const options = [
            { label: 'string', value: 'string' },
            { label: 'number', value: 'number' },
            { label: 'enum', value: 'enum' }
        ]
        const cbbType = new ComboBox(hStackAdd, {
            items: options,
            selectedItem: options[0],
            icon: { name: 'caret-down', width: '16px', height: '16px' },
            minWidth: 180
        });
        cbbType.style.width = 'calc(100% - 70px)';
        const btnAdd = new Button(hStackAdd, {
            caption: 'Add',
            padding: { top: 6, bottom: 6, left: 16, right: 16 },
        });
        btnAdd.onClick = () => {
            const val = (cbbType.selectedItem as IComboItem).value;
            const idx = listType.length;
            let pnlEnum: any;
            const pnlType = new Panel(undefined, {
                position: 'relative',
                display: 'flex',
                padding: { top: 8, bottom: 8, left: 16, right: 16 },
                border: { radius: 8 },
            });
            pnlType.classList.add('cs-box--shadow');
            const iconTimes = new Icon(pnlType, {
                name: 'times',
                width: 14,
                height: 14,
                fill: Theme.colors.secondary.main,
                position: 'absolute',
                right: 4,
                top: 4
            });
            iconTimes.onClick = () => {
                const _idx = listType.findIndex(v => v.idx === idx);
                listType.splice(_idx, 1);
                vStackPrefixItems.removeChild(pnlType);
                this.updateJsonData();
            }
            if (val !== 'enum') {
                listType.push({ type: val, idx });
                const lbVal = new Label(pnlType, {
                    caption: val,
                    font: { size: '12px' },
                    minWidth: 20,
                    padding: { top: 0, bottom: 0, left: 0, right: 0 }
                });
                lbVal.classList.add('cs-enum--value');
            } else {
                listType.push({ enum: [], idx });
                pnlEnum = this.renderEnum([], 'text', listType[idx].enum);
            }
            if (pnlEnum) {
                pnlType.appendChild(pnlEnum);
            }
            vStackPrefixItems.appendChild(pnlType);
            this.updateJsonData();
        }
        const vStackPrefix = new VStack(undefined, {
            gap: 8,
            verticalAlignment: 'center'
        });
        vStackPrefix.classList.add('cs-prefix--items');
        const pnlFormGroup = new Panel(vStackPrefix);
        pnlFormGroup.classList.add('form-group');
        const lbPrefix = new Label(pnlFormGroup, {
            caption: 'Prefix Items'
        });
        lbPrefix.classList.add('form-label');
        const pnlPrefixControl = new Panel(pnlFormGroup);
        pnlPrefixControl.classList.add('form-control');
        const hStackPrefixInput = new HStack(pnlPrefixControl, {
            gap: 8,
            wrap: 'wrap',
            verticalAlignment: 'center'
        });
        hStackPrefixInput.appendChild(cbbType);
        hStackPrefixInput.appendChild(btnAdd);
        pnlPrefixControl.appendChild(vStackPrefixItems);
        return vStackPrefix;
    }

    private updateControls(obj: any, keyPath: string[], control?: any) {
        let lastKeyIndex = keyPath.length - 1;
        for (let i = 0; i < lastKeyIndex; ++i) {
            const key = keyPath[i];
            if (!(key in obj)) {
                obj[key] = {};
            }
            obj = obj[keyPath[i]];
        }
        if (control !== undefined) {
            obj[keyPath[lastKeyIndex]] = control;
        } else {
            delete obj[keyPath[lastKeyIndex]];
        }
    }

    private getControlByPath(keyPath: string[]) {
        let obj = Object(controls);
        for (const key of keyPath) {
            if (!(key in obj)) {
                obj[key] = {};
            }
            obj = obj[key];
        }
        return obj;
    }

    private renderSchema(parentFields: string[], schema: ITypeSchema[], propType: IDataType) {
        let _controls: IControl = {};
        this.updateControls(controls, parentFields, _controls);
        _controls['type'] = propType as any;
        const vStack = new VStack(undefined, { gap: 10 });
        if (parentFields.length) {
            new Label(vStack, {
                caption: 'Advanced options',
                font: { size: '16px', color: Theme.colors.primary.main }
            });
        }
        const gridLayout = new GridLayout(vStack, {
            templateColumns: ['1fr', '1fr'],
            gap: { column: 10, row: 10 }
        });
        for (const item of schema) {
            const { field, type, options, defaultValue } = item;
            const notCheckbox = type !== 'boolean' || (type === 'boolean' && options);
            const fieldName = this.convertFieldNameToLabel(field);
            const pnlFormGroup = new Panel(gridLayout, {
                margin: { top: notCheckbox ? undefined : 'auto' }
            });
            if (notCheckbox) {
                const lbFieldName = new Label(pnlFormGroup, { caption: fieldName });
                lbFieldName.classList.add('form-label');
            }
            const pnlFormControl = new Panel(pnlFormGroup, { margin: { top: notCheckbox ? undefined : 10 } });
            let controlElm: any;
            if (options) {
                controlElm = new ComboBox(pnlFormControl, {
                    items: options,
                    selectedItem: defaultValue,
                    icon: { name: 'caret-down', width: '16px', height: '16px' }
                });
            } else if (type === 'boolean') {
                controlElm = new Checkbox(pnlFormControl, {
                    caption: fieldName,
                    checked: !!defaultValue
                });
            } else {
                controlElm = new Input(pnlFormControl, {
                    inputType: type === 'number' ? 'number' : 'text',
                    value: defaultValue || ''
                });
            }
            _controls[field] = controlElm;
            controlElm.options['ignore-field'] = true;
            const iconRemove = new Icon(pnlFormControl, {
                name: 'times-circle',
                visible: false,
                width: 12,
                height: 12,
                position: notCheckbox ? 'absolute' : 'relative',
                fill: Theme.colors.secondary.main,
                tooltip: {
                    content: 'Remove this property',
                    trigger: 'hover',
                }
            });
            if (notCheckbox) {
                iconRemove.top = 10;
                iconRemove.right = 0;
            } else {
                iconRemove.margin = { left: 4 };
                iconRemove.style.verticalAlign = '-2px';
            }
            iconRemove.onClick = () => {
                if (controlElm.tagName === 'I-CHECKBOX') {
                    controlElm.checked = false;
                } else if (controlElm.tagName === 'I-COMBO-BOX') {
                    controlElm.value = options && options[0];
                } else if (controlElm.tagName === 'I-INPUT') {
                    controlElm.value = '';
                }
                controlElm.options['ignore-field'] = true;
                iconRemove.visible = false;
                this.updateJsonData();
            }
            controlElm.onChanged = () => {
                iconRemove.visible = true;
                controlElm.options['ignore-field'] = false;
                if (controlElm.tagName === 'I-INPUT' && controlElm.value === '') {
                    iconRemove.visible = false;
                }
                this.updateJsonData();
            }

        }
        return vStack;
    }

    private addSchemaByType(parentFields: string[], dataType: IDataType) {
        switch (dataType) {
            case 'object':
                return this.renderObjectSchema(parentFields, dataType);
            case 'array':
                return this.renderArraySchema(parentFields, dataType);
            case 'string':
                return this.renderStringSchema(parentFields, dataType);
            case 'number':
            case 'integer':
                return this.renderNumberSchema(parentFields, dataType);
            case 'boolean':
                return this.renderBooleanSchema(parentFields, dataType);
            default:
                return [];
        }
    }

    private renderObjectSchema(parentFields: string[], dataType: IDataType) {
        const pnlObjectSchema = new Panel(undefined, {
            margin: { top: parentFields.length ? 20 : 0 }
        });
        pnlObjectSchema.appendChild(this.renderSchema(parentFields, objectSchema, dataType));
        return pnlObjectSchema;
    }

    private renderStringSchema(parentFields: string[], dataType: IDataType) {
        const pnlStringSchema = new Panel(undefined, {
            margin: { top: 20 }
        });
        pnlStringSchema.appendChild(this.renderSchema(parentFields, stringSchema, dataType));
        const gridLayout = new GridLayout(pnlStringSchema, {
            templateColumns: ['1fr', '1fr'],
            verticalAlignment: 'start',
            gap: { column: 10, row: 10 }
        });
        gridLayout.appendChild(this.renderOneOf(parentFields, 'text'));
        gridLayout.appendChild(this.renderEnum(parentFields, 'text'));
        return pnlStringSchema;
    }

    private renderNumberSchema(parentFields: string[], dataType: IDataType) {
        const pnlNumberSchema = new Panel(undefined, {
            margin: { top: 20 }
        });
        pnlNumberSchema.appendChild(this.renderSchema(parentFields, numberSchema, dataType));
        const gridLayout = new GridLayout(pnlNumberSchema, {
            templateColumns: ['1fr', '1fr'],
            verticalAlignment: 'start',
            gap: { column: 10, row: 10 }
        });
        gridLayout.appendChild(this.renderOneOf(parentFields, 'number'));
        gridLayout.appendChild(this.renderEnum(parentFields, 'number'));
        return pnlNumberSchema;
    }

    private renderBooleanSchema(parentFields: string[], dataType: IDataType) {
        const pnlBooleanSchema = new Panel(undefined, {
            margin: { top: 20 }
        });
        pnlBooleanSchema.appendChild(this.renderSchema(parentFields, booleanSchema, dataType));
        return pnlBooleanSchema;
    }

    private renderArraySchema(parentFields: string[], dataType: IDataType) {
        const pnlPrefixItems = new Panel(undefined, {
            width: 'calc(50% - 5px)'
        });
        let itemsType: string = 'object';
        const options = [
            { label: 'object', value: 'object' },
            { label: 'string', value: 'string' },
            { label: 'number', value: 'number' },
            { label: 'false', value: false }
        ]
        const cbbItemsType = new ComboBox(undefined, {
            items: options,
            selectedItem: options[0],
            icon: { name: 'caret-down', width: '16px', height: '16px' },
        });
        const setEnableActions = (parentElm: Panel, enabled: boolean) => {
            if (!parentElm) return;
            const hStackAdd = parentElm.querySelector(`[role='add-new-item']`) as HStack;
            if (hStackAdd) {
                const btnAddItem = hStackAdd.querySelector(`[action='add-field']`) as Icon;
                hStackAdd.visible = enabled;
                if (btnAddItem) {
                    btnAddItem.enabled = enabled;
                }
            }
        }
        cbbItemsType.onChanged = async () => {
            const selectedItem = cbbItemsType.selectedItem as IComboItem;
            const value = selectedItem.value;
            if (itemsType !== value) {
                const parentElm = cbbItemsType.closest('.data-schema') as Panel;
                const subItemsElm = parentElm.querySelectorAll(":scope > i-panel > [role='sub-items']");
                for (const subElm of subItemsElm) {
                    const btnDelete = subElm.querySelector("[action='delete']") as Button;
                    if (btnDelete) {
                        btnDelete.click();
                    }
                }
                if (value === 'object') {
                    pnlPrefixItems.clearInnerHTML();
                    setEnableActions(parentElm, true);
                    this.updateControls(controls, [...parentFields, 'prefixItems']);
                    pnlPrefixItems.visible = false;
                    this.updateControls(controls, [...parentFields, 'items'], { 'type': value });
                } else {
                    setEnableActions(parentElm, false);
                    pnlPrefixItems.visible = true;
                    if (value.toString() === 'false') {
                        this.updateControls(controls, [...parentFields, 'items'], false);
                    } else {
                        this.updateControls(controls, [...parentFields, 'items'], { 'type': value });
                        if (itemsType === 'object') {
                            pnlPrefixItems.clearInnerHTML();
                            pnlPrefixItems.appendChild(this.renderPrefixItems(parentFields));
                        }
                    }
                }
                itemsType = value;
                await this.updateJsonData();
                this.uiSchemaPanel.deleteUISchema(parentFields, true);
            }
        }
        const formArr = this.renderSchema(parentFields, arraySchema, dataType);
        this.updateControls(controls, [...parentFields, 'items', 'type'], cbbItemsType);
        const pnlArrSchema = new Panel(undefined, {
            margin: { top: 20 }
        });
        pnlArrSchema.appendChild(formArr);
        const hStackArr = new HStack(pnlArrSchema, {
            gap: 10,
            margin: { top: 10 },
            width: '100%'
        });
        const pnlFormGroup = new Panel(hStackArr, {
            width: 'calc(50% - 5px)',
            minWidth: 180
        });
        pnlFormGroup.classList.add('form-group');
        const lbItems = new Label(pnlFormGroup, {
            caption: 'Items'
        });
        lbItems.classList.add('form-label');
        const pnlItems = new Panel(pnlFormGroup);
        pnlItems.classList.add('form-control');
        pnlItems.appendChild(cbbItemsType);
        hStackArr.appendChild(pnlPrefixItems);
        return pnlArrSchema;
    }

    private async initUI() {
        const panel = await Panel.create({
            width: '100%',
            height: '100%',
            padding: { top: 12, bottom: 12, left: 16, right: 16 }
        }, this);
        const tabs = await Tabs.create({
            mode: 'horizontal'
        }, panel);
        const pnlData = await Panel.create({ height: '100%' });
        this.pnlUISchema = await Panel.create({ height: '100%' });
        tabs.add({ caption: 'Data Schema', children: pnlData });
        tabs.add({ caption: 'UI Schema (Optional)', children: this.pnlUISchema });
        tabs.activeTabIndex = 0;
        const gridLayout = await GridLayout.create({
            position: 'relative',
            width: '100%',
            height: '100%',
            templateColumns: ['5.5fr', '4.5fr'],
            gap: { column: 10, row: 10 }
        }, pnlData);
        this.pnlSchemaBuilder = await Panel.create({
            height: '100%',
            overflow: 'auto'
        }, gridLayout);
        this.pnlSchemaBuilder.classList.add('cs-webkit--scrollbar');
        const pnlJsonData = await Panel.create({ height: '100%' }, gridLayout);
        this.txtSchema = await Input.create({
            inputType: 'textarea',
            rows: 10,
            readOnly: true,
            width: '100%'
        }, pnlJsonData);
        this.txtSchema.classList.add('cs-json--text');
        this.uiSchemaPanel = new SchemaDesignerUI(this.pnlUISchema);
        // this.uiSchemaPanel.uuid = this.uuid;
        this.createDataSchema(this.pnlSchemaBuilder, 'object');
        this.updateJsonData();
    }
}
