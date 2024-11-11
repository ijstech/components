import {
    Container,
    ControlElement,
    customElements
} from '@ijstech/base';
import { Panel, VStack, HStack, GridLayout } from '@ijstech/layout';
import { Label } from '@ijstech/label';
import { Input } from '@ijstech/input';
import { ComboBox, IComboItem } from '@ijstech/combo-box';
import { Checkbox } from '@ijstech/checkbox';
import { Button } from '@ijstech/button';
import { Icon } from '@ijstech/icon';
import { ISchemaDesignerData } from './schemaDesigner';
import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

type IUISchemaOptions = 'DEFAULT' | 'GENERATED' | 'REGISTERED' | 'INLINED';
type IUISchemaRuleEffect = 'HIDE' | 'SHOW' | 'ENABLE' | 'DISABLE';
type IUISchemaType = 'VerticalLayout' | 'HorizontalLayout' | 'Group' | 'Categorization' | 'Category' | 'Control';

interface PanelActions extends Panel {
    getData(): ISchemaDesignerUI,
    initRule(): void,
    resetRule(): void,
    resetOptions(): void,
    deleteOptionsUI(): void
    deleteElement(): void,
    initInputProperty(): void
}

export interface ISchemaDesignerUI {
    type: IUISchemaType,
    scope?: string,
    label?: string,
    elements?: ISchemaDesignerUI[],
    options?: { format?: string, readonly?: boolean } | { detail: IUISchemaOptions | { type: IUISchemaType, elements: ISchemaDesignerUI } },
    rule?: IUISchemaRule
}

interface IProperties {
    label: string,
    value: string,
    type: string,
    hasItems?: boolean,
    isOneOf?: boolean,
    isEnum?: boolean
}

interface IRules {
    not?: IRules,
    const?: string | number | boolean,
    minimum?: number,
    exclusiveMaximum?: number,
    enum?: string[] | number[]
}

interface IUISchemaRule {
    effect: IUISchemaRuleEffect,
    condition: {
        scope: string,
        schema: IRules
    }
}

const dataUITypes = [
    { label: 'VerticalLayout', value: 'VerticalLayout' },
    { label: 'HorizontalLayout', value: 'HorizontalLayout' },
    { label: 'Group', value: 'Group' },
    { label: 'Categorization', value: 'Categorization' },
    { label: 'Category', value: 'Category' },
    { label: 'Control', value: 'Control' }
]

@customElements('i-schema-designer-ui')
export class SchemaDesignerUI extends Container {
    private txtUISchema: Input;
    private pnlUISchemaBuilder: Panel;
    private uiSchema: ISchemaDesignerUI;
    schema: ISchemaDesignerData;

    constructor(parent?: Container, options?: ControlElement) {
        super(parent, options);
    }

    protected init() {
        super.init();
        this.initUI();
        this.createUISchema(this.pnlUISchemaBuilder);
        this.updateJsonUISchema();
    }

    refresh() {
        super.refresh();
    }

    getUISchema(): ISchemaDesignerUI {
        return this.uiSchema;
    }

    private updateJsonUISchema() {
        this.uiSchema = (this.pnlUISchemaBuilder.firstChild as PanelActions).getData();
        this.txtUISchema.value = JSON.stringify(this.uiSchema, null, 4);
    }

    private async getUISchemaMap(_schema: any, _options?: { _scope?: string, _name?: string, _scopeArr?: string, _isRule?: boolean, _getScope?: string }) {
        let data = _schema || this.schema;
        data = { ...data };
        const { _scope, _name, _scopeArr, _isRule, _getScope } = _options || {};
        if (_scopeArr) {
            const scopes = _scopeArr.split('/');
            scopes.splice(0, 1);
            for (const item of scopes) {
                data = data[item];
            }
            data = data.items;
        }
        let mapSchema: IProperties[] = [];
        const props = data.properties;
        for (const prop in props) {
            const { type, items, oneOf } = props[prop];
            const scope = `${_scope || '#'}/properties/${prop}`;
            const name = _name ? `${_name}/${prop}` : prop;
            const isArrItems = type === 'array' && items.type === 'object';
            if (_isRule) {
                if (type !== 'object' && type !== 'array' && !this.pnlUISchemaBuilder.querySelector(`[scope-rule='${scope}']`)) {
                    mapSchema.push({ label: name, value: scope, type: type });
                }
            } else {
                if (_getScope && scope === _getScope) {
                    return [{ label: name, value: scope, type: type, hasItems: isArrItems, isOneOf: oneOf?.lenght, isEnum: props[prop].enum?.length }] as IProperties[];
                }
                if (!this.pnlUISchemaBuilder.querySelector(`[scope-element='${scope}']`)) {
                    mapSchema.push({ label: name, value: scope, type: type, hasItems: isArrItems, isOneOf: oneOf?.lenght, isEnum: props[prop].enum?.length });
                } else {
                    continue;
                }
            }
            if (type === 'object') {
                mapSchema.push(...(await this.getUISchemaMap(props[prop], { _scope: scope, _name: name, _isRule })));
            } else if (isArrItems) {
                mapSchema.push(...(await this.getUISchemaMap(items, { _scope: scope, _name: name, _isRule })));
            }
        }
        return mapSchema;
    }

    private getScopeByFields(fields: string[]) {
        let _fields: string[] = [];
        for (const fld of fields) {
            if (_fields[_fields.length - 1] !== this.uuid && fld === 'items') {
                continue;
            }
            _fields.push(fld);
        }
        return _fields;
    }

    async updateActionsItems() {
        const arrCbb = this.pnlUISchemaBuilder.querySelectorAll('[cbb-property]');
        const items = await this.getUISchemaMap(this.schema);
        for (const cbb of arrCbb) {
            const scopeArr = cbb.getAttribute('cbb-property-array');
            if (scopeArr) {
                (cbb as ComboBox).items = await this.getUISchemaMap(this.schema, { _scopeArr: scopeArr });
            } else {
                (cbb as ComboBox).items = items;
            }
        }
        // const arrBtnAdd = this.pnlUISchemaBuilder.querySelectorAll('[add-element]');
        // const status = !!items.length;
        // for (const btn of arrBtnAdd) {
        //     (btn as Button).enabled = status;
        //     if (status) {
        //         (btn as Button).tooltip.content = '';
        //     } else {
        //         (btn as Button).tooltip.content = 'There is no properties';
        //     }
        // }
    }

    async updateActionsRules() {
        const arrCbb = this.pnlUISchemaBuilder.querySelectorAll('[cbb-rule]');
        const items = await this.getUISchemaMap(this.schema, { _isRule: true });
        for (const cbb of arrCbb) {
            (cbb as ComboBox).items = items;
        }
    }

    async updateUISchemaItemsByRename(fields: string[], newFields: string[]) {
        const _fields = this.getScopeByFields(fields);
        const _newFields = this.getScopeByFields(newFields);
        const regexUUID = new RegExp(this.uuid, 'g');
        const scope = `#/${_fields.join('/').replace(regexUUID, 'properties')}`;
        const newScope = `#/${_newFields.join('/').replace(regexUUID, 'properties')}`;
        const picked = this.pnlUISchemaBuilder.querySelector(`[scope-element='${scope}']`);
        const childPicked = this.pnlUISchemaBuilder.querySelectorAll(`[scope-element*='${scope}/']`);
        const rulePicked = this.pnlUISchemaBuilder.querySelector(`[scope-rule='${scope}']`);
        const ruleChildPicked = this.pnlUISchemaBuilder.querySelectorAll(`[scope-rule*='${scope}/']`);
        const arrPicked = this.pnlUISchemaBuilder.querySelector(`[cbb-property-array='${scope}']`);
        const arrChildPicked = this.pnlUISchemaBuilder.querySelectorAll(`[full-scope-element*='${scope}']`);
        const items = await this.getUISchemaMap(this.schema);
        const ruleItems = await this.getUISchemaMap(this.schema, { _isRule: true });
        const regexLabel = new RegExp(`${this.uuid}/`, 'g');
        const label = `${_fields.join('/').replace(regexLabel, '')}`;
        const newLabel = `${_newFields.join('/').replace(regexLabel, '')}`;
        if (picked) {
            picked.setAttribute('scope-element', newScope);
            (picked as any).options['scope-element'] = newScope;
            (picked as ComboBox).items = items;
            (picked as ComboBox).selectedItem = { label: newLabel, value: newScope };
        }
        for (const _picked of childPicked) {
            const childScope = _picked.getAttribute('scope-element') || '';
            const newChildScope = childScope.replace(scope, newScope);
            const currentLabel = ((_picked as ComboBox).selectedItem as IComboItem).label || '';
            const _newLb = currentLabel.replace(label, newLabel);
            _picked.setAttribute('scope-element', newChildScope);
            (_picked as any).options['scope-element'] = newChildScope;
            (_picked as ComboBox).items = items;
            (_picked as ComboBox).selectedItem = { label: _newLb, value: newChildScope };
        }
        if (arrPicked) {
            arrPicked.setAttribute('cbb-property-array', newScope);
            (arrPicked as any).options['cbb-property-array'] = newScope;
        }
        for (const _itemPick of arrChildPicked) {
            const fullScope = _itemPick.getAttribute('full-scope-element') || '';
            if (fullScope === scope) {
                _itemPick.setAttribute('full-scope-element', newScope);
                (_itemPick as any).options['full-scope-element'] = newScope;
                const scopeLength = (_itemPick.getAttribute('scope-element') || '').split('/').length - 1;
                const arrNewScope = newScope.split('/');
                arrNewScope.splice(0, arrNewScope.length - scopeLength);
                const list = await this.getUISchemaMap(this.schema, { _scopeArr: _itemPick.getAttribute('cbb-property-array') || '' });
                (_itemPick as ComboBox).items = list;
                _itemPick.setAttribute('scope-element', `#/${arrNewScope.join('/')}`);
                (_itemPick as any).options['scope-element'] = `#/${arrNewScope.join('/')}`;
                (_itemPick as ComboBox).clear();
                (_itemPick as ComboBox).selectedItem = { label: list.find(v => v.value === `#/${arrNewScope.join('/')}`)?.label || '', value: `#/${arrNewScope.join('/')}` };

            } else if (fullScope.includes(`${scope}/`)) {
                _itemPick.setAttribute('full-scope-element', fullScope.replace(scope, newScope));
                (_itemPick as any).options['full-scope-element'] = fullScope.replace(scope, newScope);
            }
        }
        if (rulePicked) {
            rulePicked.setAttribute('scope-rule', newScope);
            (rulePicked as any).options['scope-rule'] = newScope;
            (rulePicked as ComboBox).items = ruleItems;
            (rulePicked as ComboBox).selectedItem = { label: newLabel, value: newScope };
        }
        for (const _rulePicked of ruleChildPicked) {
            const childScope = _rulePicked.getAttribute('scope-rule') || '';
            const newChildScope = childScope.replace(scope, newScope);
            const currentLabel = ((_rulePicked as ComboBox).selectedItem as IComboItem).label || '';
            const _newLb = currentLabel.replace(label, newLabel);
            _rulePicked.setAttribute('scope-rule', newChildScope);
            (_rulePicked as any).options['scope-rule'] = newChildScope;
            (_rulePicked as ComboBox).items = ruleItems;
            (_rulePicked as ComboBox).selectedItem = { label: _newLb, value: newChildScope };
        }
        await this.updateActionsItems();
        await this.updateActionsRules();
        this.updateJsonUISchema();
    }

    async updateUISchemaByType(fields: string[], isOption?: boolean) {
        const _fields = this.getScopeByFields(fields);
        const regexUUID = new RegExp(this.uuid, 'g');
        const scope = `#/${_fields.join('/').replace(regexUUID, 'properties')}`;
        if (isOption) {
            const picked = this.pnlUISchemaBuilder.querySelector(`[scope-element='${scope}']`);
            if (picked) {
                const parentPicked = picked.closest('[item-element]') as PanelActions;
                parentPicked?.resetOptions();
            }
        }
        const rulePicked = this.pnlUISchemaBuilder.querySelector(`[scope-rule='${scope}']`);
        if (rulePicked) {
            const ruleItems = await this.getUISchemaMap(this.schema, { _isRule: true });
            const currentItem = ruleItems.find(v => v.value === scope);
            if (currentItem) {
                (rulePicked as ComboBox).selectedItem = currentItem;
                const parentPicked = rulePicked.closest('[item-element]') as PanelActions;
                parentPicked?.initRule();
            }
        }
        this.updateActionsItems();
        this.updateActionsRules();
        this.updateJsonUISchema();
    }

    deleteUISchema(fields: string[], onlyChild?: boolean) {
        const _fields = this.getScopeByFields(fields);
        const regexUUID = new RegExp(this.uuid, 'g');
        const scope = `#/${_fields.join('/').replace(regexUUID, 'properties')}`;
        const picked = this.pnlUISchemaBuilder.querySelector(`[scope-element='${scope}']`);
        if (!onlyChild) {
            if (picked) {
                (picked.closest('[item-element]') as PanelActions)?.deleteElement();
            } else {
                const fullPicked = this.pnlUISchemaBuilder.querySelector(`[full-scope-element='${scope}']`);
                (fullPicked?.closest('[item-element]') as PanelActions)?.deleteElement();
            }
        } else {
            (picked?.closest('[item-element]') as PanelActions)?.resetOptions();
        }
        const childPicked = this.pnlUISchemaBuilder.querySelectorAll(`[scope-element*='${scope}/']`);
        const childPickedArr = this.pnlUISchemaBuilder.querySelectorAll(`[cbb-property-array='${scope}']`);
        for (const _picked of childPicked) {
            (_picked.closest('[item-element]') as PanelActions)?.deleteElement();
        }
        for (const _picked of childPickedArr) {
            (_picked.closest('[item-element]') as PanelActions)?.deleteElement();
        }
        const rulePicked = this.pnlUISchemaBuilder.querySelector(`[scope-rule='${scope}']`);
        if (rulePicked) {
            (rulePicked.closest('[item-element]') as PanelActions)?.resetRule();
        }
        const ruleChildPicked = this.pnlUISchemaBuilder.querySelectorAll(`[scope-rule*='${scope}/']`);
        for (const _rulePicked of ruleChildPicked) {
            (_rulePicked.closest('[item-element]') as PanelActions)?.resetRule();
        }
        this.updateActionsRules();
    }

    private createUISchema(parent: Panel, parentType?: IUISchemaType, isChildren?: boolean, scopeArr?: string) {
        const pnlUISchema = new Panel() as PanelActions;
        pnlUISchema.setAttribute('item-element', 'true');

        parent.append(pnlUISchema);
        const pnlUIElements = new Panel(undefined, {
            padding: { top: 10, bottom: 10, left: 10, right: 10 }
        });
        const btnAddElement = new Button(undefined, {
            caption: 'Add Element',
            padding: { top: 6, bottom: 6, left: 16, right: 16 },
            margin: { top: 8 },
            maxWidth: 150,
            visible: !isChildren
        });
        // btnAddElement.enabled = !!this.getUISchemaMap(this.schema).length;
        btnAddElement.prepend(new Icon(undefined, {
            name: 'plus',
            width: '1em',
            height: '1em',
            fill: Theme.colors.primary.contrastText,
        }));
        btnAddElement.onClick = () => {
            this.createUISchema(pnlUIElements, currentLayout, true);
            this.updateJsonUISchema();
        }
        btnAddElement.setAttribute('add-element', 'true');
        let currentLayout: IUISchemaType = 'VerticalLayout';

        // Rule
        let useRule = false;
        let effect: IUISchemaRuleEffect = 'HIDE';
        let ruleScope: string | undefined = undefined;
        let cbbRuleScope: ComboBox;
        let ruleNegative = false;
        let ruleConst: any = undefined;
        let ruleMinimum: number | string | undefined = undefined;
        let ruleMaximum: number | string | undefined = undefined;
        let listEnum: any[] = [];
        const listEffect = [
            { label: 'HIDE', value: 'HIDE' },
            { label: 'SHOW', value: 'SHOW' },
            { label: 'DISABLE', value: 'DISABLE' },
            { label: 'ENABLE', value: 'ENABLE' }
        ]
        const pnlRule = new Panel(undefined, {
            margin: { top: 10 },
            visible: false
        });
        if (isChildren) {
            const ckbRule = new Checkbox(pnlRule, {
                caption: 'Rule',
                checked: false
            });
            ckbRule.onChanged = () => {
                const checked = ckbRule.checked;
                if (checked === useRule) return;
                if (checked) {
                    createRuleSchemaUI();
                } else {
                    deleteRuleSchemaUI();
                }
                pnlRuleForm.visible = checked;
                useRule = checked;
                this.updateJsonUISchema();
            }
            const pnlRuleForm = new Panel(pnlRule, { visible: false });
            pnlRuleForm.classList.add('cs-ui--schema');
            const createRuleSchemaUI = async () => {
                pnlRuleForm.clearInnerHTML();
                const pnlFormGroup = new Panel(pnlRuleForm, {
                    width: 'calc(50% - 5px)'
                });
                pnlFormGroup.classList.add('form-group');
                new Label(pnlFormGroup, { caption: 'Effect' });
                const pnlFormControl = new Panel(pnlFormGroup);
                pnlFormControl.classList.add('form-control');
                const cbbEffect = new ComboBox(pnlFormControl, {
                    items: listEffect,
                    selectedItem: listEffect[0],
                    icon: { name: 'caret-down', width: '16px', height: '16px' }
                });
                cbbEffect.onChanged = () => {
                    effect = (cbbEffect.selectedItem as IComboItem).value as IUISchemaRuleEffect;
                    this.updateJsonUISchema();
                }
                cbbRuleScope = new ComboBox(undefined, {
                    items: await this.getUISchemaMap(this.schema, { _isRule: true }),
                    icon: { name: 'caret-down', width: '16px', height: '16px' }
                });
                const initRule = (ignoreValue?: boolean) => {
                    const selectedItem = cbbRuleScope?.selectedItem as IComboItem;
                    if (!ignoreValue && ruleScope === selectedItem.value) return;
                    createRuleFormSchemaUI(selectedItem);
                    ruleScope = selectedItem.value;
                    iconRemoveRuleScope.visible = true;
                    cbbRuleScope.setAttribute('scope-rule', ruleScope);
                    (cbbRuleScope as any).options['scope-rule'] = ruleScope;
                    this.updateJsonUISchema();
                    this.updateActionsRules();
                }
                pnlUISchema.initRule = () => initRule(true);
                cbbRuleScope.setAttribute('cbb-rule', 'true');
                cbbRuleScope.onChanged = () => initRule();
                const iconRemoveRuleScope = new Icon(undefined, {
                    name: 'times-circle',
                    visible: false,
                    width: 12,
                    height: 12,
                    fill: Theme.colors.secondary.main,
                    tooltip: {
                        content: 'Remove this property',
                        trigger: 'hover',
                    }
                });
                iconRemoveRuleScope.onClick = () => {
                    iconRemoveRuleScope.visible = false;
                    resetRule();
                    this.updateJsonUISchema();
                }
                const pnlRuleFormGroup = new Panel(pnlRuleForm, {
                    width: 'calc(50% - 5px)'
                });
                pnlRuleFormGroup.classList.add('form-group');
                new Label(pnlRuleFormGroup, { caption: 'Scope' });
                const pnlRuleFormControl = new Panel(pnlRuleFormGroup);
                pnlRuleFormControl.classList.add('form-control');
                const hStackRule = new HStack(pnlRuleFormControl, {
                    gap: 4,
                    verticalAlignment: 'center'
                });
                hStackRule.appendChild(cbbRuleScope);
                hStackRule.appendChild(iconRemoveRuleScope);
                const pnlRuleSchema = new Panel(pnlRuleForm, { width: '100%' });
                pnlRuleSchema.classList.add('cs-ui--schema');
                const createRuleFormSchemaUI = (item: any) => {
                    pnlRuleSchema.clearInnerHTML();
                    const inputType = item.type === 'string' ? 'text' : 'number';
                    let controlConst: any = [];
                    let iconRemoveConst: any = [];
                    ruleConst = undefined;
                    ruleNegative = false;
                    ruleScope = undefined;
                    ruleMinimum = undefined;
                    ruleMaximum = undefined;
                    listEnum = [];
                    if (item.type === 'boolean') {
                        controlConst = new ComboBox(undefined, {
                            items: [
                                { label: 'true', value: 'true' },
                                { label: 'false', value: 'false' }
                            ],
                            icon: { name: 'caret-down', width: '16px', height: '16px' }
                        });
                        controlConst.onChanged = () => {
                            iconRemoveConst.visible = true;
                            ruleConst = (controlConst.selectedItem as IComboItem).value === 'true' ? true : false;
                            this.updateJsonUISchema();
                        }
                        iconRemoveConst = new Icon(undefined, {
                            name: 'times-circle',
                            visible: false,
                            width: 12,
                            height: 12,
                            fill: Theme.colors.secondary.main,
                            tooltip: {
                                content: 'Remove this property',
                                trigger: 'hover',
                            }
                        });
                        iconRemoveConst.onClick = () => {
                            controlConst.clear();
                            ruleConst = undefined;
                            iconRemoveConst.visible = false;
                            this.updateJsonUISchema();
                        }
                    }
                    const pnlFormGroup = new Panel(pnlRuleSchema, { width: 'calc(50% - 5px)' });
                    pnlFormGroup.classList.add('form-group');
                    new Label(pnlFormGroup, { caption: 'Const' });
                    const pnlFormControl = new Panel(pnlFormGroup);
                    pnlFormControl.classList.add('form-control');
                    if (item.type === 'boolean') {
                        const hStack = new HStack(pnlFormControl, {
                            gap: 4,
                            verticalAlignment: 'center'
                        });
                        hStack.appendChild(controlConst);
                        hStack.appendChild(iconRemoveConst);
                    } else {
                        const inputConst = new Input(pnlFormControl, { inputType });
                        inputConst.onChanged = () => {
                            const val = inputConst.value;
                            if (inputType === 'text') {
                                ruleConst = val;
                            } else {
                                ruleConst = (val === '' || isNaN(val)) ? '' : Number(val);
                            }
                            this.updateJsonUISchema();
                        }
                    }
                    if (['number', 'integer'].includes(item.type)) {
                        const pnlFormGroupMin = new Panel(pnlRuleSchema, { width: 'calc(50% - 5px)' });
                        new Label(pnlFormGroupMin, { caption: 'Minimum' });
                        const pnlFormControlMin = new Panel(pnlFormGroupMin);
                        pnlFormControlMin.classList.add('form-control');
                        const inputMin = new Input(pnlFormControlMin, { inputType });
                        inputMin.onChanged = () => {
                            ruleMinimum = inputMin.value;
                            this.updateJsonUISchema();
                        }

                        const pnlFormGroupMax = new Panel(pnlRuleSchema, { width: 'calc(50% - 5px)' });
                        new Label(pnlFormGroupMax, { caption: 'Exclusive Maximum' });
                        const pnlFormControlMax = new Panel(pnlFormGroupMax);
                        pnlFormControlMax.classList.add('form-control');
                        const inputMax = new Input(pnlFormControlMax, { inputType });
                        inputMax.onChanged = () => {
                            ruleMaximum = inputMax.value;
                            this.updateJsonUISchema();
                        }
                    }

                    const pnlFormGroupNegative = new Panel(pnlRuleSchema, { width: 'calc(50% - 5px)', display: 'flex' });
                    const pnlFormControlNegative = new Panel(pnlFormGroupNegative, { margin: { top: 'auto' } });
                    pnlFormControlNegative.classList.add('form-control');
                    const ckbNegative = new Checkbox(pnlFormControlNegative, {
                        caption: 'Negative',
                        checked: false
                    });
                    ckbNegative.onChanged = () => {
                        ruleNegative = ckbNegative.checked;
                        this.updateJsonUISchema();
                    }
                    if (['string', 'number', 'integer'].includes(item.type)) {
                        const hStackEnum = new HStack(undefined, {
                            gap: 8,
                            verticalAlignment: 'center',
                            wrap: 'wrap'
                        });
                        const btnAdd = new Button(undefined, {
                            caption: 'Add',
                            enabled: false,
                            padding: { top: 6, bottom: 6, left: 16, right: 16 },
                        });
                        const inputEnum = new Input(undefined, {
                            inputType: inputType,
                        });
                        inputEnum.classList.add('cs-width--input');
                        inputEnum.onChanged = () => {
                            const val = inputEnum.value;
                            if (item.type === 'string') {
                                btnAdd.enabled = val && !listEnum.some(v => v.toString().toLowerCase() === val.toString().toLowerCase());
                            } else {
                                btnAdd.enabled = val !== '' && !isNaN(Number(val)) && !listEnum.some(v => v === Number(val));
                            }
                        }
                        btnAdd.onClick = () => {
                            const val = inputEnum.value;
                            if (((inputType === 'number' && !isNaN(val)) || inputType === 'text' && val) && !listEnum.some(v => v.toString().toLowerCase() === val.toString().toLowerCase())) {
                                listEnum.push(inputType === 'number' ? Number(val) : val);
                                inputEnum.value = '';
                                btnAdd.enabled = false;
                                const pnlEnum = new Panel(hStackEnum, {
                                    position: 'relative',
                                    display: 'flex',
                                    padding: { top: 8, bottom: 8, left: 16, right: 16 },
                                    border: { radius: 8 },
                                    background: { color: Theme.action.selected }
                                });
                                const iconTimesEnum = new Icon(pnlEnum, {
                                    name: 'times',
                                    width: 14,
                                    height: 14,
                                    fill: Theme.colors.secondary.main,
                                    position: 'absolute',
                                    right: 2,
                                    top: 2
                                });
                                iconTimesEnum.onClick = () => {
                                    const idx = listEnum.findIndex(v => v.toString().toLowerCase() === val.toString().toLowerCase());
                                    listEnum.splice(idx, 1);
                                    iconRemove.visible = !!listEnum.length;
                                    hStackEnum.removeChild(pnlEnum);
                                    this.updateJsonUISchema();
                                }
                                const lbVal = new Label(pnlEnum, {
                                    caption: val,
                                    font: { size: '12px' },
                                    minWidth: 20,
                                    padding: { top: 0, bottom: 0, left: 0, right: 0 }
                                });
                                lbVal.classList.add('cs-enum--value');
                                iconRemove.visible = true;
                                this.updateJsonUISchema();
                            }
                        }
                        let iconRemove: any = [];
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
                        iconRemove.onClick = () => {
                            hStackEnum.clearInnerHTML();
                            listEnum.splice(0, listEnum.length);
                            iconRemove.visible = false;
                            this.updateJsonUISchema();
                        }
                        const pnlFormGroupEnum = new Panel(pnlRuleSchema, { width: 'calc(50% - 5px)' });
                        pnlFormGroupEnum.classList.add('form-group', 'cs-box--enum');
                        pnlFormGroupEnum.appendChild(iconRemove);
                        const lbEnum = new Label(pnlFormGroupEnum, { caption: 'Enum' });
                        lbEnum.classList.add('form-label');
                        const pnlFormControlEnum = new Panel(pnlFormGroupEnum);
                        pnlFormControlEnum.classList.add('form-control');
                        pnlFormControlEnum.appendChild(hStackEnum);
                        const hStackInputEnum = new HStack(pnlFormControlEnum, {
                            gap: 8,
                            wrap: 'wrap',
                            verticalAlignment: 'center'
                        });
                        hStackInputEnum.appendChild(inputEnum);
                        hStackInputEnum.appendChild(btnAdd);
                    }
                }
            }
            const deleteRuleSchemaUI = () => {
                ruleConst = undefined;
                effect = 'HIDE';
                ruleScope = undefined;
                ruleNegative = false;
                ruleMinimum = undefined;
                ruleMaximum = undefined;
                listEnum = [];
                pnlRuleForm.clearInnerHTML();
            }
            const resetRule = () => {
                deleteRuleSchemaUI();
                createRuleSchemaUI();
                this.updateActionsRules();
                this.updateJsonUISchema();
            }
            pnlUISchema.resetRule = () => resetRule();
        }

        const getRule = () => {
            let condition = {
                scope: ruleScope ? (cbbRuleScope.selectedItem as IComboItem)?.value as string : '',
                schema: {} as IRules
            };
            let _schema = {} as IRules;
            if (ruleConst !== undefined && ruleConst !== '') {
                _schema.const = ruleConst;
            }
            if (ruleMinimum !== '' && !isNaN(Number(ruleMinimum))) {
                _schema.minimum = Number(ruleMinimum);
            }
            if (ruleMaximum !== '' && !isNaN(Number(ruleMaximum))) {
                _schema.exclusiveMaximum = Number(ruleMaximum);
            }
            if (listEnum.length) {
                _schema.enum = listEnum;
            }
            if (ruleNegative) {
                condition.schema.not = _schema;
            } else {
                condition.schema = _schema;
            }
            return {
                effect,
                condition
            }
        }

        // Options - array only
        let useOptions = false;
        let isItemsArray = false;
        let optionReadonly = false;
        let optionRadio = false;
        let currentOptions: IUISchemaOptions = 'DEFAULT';
        let currentOptionsLayout: IUISchemaType = 'VerticalLayout';
        let formOptionsDetail: Panel | null;
        const pnlArrayOption = new Panel(undefined, {
            margin: { top: 10 },
            visible: false
        });
        const createOptionsUI = (_scopeArr: string, _isItemsArray: boolean, _showRadio: boolean) => {
            isItemsArray = _isItemsArray;
            useOptions = false;
            optionReadonly = false;
            optionRadio = false;
            const pnlOptions = new Panel();
            pnlArrayOption.clearInnerHTML();
            pnlArrayOption.appendChild(pnlOptions);
            currentOptions = 'DEFAULT';
            const checkboxOptions = new Checkbox(pnlOptions, {
                caption: 'Options',
                checked: false
            });
            checkboxOptions.onChanged = () => {
                if (checkboxOptions.checked) {
                    pnlOptions.appendChild(pnlFormOptions);
                    useOptions = true;
                } else {
                    pnlOptions.removeChild(pnlFormOptions);
                    useOptions = false;
                }
                this.updateJsonUISchema();
            }
            const pnlFormOptions = new Panel();
            pnlFormOptions.classList.add('cs-ui--schema');
            if (!isItemsArray) {
                const pnlFormGroupReadOnly = new Panel(pnlFormOptions, { margin: { top: 5 } });
                pnlFormOptions.classList.add('form-group');
                const pnlFormControlReadOnly = new Panel(pnlFormGroupReadOnly);
                pnlFormControlReadOnly.classList.add('form-control');
                const ckbReadOnly = new Checkbox(pnlFormControlReadOnly, {
                    caption: 'Read Only',
                    checked: false
                });
                ckbReadOnly.onChanged = () => {
                    optionReadonly = ckbReadOnly.checked;
                    this.updateJsonUISchema();
                }
                if (_showRadio) {
                    const pnlFormGroupRadio = new Panel(pnlFormOptions, { margin: { top: 5 } });
                    pnlFormOptions.classList.add('form-group');
                    const pnlFormControlRadio = new Panel(pnlFormGroupRadio);
                    pnlFormControlRadio.classList.add('form-control');
                    const ckbRadio = new Checkbox(pnlFormControlRadio, {
                        caption: 'Radio',
                        checked: false
                    });
                    ckbRadio.onChanged = () => {
                        optionRadio = ckbRadio.checked;
                        this.updateJsonUISchema();
                    }
                }
                return;
            }
            const listOptions = [
                { label: 'DEFAULT', value: 'DEFAULT' },
                { label: 'GENERATED', value: 'GENERATED' },
                { label: 'REGISTERED', value: 'REGISTERED' },
                { label: 'INLINED', value: 'INLINED' }
            ];
            const pnlSelectOpt = new Panel(pnlFormOptions, { width: '100%' });
            const pnlFormGroupOpt = new Panel(pnlSelectOpt);
            pnlFormGroupOpt.classList.add('form-group');
            const lbOpt = new Label(pnlFormGroupOpt, { caption: 'Options' });
            lbOpt.classList.add('form-label');
            const pnlFormControlOpt = new Panel(pnlFormGroupOpt);
            pnlFormControlOpt.classList.add('form-control');
            const cbbOpt = new ComboBox(pnlFormControlOpt, {
                items: listOptions,
                selectedItem: listOptions[0],
                icon: { name: 'caret-down', width: '16px', height: '16px' }
            });
            cbbOpt.onChanged = () => {
                const value = (cbbOpt.selectedItem as IComboItem).value;
                if (value === currentOptions) return;
                if (value === 'INLINED') {
                    pnlSelectOpt.width = 'calc(50% - 5px)';
                    pnlFormOptions.appendChild(pnlType);
                    pnlFormOptions.appendChild(pnlDetail);
                } else if (currentOptions === 'INLINED') {
                    pnlSelectOpt.width = '100%';
                    pnlFormDetail.clearInnerHTML();
                    pnlFormOptions.removeChild(pnlType);
                    pnlFormOptions.removeChild(pnlDetail);
                }
                currentOptions = value as IUISchemaOptions;
                this.updateJsonUISchema();
            }
            const listItems = dataUITypes.filter(v => ['VerticalLayout', 'HorizontalLayout'].includes(v.value));
            currentOptionsLayout = 'VerticalLayout';
            const pnlType = new Panel(undefined, { width: 'calc(50% - 5px)' });
            const pnlFormGroupType = new Panel(pnlType);
            pnlFormGroupType.classList.add('form-group');
            const lbType = new Label(pnlFormGroupType, { caption: 'Type' });
            lbType.classList.add('form-label');
            const pnlFormControlType = new Panel(pnlFormGroupType);
            pnlFormControlType.classList.add('form-control');
            const cbbType = new ComboBox(pnlFormControlType, {
                items: listItems,
                selectedItem: listItems[0],
                icon: { name: 'caret-down', width: '16px', height: '16px' }
            });
            cbbType.onChanged = () => {
                const value = (cbbType.selectedItem as IComboItem).value as IUISchemaType;
                if (value === currentOptionsLayout) return;
                currentOptionsLayout = value;
                this.updateJsonUISchema();
            }
            const btnAddElement = new Button(undefined, {
                caption: 'Add Element',
                padding: { top: 6, bottom: 6, left: 16, right: 16 },
                margin: { top: 8 },
                maxWidth: 150
            });
            // btnAddElement.enabled = !!this.getUISchemaMap(this.schema).length;
            btnAddElement.prepend(new Icon(undefined, {
                name: 'plus',
                width: '1em',
                height: '1em',
                fill: Theme.colors.primary.contrastText,
            }));
            const pnlFormDetail = new Panel(undefined, {
                padding: { top: 10, bottom: 10, left: 10, right: 10 }
            });
            formOptionsDetail = pnlFormDetail;
            btnAddElement.onClick = () => {
                let scopeArr = _scopeArr;
                if (scopeArr) {
                    scopeArr = ((pnlProperty.querySelector('[cbb-property]') as ComboBox)?.selectedItem as IComboItem)?.value || '';
                }
                this.createUISchema(pnlFormDetail, currentOptionsLayout, true, scopeArr);
                this.updateJsonUISchema();
            }
            const pnlDetail = new Panel(undefined, { width: '100%' });
            pnlDetail.appendChild(btnAddElement);
            pnlDetail.appendChild(pnlFormDetail);
        }

        const deleteOptionsUI = () => {
            useOptions = false;
            formOptionsDetail = null;
            pnlArrayOption.clearInnerHTML();
        }

        const getOptionsUI = () => {
            if (!useOptions) return undefined;
            if (!isItemsArray) {
                let options: { format?: string, readonly?: boolean } = {};
                if (optionReadonly) {
                    options.readonly = optionReadonly;
                }
                if (optionRadio) {
                    options.format = 'radio';
                }
                return options;
            }
            if (currentOptions !== 'INLINED') {
                return {
                    detail: currentOptions
                }
            }
            let elements: any = [];
            const arrElm = formOptionsDetail?.childNodes || [];
            for (const subElm of arrElm) {
                elements.push((subElm as PanelActions).getData());
            }
            return {
                detail: {
                    type: currentOptionsLayout,
                    elements
                }
            }
        }

        let typeOptions: { label: string, value: string }[] = [];
        if (isChildren) {
            if (parentType === 'Categorization') {
                typeOptions = dataUITypes.filter(v => v.value === 'Category');
                currentLayout = 'Category';
            } else {
                typeOptions = dataUITypes.filter(v => v.value !== 'Categorization' && v.value !== 'Category');
            }
        } else {
            typeOptions = dataUITypes.filter(v => v.value !== 'Control' && v.value !== 'Category');
        }
        const pnlCbb = new Panel(undefined, {
            width: currentLayout === 'Category' ? 'calc(50% - 5px)' : '100%',
            minWidth: 100
        });
        pnlCbb.classList.add('form-group');
        const lbType = new Label(pnlCbb, {
            caption: 'Type'
        });
        lbType.classList.add('form-label');
        const pnlCbbType = new Panel(pnlCbb);
        pnlCbbType.classList.add('form-control');
        const cbbType = new ComboBox(pnlCbbType, {
            items: typeOptions,
            selectedItem: typeOptions.find(v => v.value === currentLayout),
            icon: { name: 'caret-down', width: '16px', height: '16px' }
        });
        cbbType.onChanged = () => {
            const selectedItem = cbbType.selectedItem as IComboItem;
            const value = selectedItem.value as IUISchemaType;
            if (value === currentLayout) return;
            if (value === 'Control') {
                pnlUIElements.clearInnerHTML();
                if (!pnlLabelWrapper.hasChildNodes()) {
                    pnlLabelWrapper.append(pnlLabel);
                }
                pnlLabelWrapper.visible = true;
                inputLabel.value = '';
                initInputProperty();
                pnlProperty.visible = true;
                pnlProperty.width = 'calc(33.33% - 7px)';
                pnlCbb.width = 'calc(33.33% - 7px)';
                pnlLabelWrapper.width = 'calc(33.33% - 7px)';
                btnAddElement.visible = false;
                btnAddElement.enabled = false;
            } else {
                if (!isChildren && (currentLayout === 'Categorization' || value === 'Categorization')) {
                    pnlUIElements.clearInnerHTML();
                }
                if (['Group', 'Category'].includes(value)) {
                    if (!pnlLabelWrapper.hasChildNodes()) {
                        pnlLabelWrapper.append(pnlLabel);
                    }
                    if (!['Group', 'Category'].includes(currentLayout)) {
                        inputLabel.value = value;
                    }
                    if (!inputLabel.value) {
                        inputLabel.value = value;
                    }
                    pnlLabelWrapper.visible = true;
                    pnlLabelWrapper.width = 'calc(50% - 5px)';
                    pnlCbb.width = 'calc(50% - 5px)';
                } else {
                    pnlLabelWrapper.clearInnerHTML();
                    pnlLabelWrapper.visible = false;
                    pnlCbb.width = '100%';
                }
                pnlProperty.clearInnerHTML();
                pnlProperty.visible = false;
                // const hasProperties = !!this.getUISchemaMap(this.schema).length;
                const hasProperties = true;
                btnAddElement.visible = (hasProperties && isExpanded) || !isChildren;
                btnAddElement.enabled = hasProperties;
                if (currentLayout === 'Control') {
                    this.updateActionsItems();
                }
            }
            currentLayout = value;
            pnlArrayOption.clearInnerHTML();
            this.updateJsonUISchema();
        }
        const pnlLabelWrapper = new Panel(undefined, {
            width: 'calc(50% - 5px)',
            minWidth: 100
        });
        pnlLabelWrapper.visible = currentLayout === 'Category';
        const pnlLabel = new Panel();
        pnlLabel.classList.add('form-group');
        const lbLabel = new Label(pnlLabel, {
            caption: 'Label'
        });
        lbLabel.classList.add('form-label');
        const inputLabel = new Input(undefined, { inputType: 'text' });
        inputLabel.onChanged = () => {
            this.updateJsonUISchema();
        }
        const pnlInputLabel = new Panel(pnlLabel);
        pnlInputLabel.classList.add('form-control');
        pnlInputLabel.appendChild(inputLabel);
        if (currentLayout === 'Category') {
            pnlLabelWrapper.append(pnlLabel);
        }

        let currentProperty = '';
        const pnlProperty = new Panel(undefined, {
            width: 'calc(50% - 5px)',
            minWidth: 100
        });
        pnlProperty.visible = false;
        pnlProperty.classList.add('form-group');
        const initInputProperty = async () => {
            currentProperty = '';
            pnlProperty.clearInnerHTML();
            const lbProperty = new Label(pnlProperty, {
                caption: 'Property'
            });
            lbProperty.classList.add('form-label');
            let scopeArrInput = scopeArr;
            if (scopeArrInput) {
                scopeArrInput = ((parent.closest('[item-element]')?.querySelector('[cbb-property]') as ComboBox)?.selectedItem as IComboItem)?.value || '';
            }
            const cbbProperty = new ComboBox(undefined, {
                items: await this.getUISchemaMap(this.schema, { _scopeArr: scopeArrInput}),
                icon: { name: 'caret-down', width: '16px', height: '16px' }
            });
            cbbProperty.setAttribute('cbb-property', 'true');
            if (scopeArrInput) {
                cbbProperty.setAttribute('cbb-property-array', scopeArrInput);
            }
            cbbProperty.onChanged = () => {
                const selectedItem = cbbProperty.selectedItem as IProperties;
                const value = selectedItem.value as IUISchemaType;
                if (currentProperty === value) return;
                iconClear.visible = true;
                deleteOptionsUI();
                createOptionsUI(value, !!(selectedItem.type === 'array' && selectedItem.hasItems), !!(selectedItem.isEnum || selectedItem.isOneOf));
                cbbProperty.setAttribute('scope-element', value);
                (cbbProperty as any).options['scope-element'] = value;
                if (scopeArr) {
                    const parentScope = ((parent.closest('[item-element]')?.querySelector('[cbb-property]') as ComboBox)?.selectedItem as IComboItem)?.value || '';
                    cbbProperty.setAttribute('full-scope-element', `${parentScope}${value.substring(1, value.length)}`);
                    (cbbProperty as any).options['full-scope-element'] = `${parentScope}${value.substring(1, value.length)}`;
                }
                currentProperty = value;
                const childPicked = this.pnlUISchemaBuilder.querySelectorAll(`[scope-element*='${value}/']`);
                for (const _picked of childPicked) {
                    (_picked.closest('[item-element]') as PanelActions)?.initInputProperty();
                }
                this.updateActionsItems();
                this.updateJsonUISchema();
            }
            const iconClear = new Icon(undefined, {
                name: 'times-circle',
                width: 12,
                height: 12,
                fill: Theme.colors.secondary.main,
                visible: false
            });
            iconClear.onClick = () => {
                iconClear.visible = false;
                deleteOptionsUI();
                initInputProperty();
                this.updateJsonUISchema();
            }
            const resetOptions = async () => {
                const selectedItem = cbbProperty.selectedItem as IProperties;
                const value = selectedItem.value as IUISchemaType;
                const newSelectedItem = (await this.getUISchemaMap(this.schema, { _scopeArr: scopeArrInput, _getScope: value }))[0];
                if (newSelectedItem) {
                    cbbProperty.selectedItem = newSelectedItem;
                    const { type, hasItems, isOneOf, isEnum } = newSelectedItem;
                    deleteOptionsUI();
                    createOptionsUI(value, !!(type === 'array' && hasItems), !!(isEnum || isOneOf));
                }
                this.updateActionsRules();
                this.updateJsonUISchema();
            }
            pnlUISchema.resetOptions = () => resetOptions();
            const hStackProperty = new HStack(pnlProperty, {
                gap: 4,
                verticalAlignment: 'center'
            });
            hStackProperty.classList.add('form-control');
            hStackProperty.appendChild(cbbProperty);
            hStackProperty.appendChild(iconClear);
        }
        const getData = () => {
            let data: ISchemaDesignerUI = {
                type: currentLayout
            };
            if (currentLayout === 'Control') {
                const _scp = ((pnlProperty.querySelector('[cbb-property]') as ComboBox)?.selectedItem as IComboItem)?.value || '';
                if (!_scp) return null;
                data.scope = ((pnlProperty.querySelector('[cbb-property]') as ComboBox)?.selectedItem as IComboItem)?.value || '';
                if (inputLabel.value) {
                    data.label = inputLabel.value;
                }

                if (useOptions) {
                    const options = getOptionsUI();
                    if (options && Object.keys(options).length) {
                        data.options = options;
                    }
                }
            } else {
                if (['Group', 'Category'].includes(currentLayout)) {
                    data.label = inputLabel.value || currentLayout;
                }
                let elements: any = [];
                const arrElm = pnlUISchema.querySelectorAll(":scope > i-panel > i-panel > [item-element]");
                for (const subElm of arrElm) {
                    const data = (subElm as PanelActions).getData();
                    if (data !== null) {
                        elements.push(data);
                    }
                }
                data.elements = elements;
            }
            if (useRule) {
                data.rule = getRule();
            }
            return data;
        }
        const deleteElement = () => {
            parent.removeChild(pnlUISchema);
            this.updateActionsItems();
            this.updateActionsRules();
            this.updateJsonUISchema();
        }
        pnlUISchema.getData = () => getData() as ISchemaDesignerUI;
        pnlUISchema.deleteElement = () => deleteElement();
        pnlUISchema.initInputProperty = () => initInputProperty();
        pnlUISchema.deleteOptionsUI = () => deleteOptionsUI();
        let btnDelete: any = [];
        let btnExpand: any = [];
        let iconExpand: any = [];
        let isExpanded = false;
        const onExpand = () => {
            isExpanded = !isExpanded;
            pnlArrayOption.visible = isExpanded;
            pnlRule.visible = isExpanded;
            btnAddElement.visible = currentLayout !== 'Control' && isExpanded;
            btnExpand.caption = isExpanded ? 'Hide' : 'Show';
            iconExpand.name = isExpanded ? 'angle-up' : 'angle-down';
        }
        if (isChildren) {
            btnDelete = new Button(undefined, {
                caption: 'Delete',
                background: { color: `${Theme.colors.secondary.main} !important` },
                display: 'flex',
                width: '100%',
                height: 28,
                padding: { top: 6, bottom: 6, left: 12, right: 12 },
            });
            btnDelete.prepend(new Icon(undefined, {
                name: 'trash',
                width: '1em',
                height: '1em',
                fill: Theme.colors.primary.contrastText,
            }));
            btnDelete.onClick = () => { deleteElement() };
            btnExpand = new Button(undefined, {
                caption: 'Show',
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
        }
        const pnlDataSchema = new Panel(pnlUISchema, {
            border: { width: 1, style: 'solid', color: '#DADDE1', radius: '1em' },
            padding: { top: 10, bottom: 10, left: 10, right: 10 },
            margin: { top: isChildren ? 10 : 0, bottom: isChildren ? 10 : 0 }
        });
        pnlDataSchema.classList.add('data-schema');
        const vStack = new VStack(pnlDataSchema, {
            gap: 10,
            width: '100%',
            verticalAlignment: 'center'
        });
        const hStack = new HStack(vStack, {
            gap: 10,
            verticalAlignment: 'center'
        });
        const vStackItem = new VStack(hStack, {
            gap: 10,
            width: isChildren ? 'calc(100% - 120px)' : '100%',
            verticalAlignment: 'center'
        });
        const pnlItem = new Panel(vStackItem);
        pnlItem.classList.add('cs-ui--schema');
        pnlItem.appendChild(pnlCbb);
        if (isChildren) {
            pnlItem.appendChild(pnlProperty);
            const hStackButtons = new HStack(hStack, {
                gap: 10,
                wrap: 'wrap',
                width: 100
            });
            hStackButtons.appendChild(btnDelete);
            hStackButtons.appendChild(btnExpand);
        }
        pnlItem.appendChild(pnlLabelWrapper);
        pnlDataSchema.appendChild(pnlRule);
        pnlDataSchema.appendChild(pnlArrayOption);
        pnlDataSchema.appendChild(btnAddElement);
        pnlDataSchema.appendChild(pnlUIElements);
        return pnlUISchema;
    }

    private initUI() {
        const gridLayout = new GridLayout(this, {
            position: 'relative',
            width: '100%',
            height: '100%',
            templateColumns: ['5.5fr', '4.5fr'],
            gap: { column: 10, row: 10 }
        });
        this.pnlUISchemaBuilder = new Panel(gridLayout, {
            height: '100%',
            overflow: 'auto'
        });
        this.pnlUISchemaBuilder.classList.add('cs-webkit--scrollbar');
        const pnlJsonUI = new Panel(gridLayout, { height: '100%' });
        this.txtUISchema = new Input(pnlJsonUI, {
            inputType: 'textarea',
            rows: 10,
            readOnly: true,
            width: '100%'
        });
        this.txtUISchema.classList.add('cs-json--text');
    }
}
