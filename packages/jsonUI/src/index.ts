import { Control } from '@ijstech/base';
import { Checkbox } from '@ijstech/checkbox';
import { Button } from '@ijstech/button'
import { Panel, HStack, GridLayout, VStack } from '@ijstech/layout';
import { Tab, Tabs } from '@ijstech/tab';
import { Input } from '@ijstech/input';
import { Label } from '@ijstech/label';
import { Datepicker } from '@ijstech/datepicker';
import { ComboBox } from '@ijstech/combo-box';
import { Switch } from '@ijstech/switch';
import { Icon } from '@ijstech/icon';
import { Upload } from '@ijstech/upload';
import { Theme } from '@ijstech/style';
import { jsonUICheckboxStyle, jsonUIComboboxStyle, jsonUITabStyle } from './styles/jsonUI.css';
import { moment, Moment } from '@ijstech/moment';
import { JSONSchema } from '@ijstech/types';
// JSON Schema 4

// UI Schema

export type IUISchemaType = 'VerticalLayout' | 'HorizontalLayout' | 'Group' | 'Categorization' | 'Category' | 'Control';

export type IUISchemaRulesEffect = 'HIDE' | 'SHOW' | 'DISABLE' | 'ENABLE';

export interface IUISchemaRulesCondition {
    scope: string;
    schema: {
        [key: string]: any;
    }
}

export interface IUISchema {
    type: IUISchemaType;
    elements?: IUISchema[];
    label?: string | boolean;
    scope?: string;
    rule?: IUISchemaRules;
    options?: IUISchemaOptions;
}

export interface IUISchemaOptions {
    detail?: 'DEFAULT' | 'GENERATED' | 'REGISTERED' | IUISchema;
    showSortButtons?: boolean;
    elementLabelProp?: string;
    format?: 'date' | 'time' | 'date-time' | 'radio';
    slider?: boolean;
    multi?: boolean;
    color?: boolean;
    restrict?: boolean;
    showUnfocusedDescription?: boolean;
    hideRequiredAsterisk?: boolean;
    toggle?: boolean;
    readonly?: boolean;
    autocomplete?: boolean;
    variant?: 'stepper';
}

export interface IUISchemaRules {
    effect?: IUISchemaRulesEffect;
    condition?: IUISchemaRulesCondition
}

interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

interface ValidationError {
    property: string;
    scope: string;
    message: string;
}

const primitiveConstructors = {
    String: String,
    Boolean: Boolean,
    Number: Number,
    Object: Object,
    Array: Array,
    Date: Date
}

const checkPropertyChange = (value: any, schema: JSONSchema.IDataSchema, property: string): ValidationResult | null => {
    return validate(value, schema, { changing: property || "property" });
};
const validate = (instance: any, schema: JSONSchema.IDataSchema, options: any): ValidationResult | null => {
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
            if (typeof (value) === "object") {
                value = value[Object.keys(value)[0]];
                // if the value is null, it will be NaN. NaN can't be checked
                if (isNaN(value) && (schema.type === "number" || schema.type === "integer")) value = ""
            }
            scope = scope + '_' + (i + 1).toString()
        } else {
            // array's item is object
            const parsedPath = path.split('.')
            let parsedScope = scope.split('/')
            let parentProp: string = "";
            if (parsedScope.length > 1) {
                parsedScope = parsedScope.splice(0, parsedScope.length - 2);
                parentProp = parsedScope[parsedScope.length - 1].split('_')[0]
            }
            let idxOfArray: number = -1;
            parsedPath.forEach((value) => {
                if (value.includes(parentProp)) {
                    let matches = value.match(/\[(.*?)\]/);
                    if (matches) idxOfArray = parseInt(matches[1]) + 1;
                }
            })

            if (idxOfArray > 0 && getType(schema) != 'object') {
                scope = scope + '_' + idxOfArray
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
                    addError("is not an instance of the class/constructor " + (schema as any).name, scope);
                }
            } else if (schema) {
                addError("Invalid schema/property definition " + schema, scope);
            }
            return null;
        }
        if (_changing && (schema as JSONSchema.IJSONSchema4 | JSONSchema.IJSONSchema7).readOnly) {
            addError("is a readonly field, it can not be changed", scope);
        }
        if ((schema as JSONSchema.IJSONSchema4)['extends']) { // if it extends another schema, it must pass that schema as well
            checkProp(value, (schema as JSONSchema.IJSONSchema4)['extends'], path, scope, i);
        }

        // validate a value against a type definition
        function checkType(type: JSONSchema.IJSONSchema4TypeName | JSONSchema.IJSONSchema6TypeName | JSONSchema.IJSONSchema7TypeName | JSONSchema.IJSONSchema4TypeName[] | JSONSchema.IJSONSchema6TypeName[] | JSONSchema.IJSONSchema7TypeName[], value: any, scope: string): ValidationError[] {
            if (type) {
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
                        message: value + " - " + (typeof value) + " value found, but a " + type + " is required"
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
        if (value === undefined || value === '' || (value instanceof Array && !value.length)) {
            if (schema.required && typeof schema.required === 'boolean') {
                // addError("is missing and it is required", scope + '_' + idxOfArray);
                addError("is missing and it is required", scope);
            }
        } else {

            // Check if required is an array and type is object
            if (getType(schema) === 'object' && schema.required instanceof Array) {
                for (let requiredField of schema.required) {
                    if (value[requiredField] === undefined || value[requiredField] === '' || (value[requiredField] instanceof Array && !value[requiredField].length)) {
                        addError(`is missing and it is required`, scope + "/properties/" + requiredField, requiredField);
                    }
                }
            }

            errors = errors.concat(checkType(getType(schema), value, scope));
            if (schema.disallow && !checkType(schema.disallow, value, scope).length) {
                addError(" disallowed value was matched", scope);
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
                                var errors2 = checkProp(value[i], propDef, path, scope, i)
                                if (errors2)
                                    errors.concat(errors2);
                            }
                        }
                    }
                    if (schema.minItems && value.length < schema.minItems) {
                        addError("There must be a minimum of " + schema.minItems + " in the array", scope);
                    }
                    if (schema.maxItems && value.length > schema.maxItems) {
                        addError("There must be a maximum of " + schema.maxItems + " in the array", scope);
                    }
                } else if (schema.properties || schema.additionalProperties) {
                    errors.concat(checkObj(value, schema.properties, path, schema.additionalProperties, scope));
                }
                if (schema.items && schema.items.type != "object") {
                    // schema has items and Non-obj array
                    for (let i = 0; i < value.length; i++) {
                        checkProp(value[i], schema.items, path, scope, i, true);
                    }
                }
                if (schema.pattern && typeof value == 'string' && !value.match(schema.pattern)) {
                    addError("does not match the regex pattern " + schema.pattern, scope);
                }
                if (schema.maxLength && typeof value == 'string' && value.length > schema.maxLength) {
                    addError("may only be " + schema.maxLength + " characters long", scope);
                }
                if (schema.minLength && typeof value == 'string' && value.length < schema.minLength) {
                    addError("must be at least " + schema.minLength + " characters long", scope);
                }
                if (typeof schema.minimum !== 'undefined' && typeof value == typeof schema.minimum &&
                    schema.minimum > value) {
                    addError("must have a minimum value of " + schema.minimum, scope);
                }
                if (typeof schema.maximum !== 'undefined' && typeof value == typeof schema.maximum &&
                    schema.maximum < value) {
                    addError("must have a maximum value of " + schema.maximum, scope);
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
                        addError("does not have a value in the enumeration " + enumer.join(", "), scope);
                    }
                }
                if (typeof schema.maxDecimal == 'number' &&
                    (value.toString().match(new RegExp("\\.[0-9]{" + (schema.maxDecimal + 1) + ",}")))) {
                    addError("may only have " + schema.maxDecimal + " digits of decimal places", scope);
                }

                // Todo: Additional validations
                if (value !== '') {
                    if (schema.format === 'wallet-address') {
                        const regex = new RegExp('^((0x[a-fA-F0-9]{40})|([13][a-km-zA-HJ-NP-Z1-9]{25,34})|(X[1-9A-HJ-NP-Za-km-z]{33})|(4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}))$');
                        if (!regex.test(value)) addError("is not a valid wallet address", scope);
                    } else if (schema.format === 'cid') {
                        const regex = new RegExp('^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$');
                        if (!regex.test(value)) addError("is not a valid cid", scope);
                    } else if (schema.format === 'cid-v0') {
                        const regex = new RegExp('^(Qm[1-9A-HJ-NP-Za-km-z]{44,})$');
                        if (!regex.test(value)) addError("is not a valid version 0 cid", scope);
                    } else if (schema.format === 'cid-v1') {
                        const regex = new RegExp('^(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$');
                        if (!regex.test(value)) addError("is not a valid version 1 cid", scope);

                    } else if (schema.format === 'uuid') {
                        const regex = new RegExp('^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$');
                        if (!regex.test(value)) addError('is not a valid uuid', scope);
                    } else if (schema.format === 'url') {
                        const regex = new RegExp('^(https?|ftp)://[^\s/$.?#].[^\s]*$');
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
                errors.push({ property: path, scope: scope, message: "an object is required" });
            }

            for (var i in objTypeDef) {
                if (objTypeDef.hasOwnProperty(i) && i != '__proto__' && i != 'constructor') {
                    var value = instance.hasOwnProperty(i) ? instance[i] : undefined;
                    // skip _not_ specified properties
                    if (value === undefined && options.existingOnly) continue;
                    var propDef = objTypeDef[i];
                    // set default
                    if (value === undefined && propDef["default"]) {
                        value = instance[i] = propDef["default"];
                    }
                    if (options.coerce && i in instance) {
                        value = instance[i] = options.coerce(value, propDef);
                    }
                    checkProp(value, propDef, path, scope + "/properties/" + i, i);
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
                        property: path, message: "The property " + i +
                            " is not defined in the schema and the schema does not allow additional properties",
                        scope: scope
                    });
                }
            }
            var requires = objTypeDef && objTypeDef[i] && objTypeDef[i].requires;
            if (requires && !(requires in instance)) {
                errors.push({
                    property: path,
                    scope: scope,
                    message: "the presence of the property " + i + " requires that " + requires + " also be present"
                });
            }
            value = instance[i];
            if (additionalProp && (!(objTypeDef && typeof objTypeDef == 'object') || !(i in objTypeDef))) {
                if (options.coerce) {
                    value = instance[i] = options.coerce(value, additionalProp);
                }
                checkProp(value, additionalProp, path, scope + "/properties/" + i, i);
            }
            if (!_changing && value && value.$schema) {
                const errors2 = checkProp(value, value.$schema, path, scope + "/properties/" + i, i);
                if (errors2)
                    errors = errors.concat(errors2);
            }
        }
        return errors;
    }

    const root = "#";

    if (schema) {
        checkProp(instance, schema, '', root, _changing || '');
    }
    if (!_changing && instance && instance.$schema) {
        checkProp(instance, instance.$schema, '', root, '');
    }
    return { valid: !errors.length, errors: errors };
};
const mustBeValid = (result: ValidationResult): void => {
    if (!result.valid) {
        throw new TypeError(result.errors.map(function (error) {
            return "for property " + error.property + ': ' + error.message;
        }).join(", \n"));
    }
}

export const DataSchemaValidator = {
    checkPropertyChange,
    mustBeValid,
    validate
}

export interface IRenderUIOptions {
    jsonSchema: JSONSchema.IDataSchema;
    data?: any;
    jsonUISchema?: IUISchema;
    hideConfirmButton?: boolean;
    columnsPerRow?: number;
    showClearButton?: boolean;
    clearButtonCaption?: string;
    confirmButtonCaption?: string;
    confirmButtonBackgroundColor?: string;
    confirmButtonFontColor?: string;
    columnWidth?: string | number;
    clearButtonBackgroundColor?: string;
    clearButtonFontColor?: string;
    dateFormat?: string;
    timeFormat?: string;
    dateTimeFormat?: string;
}

export function renderUI(target: Control, options: IRenderUIOptions,
    confirmCallback?: (result: boolean, data: any) => void, valueChangedCallback?: (data: any, errMsg: string) => void) {

    const defaultDateFormat = options.dateFormat || 'DD/MM/YYYY';
    const defaultTimeFormat = options.timeFormat || 'HH:mm:ss';
    const defaultDateTimeFormat = options.dateTimeFormat || 'DD/MM/YYYY HH:mm:ss';

    const controls: { [key: string]: Control } = {};
    const descriptions: { [key: string]: Label } = {};
    const errorMsgs: { [key: string]: Label } = {};
    const flatRules: { elm: Control, rule: IUISchemaRules }[] = [];

    const validateOnValueChanged = async (idxScope: string) => {
        const data = await getData(options.jsonSchema);
        const validationResult = validate(data, options.jsonSchema, { changing: false })
        let showErrMsg: boolean = false;
        let errMsg: string = "";
        if (validationResult?.valid == false) {
            for (let idx = 0; idx < validationResult.errors.length; idx++) {
                if (validationResult.errors[idx].scope == idxScope) {
                    showErrMsg = true;
                    errMsg = validationResult.errors[idx].message;
                }
            }
        }

        if (showErrMsg == true) {
            if (descriptions.hasOwnProperty(idxScope)) descriptions[idxScope].visible = false;
            if (errorMsgs[idxScope]) {
                errorMsgs[idxScope].caption = errMsg;
                errorMsgs[idxScope].visible = true;
            }
        } else {
            if (descriptions.hasOwnProperty(idxScope)) descriptions[idxScope].visible = true;
            if (errorMsgs[idxScope]) {
                errorMsgs[idxScope].caption = "";
                errorMsgs[idxScope].visible = false;
            }
        }
        valueChangedCallback && valueChangedCallback(data, errMsg);
    }

    // No UI Schema
    const renderForm = (schema: JSONSchema.IDataSchema, scope: string = "#", isArray: boolean = false, idx?: number, schemaOptions?: IUISchemaOptions): Control | undefined => {
        if (!schema) return undefined;
        const currentField = scope.substr(scope.lastIndexOf('/') + 1);
        const labelName = schema.title || (scope != '#/' ? convertFieldNameToLabel(currentField) : '');
        const columnWidth = options.columnWidth ? options.columnWidth : '100px';
        const idxScope = idx !== undefined ? `${scope}_${idx}` : scope;
        const tooltip = schema.tooltip;
        let isRequired = false;
        let arrRequired: string[] = [];
        if (typeof schema.required === 'boolean') {
            isRequired = schema.required;
        } else if (typeof schema.required === 'object') {
            arrRequired = schema.required;
        }
        // Combo Box
        if ((schema.enum && schema.enum.length > 0) || (schema.oneOf && schema.oneOf.length > 0)) {
            const items = [];
            if (schema.oneOf && schema.oneOf.length > 0) {
                for (const item of schema.oneOf) {
                    items.push({
                        label: (item as { title: string, const: string }).title,
                        value: (item as { title: string, const: string }).const
                    });
                }
            } else if (schema.enum && schema.enum.length > 0) {
                for (const item of schema.enum) {
                    items.push({ label: item, value: item });
                }
            }

            const groupPnl = new Panel();
            const hStack = new HStack(groupPnl, { alignItems: 'center', gap: 2 });
            if (!isArray) {
                new Label(hStack, { caption: labelName });
                if (isRequired) {
                    new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
                }
                if (tooltip) {
                    new Icon(hStack, {
                        width: '1rem',
                        height: '1rem',
                        name: 'info-circle',
                        margin: { left: 2 },
                        tooltip: { content: tooltip, placement: 'bottom' }
                    });
                }
            }
            const controlPnl = new Panel(groupPnl);
            let combobox = new ComboBox(controlPnl, {
                width: '100%',
                items: items,
                icon: { name: 'caret-down' },
                readOnly: (schema as JSONSchema.IJSONSchema4 | JSONSchema.IJSONSchema7).readOnly
            })
            combobox.id = idxScope;
            combobox.classList.add(jsonUIComboboxStyle);
            combobox.onChanged = () => validateOnValueChanged(idxScope);
            controls[idxScope] = combobox;
            if (isArray) {
                controls[idxScope].setAttribute('role', 'column');
                controls[idxScope].setAttribute('field', currentField);
            }
            if (schema.description)
                descriptions[idxScope] = new Label(groupPnl, { caption: schema.description });
            errorMsgs[idxScope] = new Label(groupPnl, { visible: false, font: { color: '#ff0000' } });
            return groupPnl
        } else if (schema.type === 'string') {
            // Date Picker
            if (['date', 'time', 'date-time'].indexOf(schema.format || '') >= 0) {
                let datePickerType = schema.format;
                if (schema.format === 'date-time')
                    datePickerType = 'dateTime';
                const groupPnl = new Panel();
                const hStack = new HStack(groupPnl, { alignItems: 'center', gap: 2 });
                if (!isArray) {
                    new Label(hStack, { caption: labelName });
                    if (isRequired) {
                        new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
                    }
                    if (tooltip) {
                        new Icon(hStack, {
                            width: '1rem',
                            height: '1rem',
                            name: 'info-circle',
                            margin: { left: 2 },
                            tooltip: { content: tooltip, placement: 'bottom' }
                        });
                    }
                }
                const controlPnl = new Panel(groupPnl)
                let dateTimeFormat;
                if (schema.format === 'date') {
                    dateTimeFormat = defaultDateFormat;
                }
                else if (schema.format === 'date-time') {
                    dateTimeFormat = defaultDateTimeFormat;
                }
                else if (schema.format === 'time') {
                    dateTimeFormat = defaultTimeFormat;
                }
                const datePicker = new Datepicker(controlPnl, {
                    width: columnWidth,
                    type: datePickerType,
                    dateTimeFormat: dateTimeFormat,
                    readOnly: (schema as JSONSchema.IJSONSchema4 | JSONSchema.IJSONSchema7).readOnly
                });
                datePicker.id = idxScope;
                datePicker.onChanged = () => validateOnValueChanged(idxScope);
                controls[idxScope] = datePicker;
                if (isArray) {
                    controls[idxScope].setAttribute('role', 'column');
                    controls[idxScope].setAttribute('field', currentField);
                    controls[idxScope].setAttribute('format', schema.format || '');
                }
                if (schema.description)
                    descriptions[idxScope] = new Label(groupPnl, { caption: schema.description });
                errorMsgs[idxScope] = new Label(groupPnl, { visible: false, font: { color: '#ff0000' } });
                return groupPnl
            }

            // Uploader
            else if (schema.format === 'data-url') {
                const groupPnl = new Panel();
                const hStack = new HStack(groupPnl, { alignItems: 'center', gap: 2 });
                if (!isArray) {
                    new Label(hStack, { caption: labelName });
                    if (isRequired) {
                        new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
                    }
                    if (tooltip) {
                        new Icon(hStack, {
                            width: '1rem',
                            height: '1rem',
                            name: 'info-circle',
                            margin: { left: 2 },
                            tooltip: { content: tooltip, placement: 'bottom' }
                        });
                    }
                }
                const controlPnl = new Panel(groupPnl);
                let upload = new Upload(controlPnl, {
                    readOnly: (schema as JSONSchema.IJSONSchema4 | JSONSchema.IJSONSchema7).readOnly
                });
                upload.id = idxScope;
                upload.onChanged = () => validateOnValueChanged(idxScope);
                controls[idxScope] = upload;
                if (isArray) {
                    controls[idxScope].setAttribute('role', 'column');
                    controls[idxScope].setAttribute('field', currentField);
                    controls[idxScope].setAttribute('format', schema.format)
                }
                return groupPnl;
            }
            // Input
            else {
                const groupPnl = new Panel()
                const hStack = new HStack(groupPnl, { alignItems: 'center', gap: 2 });
                if (!isArray) {
                    new Label(hStack, { caption: labelName });
                    if (isRequired) {
                        new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
                    }
                    if (tooltip) {
                        new Icon(hStack, {
                            width: '1rem',
                            height: '1rem',
                            name: 'info-circle',
                            margin: { left: 2 },
                            tooltip: { content: tooltip, placement: 'bottom' }
                        });
                    }
                }
                const controlPnl = new Panel(groupPnl);
                let inputType = 'text';

                if (schema.format === 'color')
                    inputType = 'color';
                else if (schema.format === 'multi')
                    inputType = 'textarea';


                let input = new Input(controlPnl, {
                    width: columnWidth,
                    inputType,
                    readOnly: (schema as JSONSchema.IJSONSchema4 | JSONSchema.IJSONSchema7).readOnly
                });
                input.id = idxScope;
                input.onBlur = () => validateOnValueChanged(idxScope);
                controls[idxScope] = input
                if (isArray) {
                    controls[idxScope].setAttribute('role', 'column');
                    controls[idxScope].setAttribute('field', currentField);
                }
                if (schema.description)
                    descriptions[idxScope] = new Label(groupPnl, { caption: schema.description });
                errorMsgs[idxScope] = new Label(groupPnl, { visible: false, font: { color: '#ff0000' } });
                return groupPnl
            }
        }
        // Number Input
        else if (['integer', 'number'].indexOf(schema.type?.toString() || '') >= 0) {
            const groupPnl = new Panel()
            const hStack = new HStack(groupPnl, { alignItems: 'center', gap: 2 });
            if (!isArray) {
                new Label(hStack, { caption: labelName });
                if (isRequired) {
                    new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
                }
                if (tooltip) {
                    new Icon(hStack, {
                        width: '1rem',
                        height: '1rem',
                        name: 'info-circle',
                        margin: { left: 2 },
                        tooltip: { content: tooltip, placement: 'bottom' }
                    });
                }
            }
            const controlPnl = new Panel(groupPnl)
            let inputType = 'number';
            if (schema.type === 'integer')
                inputType = 'integer';
            let input = new Input(controlPnl, {
                width: columnWidth,
                inputType,
                readOnly: (schema as JSONSchema.IJSONSchema4 | JSONSchema.IJSONSchema7).readOnly
            });
            input.id = idxScope;
            input.onBlur = () => validateOnValueChanged(idxScope);
            controls[idxScope] = input;
            if (isArray) {
                controls[idxScope].setAttribute('role', 'column');
                controls[idxScope].setAttribute('field', currentField);
                controls[idxScope].setAttribute('format', inputType)
            }
            if (schema.description)
                descriptions[idxScope] = new Label(groupPnl, { caption: schema.description });
            errorMsgs[idxScope] = new Label(groupPnl, { visible: false, font: { color: '#ff0000' } });
            return groupPnl
        }
        // Checkbox
        else if (schema.type === 'boolean') {
            const groupPnl = new Panel();
            groupPnl.classList.add(jsonUICheckboxStyle);
            const hStack = new HStack(groupPnl, { alignItems: 'center', gap: 2 });
            if (!isArray) {
                new Label(hStack, { caption: labelName });
                if (isRequired) {
                    new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
                }
                if (tooltip) {
                    new Icon(hStack, {
                        width: '1rem',
                        height: '1rem',
                        name: 'info-circle',
                        margin: { left: 2 },
                        tooltip: { content: tooltip, placement: 'bottom' }
                    });
                }
            }
            const controlPnl = new Panel(groupPnl);
            let checkbox = new Checkbox(controlPnl, {
                readOnly: (schema as JSONSchema.IJSONSchema4 | JSONSchema.IJSONSchema7).readOnly
            });
            checkbox.id = idxScope;
            checkbox.onChanged = () => validateOnValueChanged(idxScope);
            controls[idxScope] = checkbox;
            if (isArray) {
                controls[idxScope].setAttribute('role', 'column');
                controls[idxScope].setAttribute('field', currentField);
            }
            return groupPnl;
        }
        // Group Box / Sublevel
        else if (schema.type === 'object') {
            const properties = schema.properties;
            if (!properties) return undefined;
            const groupPnl = new Panel(undefined, {
                border: {
                    width: 1,
                    style: 'solid',
                    color: '#EEE',
                    radius: "0.4rem"
                },
                padding: {
                    top: 16,
                    bottom: 16,
                    left: 16,
                    right: 16
                }
            });
            // const box = new Panel(undefined, borderStyle);
            const templateColumns = [];
            if (options.columnsPerRow)
                for (let i = 0; i < options.columnsPerRow; i++)
                    templateColumns.push('1fr');
            let form = new GridLayout(undefined, {
                templateColumns,
                gap: {
                    row: 10,
                    column: 10
                },
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 10,
                    right: 10
                }
            })
            if (scope !== '#') {
                const pnl = new Panel(groupPnl, {
                    padding: {
                        top: 5,
                        bottom: 5,
                        left: 10,
                        right: 10
                    },
                    border: {
                        bottom: {
                            width: 1,
                            style: 'solid',
                            color: '#CCC',
                            radius: 5
                        }
                    }
                });
                const hStack = new HStack(pnl, { alignItems: 'center', gap: 2 });
                new Label(hStack, { caption: labelName, font: { size: '1.6rem' } });
                if (isRequired) {
                    new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
                }
                if (tooltip) {
                    new Icon(hStack, {
                        width: '1rem',
                        height: '1rem',
                        name: 'info-circle',
                        margin: { left: 2 },
                        tooltip: { content: tooltip, placement: 'bottom' }
                    });
                }
            }
            for (const propertyName in properties) {
                let currentSchema: any = properties[propertyName];
                if (!currentSchema?.required && arrRequired.includes(propertyName)) {
                    currentSchema.required = true;
                }
                const control = renderForm(currentSchema, `${idxScope}/properties/${propertyName}`, false, idx);
                form.append(control as Node);
            }
            groupPnl.append(form);
            controls[idxScope] = groupPnl;
            return groupPnl;
        }
        // Card List
        else if (schema.type === 'array') {
            // Todo: card view editor
            if (!schema.items) return undefined;
            let isVertical = false;
            if (typeof schemaOptions?.detail === 'object') {
                isVertical = schemaOptions.detail.type === 'VerticalLayout';
            }
            const groupPnl = new Panel(undefined, {
                border: {
                    width: 1,
                    style: 'solid',
                    color: '#EEE',
                    radius: "0.4rem"
                },
                padding: {
                    top: 16,
                    bottom: 16,
                    left: 8,
                    right: 8
                }
            });
            groupPnl.setAttribute('role', 'array');
            const arrayField = scope.split('/');
            groupPnl.setAttribute('array-field', arrayField[arrayField.length - 1]);
            groupPnl.setAttribute('array-field-idx', `${idx === undefined ? '' : idx}`);
            const pnlTitle = new HStack(groupPnl, {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 10,
                    right: 10
                },
                border: {
                    bottom: {
                        width: 1,
                        style: 'solid',
                        color: "#DADDE1"
                    },
                },
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'transparent'
            });
            const hStack = new HStack(pnlTitle, { alignItems: 'center', gap: 2 });
            new Label(hStack, { caption: labelName, font: { size: '1rem' } });
            if (isRequired) {
                new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
            }
            if (tooltip) {
                new Icon(hStack, {
                    width: '1rem',
                    height: '1rem',
                    name: 'info-circle',
                    margin: { left: 2 },
                    tooltip: { content: tooltip, placement: 'bottom' }
                });
            }
            const btnAdd = new Icon(new Panel(pnlTitle), {
                name: 'plus',
                fill: Theme.ThemeVars.colors.primary.main,
                width: '1em',
                height: '1em'
            })
            btnAdd.classList.add('pointer');
            btnAdd.setAttribute('role', 'add');
            const pnlItems = new Panel(groupPnl, {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5
                }
            });
            const _items = schema.items as JSONSchema.IDataSchema;
            const itemsRequired = typeof _items?.required === 'object' ? _items.required : [];

            const updateIndex = (props: any, newIdx: number, currentIdx: number, prefixScope: string, newPrefix?: string, subIdx?: number) => {
                for (const propertyName in props) {
                    const subIndex = subIdx || 0;
                    const finalIndex = subIdx ? subIndex : newIdx;
                    const currentScope = `${prefixScope}/properties/${propertyName}_${subIdx ? subIndex : currentIdx}`;
                    const newScope = `${newPrefix || prefixScope}/properties/${propertyName}_${finalIndex}`;
                    if (props[propertyName].type === 'object') {
                        updateIndex(props[propertyName].properties, newIdx, currentIdx, currentScope, newScope);
                    } else if (props[propertyName].type === 'array' && props[propertyName].items?.type === 'object') { //TODO: type is not an object
                        const rows = controls[currentScope]?.querySelectorAll(":scope > i-panel > [role='row']") || [];
                        let _currentItemIdx = 0;
                        while (_currentItemIdx < rows.length) {
                            _currentItemIdx++;
                            updateIndex(props[propertyName].items.properties, newIdx, currentIdx, currentScope, newScope, subIndex + _currentItemIdx);
                        }
                    }

                    const parentLayout = controls[newScope]?.closest('[array-item-idx]') as GridLayout;
                    if (parentLayout) {
                        parentLayout.setAttribute('array-item-idx', `${newIdx}`);
                        parentLayout['options']['array-item-idx'] = `${newIdx}`;
                    }

                    updateSingleIndex(currentScope, newScope, finalIndex);
                }
            }

            const updateNonObjIndex = (newIdx: number, currentIdx: number, prefixScope: string) => {
                const currentScope = `${prefixScope}_${currentIdx}`;
                const newScope = `${prefixScope}_${newIdx}`;
                updateSingleIndex(currentScope, newScope);
            }

            const updateSingleIndex = (currentScope: string, newScope: string, finalIndex?: number) => {
                const tempControl = controls[currentScope];
                controls[newScope] = tempControl;
                if (controls[newScope].id) {
                    controls[newScope].id = newScope;
                } else if (controls[newScope].getAttribute('object-field-idx') && finalIndex != undefined) {
                    controls[newScope].setAttribute('object-field-idx', `${finalIndex}`);
                    controls[newScope]['options']['object-field-idx'] = `${finalIndex}`;
                } else if (controls[newScope].getAttribute('array-field-idx') && finalIndex != undefined) {
                    controls[newScope].setAttribute('array-field-idx', `${finalIndex}`);
                    controls[newScope]['options']['array-field-idx'] = `${finalIndex}`;
                }

                const tempErrMsg = errorMsgs[currentScope];
                if (tempErrMsg) {
                    errorMsgs[newScope] = tempErrMsg;
                    (controls[newScope] as any).onChanged = () => validateOnValueChanged(newScope);
                }

                const tempDescription = descriptions[currentScope];
                if (tempDescription) {
                    descriptions[newScope] = tempDescription;
                }

                delete descriptions[currentScope];
                delete errorMsgs[currentScope];
                delete controls[currentScope];
            }

            const isObject = _items.type === 'object'

            if (!isObject) isVertical = true; // Todo: horizontal non-object item
            const itemType = (schema.items as any)?.type;
            if (isVertical && _items.type) {
                const addCard = () => {
                    const index = groupPnl.querySelectorAll(":scope > i-panel > [role='row']").length + 1;
                    const arrIndex = groupPnl.getAttribute('array-field-idx') || idx;
                    const newIdxScope = idx !== undefined ? `${scope}_${arrIndex}` : scope;
                    const gridSize = (isObject) ? ['1fr', '3fr'] : ['3fr', '1fr'];
                    const gridLayout = new GridLayout(pnlItems, {
                        templateColumns: gridSize,
                        border: {
                            bottom: {
                                width: 1,
                                style: 'solid',
                                color: "#DADDE1"
                            }
                        },
                        padding: {
                            top: 32,
                            bottom: 32,
                            left: 8,
                            right: 8
                        },
                        gap: {
                            row: 10,
                            column: 10
                        },
                    });
                    gridLayout.position = 'relative';
                    gridLayout.setAttribute('role', 'row');
                    gridLayout.setAttribute('array-item-idx', `${index}`);

                    if (isObject == false) {
                        if (schema.required === true) {
                            _items.required = true;
                        }
                        const control = renderForm(_items, `${idxScope}`, true, index);
                        if (control) {
                            control.setAttribute('object-field-idx', `${index}`);
                            if (itemType !== 'array' && itemType !== 'object') {
                                control.setAttribute("single-field", '');
                            }
                            gridLayout.append(control as Node);
                        }
                    } else if (typeof _items === 'object' && _items.type === 'object' && _items.properties) {
                        for (const propertyName in _items.properties) {
                            let property = (schema.items as any).properties[propertyName];
                            if (!property?.required && (arrRequired.includes(propertyName) || itemsRequired.includes(propertyName))) {
                                property.required = true;
                            }
                            const control = renderForm(property, `${newIdxScope}/properties/${propertyName}`, true, index);
                            if (control && property?.type === 'object') {
                                control.setAttribute('object-field', propertyName);
                                control.setAttribute('object-field-idx', `${index}`);
                                if (itemType !== 'array' && itemType !== 'object') {
                                    control.setAttribute("single-field", '');
                                }
                                const lb = control.querySelector(':scope > i-panel') as HTMLElement;
                                if (lb) {
                                    lb.style.display = 'none';
                                }
                            };
                            const hStack = new HStack(undefined, { gap: 2 });
                            const _property = property as JSONSchema.IDataSchema;
                            new Label(hStack, { caption: _property.title || convertFieldNameToLabel(propertyName) });
                            if (_property.required) {
                                new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
                            }
                            gridLayout.append(hStack);
                            gridLayout.append(control as Node);
                        }
                    }
                    // Append delete card
                    const btnDelete = new Icon(undefined, {
                        name: 'times',
                        fill: '#ff0000',
                        width: '1rem',
                        height: '1rem'
                    });
                    if (!isObject) {
                        const hStack = new HStack(gridLayout, {
                            height: '40px',
                            padding: {
                                top: 10,
                                bottom: 10,
                                left: 15,
                                right: 15
                            },
                        });
                        hStack.verticalAlignment = 'center'
                        hStack.horizontalAlignment = 'end'
                        hStack.append(btnDelete)

                    } else {
                        btnDelete.style.top = '5px';
                        btnDelete.style.right = '5px';
                        gridLayout.append(btnDelete)
                    }
                    btnDelete.position = 'absolute';
                    btnDelete.classList.add('pointer');
                    btnDelete.onClick = () => {
                        let currentIdx = Number(gridLayout.getAttribute('array-item-idx') || '1');
                        let newIdx = Number(gridLayout.getAttribute('array-item-idx') || '1');
                        let idxItem = groupPnl.querySelectorAll(":scope > i-panel > [role='row']").length;
                        while (newIdx < idxItem) {
                            currentIdx++;
                            if (isObject) updateIndex(_items.properties, newIdx, currentIdx, newIdxScope);
                            else updateNonObjIndex(newIdx, currentIdx, newIdxScope);
                            newIdx = Number(currentIdx);
                        }
                        gridLayout.remove();
                    }
                }
                btnAdd.onClick = () => {
                    addCard();
                }
                addCard();
            } else {
                let colCount = 0;
                if (schema.items instanceof Array)
                    colCount = schema.items.length;
                else if (typeof schema.items === 'object' && schema.items.type === 'object' && schema.items.properties)
                    colCount = Object.keys(schema.items.properties).length;
                const templateColumns: string[] = [];
                for (let i = 0; i < colCount; i++) templateColumns.push('1fr');
                templateColumns.push('1em')
                const headerColumn = new GridLayout(pnlItems, {
                    templateColumns,
                    border: {
                        top: {
                            width: 1,
                            style: 'solid',
                            color: "#DADDE1"
                        },
                        bottom: {
                            width: 1,
                            style: 'solid',
                            color: "#DADDE1"
                        }
                    },
                    padding: {
                        top: 16,
                        bottom: 16,
                        left: 16,
                        right: 16
                    },
                    gap: {
                        row: 10,
                        column: 10
                    },
                });
                if (schema.items instanceof Array) {
                    for (const item of schema.items) {
                        const _item = item as JSONSchema.IDataSchema;
                        if (_item.title) {
                            const hStack = new HStack(headerColumn, { gap: 2 });
                            new Label(hStack, { caption: _item.title });
                            if (_item.required) {
                                new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
                            }
                        }
                    }
                } else if (typeof schema.items === 'object') {
                    if (schema.items.type === 'object' && schema.items.properties) {
                        // Header
                        for (const propertyName in schema.items.properties) {
                            let property: any = schema.items.properties[propertyName];
                            if (!property?.required && (arrRequired.includes(propertyName) || itemsRequired.includes(propertyName))) {
                                property.required = true;
                            }
                            const hStack = new HStack(headerColumn, { gap: 2 });
                            const _property = property as JSONSchema.IDataSchema;
                            new Label(hStack, { caption: _property.title || convertFieldNameToLabel(propertyName) });
                            if (_property.required) {
                                new Label(hStack, { caption: '*', font: { color: '#ff0000' } });
                            }
                        }
                    }
                }

                // Body
                const addRow = () => {
                    const index = groupPnl.querySelectorAll(":scope > i-panel > [role='row']").length + 1;
                    const arrIndex = groupPnl.getAttribute('array-field-idx') || idx;
                    const newIdxScope = idx !== undefined ? `${scope}_${arrIndex}` : scope;
                    const bodyColumn = new GridLayout(pnlItems, {
                        templateColumns,
                        gap: {
                            row: 10,
                            column: 10
                        },
                        padding: {
                            top: 16,
                            bottom: 16,
                            left: 16,
                            right: 16
                        },
                        border: {
                            bottom: {
                                width: 1,
                                style: "solid",
                                color: "#DADDE1"
                            }
                        }
                    })
                    bodyColumn.setAttribute('role', 'row');
                    bodyColumn.setAttribute('array-item-idx', `${index}`);
                    if (typeof schema.items === 'object' && _items.type === 'object' && _items.properties) {
                        for (const propertyName in _items.properties) {
                            const property = (schema.items as any).properties[propertyName];
                            if (!property?.required && (arrRequired.includes(propertyName) || itemsRequired.includes(propertyName))) {
                                property.required = true;
                            }
                            const control = renderForm(property, `${newIdxScope}/properties/${propertyName}`, true, index);
                            if (control && property?.type === 'object') {
                                control.setAttribute('object-field', propertyName);
                                control.setAttribute('object-field-idx', `${index}`);
                                if (itemType !== 'array' && itemType !== 'object') {
                                    control.setAttribute("single-field", '');
                                }
                                const lb = control.querySelector(':scope > i-panel') as HTMLElement;
                                if (lb) {
                                    lb.style.display = 'none';
                                }
                            };
                            bodyColumn.append(control as Node);
                        }
                        // Append delete row
                        const btnDelete = new Icon(bodyColumn, {
                            name: 'times',
                            fill: '#ff0000',
                            width: '1em',
                            height: '1em',
                            marginBlock: {
                                top: 'auto'
                            }
                        });
                        btnDelete.classList.add('pointer');
                        btnDelete.onClick = () => {
                            let currentIdx = Number(bodyColumn.getAttribute('array-item-idx') || '1');
                            let newIdx = Number(bodyColumn.getAttribute('array-item-idx') || '1');
                            let idxItem = groupPnl.querySelectorAll(":scope > i-panel > [role='row']").length;
                            while (newIdx < idxItem) {
                                currentIdx++;
                                updateIndex(_items.properties, newIdx, currentIdx, newIdxScope);
                                newIdx = Number(currentIdx);
                            }
                            bodyColumn.remove();
                        }
                    }
                }
                addRow();
                btnAdd.onClick = () => { addRow() }
            }
            controls[idxScope] = groupPnl;
            return groupPnl;
        } else if (schema.type === 'null') {
            return undefined;
        } else if (schema.type === 'any') {
            // To do
            return undefined;
        } else return undefined;
    }

    // By UI Schema
    const renderFormBySchema = (dataSchema: JSONSchema.IDataSchema, uiSchema: IUISchema, scope: string = "#") => {
        if (!dataSchema || !uiSchema) return;
        clearUI();

        let uiWrapper = new Panel(target, {
            padding: {
                left: 10,
                right: 10,
                top: 0,
                bottom: 10
            }
        });
        uiWrapper.id = 'uiWrapper'

        let formTabs = new Tabs(uiWrapper, {
            mode: 'vertical'
        })
        formTabs.id = "formTabs"
        formTabs.classList.add(jsonUITabStyle);
        formTabs.visible = ['Categorization', 'Category'].includes(uiSchema.type);
        let ui = createUI(uiSchema);
        if (ui) uiWrapper.append(ui);

        setupRules();
    }

    const setupRules = () => {
        for (const item of flatRules) {
            const { rule, elm } = item;
            if (rule && rule.condition && rule.condition.scope && rule.condition.schema) {
                const control: Control = (document.getElementById(rule.condition.scope) as Control);
                if (control) {
                    const toggleValidate = () => {
                        if (rule.effect === 'HIDE' || rule.effect === 'SHOW') {
                            if ((control as Checkbox | Switch).checked === rule.condition!.schema.const) {
                                elm.visible = rule.effect === 'SHOW';
                            } else {
                                elm.visible = !(rule.effect === 'SHOW');
                            }
                        } else if (rule.effect == 'ENABLE' || rule.effect == 'DISABLE') {
                            if ((control as Checkbox | Switch).checked === rule.condition!.schema.const) {
                                elm.enabled = rule.effect === 'ENABLE';
                            } else {
                                elm.enabled = !(rule.effect === 'ENABLE');
                            }
                        }
                    };
                    if (control.tagName === 'I-CHECKBOX' || control.tagName === 'I-SWITCH') {
                        (control as Checkbox | Switch).onChanged = (target: Control, event: Event) => {
                            toggleValidate();
                        };
                        toggleValidate();
                    }
                }
            }
        }
    }

    const clearUI = () => {
        let uiWrapper = document.getElementById("uiWrapper")
        if (uiWrapper) uiWrapper.innerHTML = "";
    }

    const generateTemplateColumnsByNumber = (count: number) => {
        let columns = [];
        for (let i = 0; i < count; i++) columns.push('1fr');
        return columns;
    }

    const getDataSchemaByScope = (scope: string): [key: string, dataSchema: JSONSchema.IDataSchema] => {
        const segments = scope.split('/');
        let obj: JSONSchema.IDataSchema = {};
        for (const segment of segments) {
            if (segment === '#')
                obj = options.jsonSchema;
            else
                obj = (obj as any)[segment];

        }
        if (obj == undefined) console.log("No corresponding scope:", scope)
        return [segments[segments.length - 1], obj];
    }

    const createUI = (uiSchema: IUISchema, carryData?: any) => {
        if (!uiSchema) return null;
        const { elements, type, scope, label, options, rule } = uiSchema;

        if (type === 'VerticalLayout') {
            const elm = new VStack(undefined, {
                justifyContent: 'center',
                alignItems: 'center'
            })
            if (elements)
                elements.map(v => {
                    let ui = createUI(v);
                    if (ui) elm.append(ui)
                })

            if (rule) flatRules.push({ elm, rule });
            return elm;
        } else if (type === 'HorizontalLayout') {
            const elm = new GridLayout(undefined, {
                width: '100%',
                gap: { column: 16 },
                templateColumns: (elements) ? generateTemplateColumnsByNumber(elements.length) : ""
            })
            if (elements)
                elements.map(v => {
                    let ui = createUI(v);
                    if (ui) elm.append(ui)
                })
            if (rule) flatRules.push({ elm, rule });
            return elm;
        } else if (type === 'Group') {
            const elm = new Panel(undefined, {
                width: '100%'
            })
            elm.classList.add('box')
            if (label !== false && !!label) {
                let boxHeader = new Panel(elm)
                let boxHeaderLabel = new Label(boxHeader, {
                    caption: label
                })
                boxHeaderLabel.classList.add('box-header')
            }
            const boxContent = new Panel(elm)
            boxContent.classList.add('box-content')
            if (elements)
                elements.map(v => {
                    let ui = createUI(v);
                    if (ui) boxContent.append(ui)
                })

            if (rule) flatRules.push({ elm, rule });
            return elm;
        } else if (type === 'Categorization') {
            let elm = new Tabs();
            elm.classList.add(jsonUITabStyle);
            let formTabs = document.getElementById('formTabs') as Tabs;
            if (formTabs) formTabs.visible = true;
            if (elements) {
                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    createUI(element, { tabs: formTabs, index: i });
                }
            }
            elm = formTabs;
            if (rule) flatRules.push({ elm, rule });
            return formTabs;
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
                        let ui = createUI(element)
                        if (ui) children.append(ui);
                    }
                }

                let tabCaption = (typeof caption == 'boolean') ? "" : caption;

                const formTabs = document.getElementById("formTabs") as Tabs
                // (carryData.tabs as Tabs).add({ caption: tabCaption, children: children });
                let tab = formTabs.add({ caption: tabCaption, children: children })
                formTabs.activeTabIndex = 0;

                if (rule) flatRules.push({ elm: tab, rule });
            }
        } else if (type === 'Control' && scope) {

            const [key, dataSchema] = getDataSchemaByScope(scope);
            const stub = new Panel(undefined, {
                padding: {
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 5
                }
            });

            stub.classList.add('form-group')
            let caption, labelElm, descriptionElm;
            let formControlElm = new Panel();
            formControlElm.classList.add('form-control')
            let hideLabel = false;
            if (label !== false) {
                caption = label as string;
                if (!caption)
                    caption = convertFieldNameToLabel(key);
            }

            const control = renderForm(dataSchema, scope, false, undefined, options);
            formControlElm.append(control as Node);

            if (formControlElm)
                stub.append(formControlElm);
            if (descriptionElm)
                stub.append(descriptionElm);
            if (rule) {
                flatRules.push({ elm: stub, rule })
            };
            return stub;
        } else
            return null;
    }

    const setDataUpload = (url: string, control: Upload) => {
        if (!url || !control) return;
        const getImageTypeFromUrl = (url: string) => {
            const extension = url.match(/\.([^.]+)$/);
            switch (extension && extension[1].toLowerCase()) {
              case 'jpg':
              case 'jpeg':
                return 'image/jpeg';
              case 'png':
                return 'image/png';
              case 'gif':
                return 'image/gif';
              case 'svg':
                return 'image/svg';
              default:
                return 'image/png';
            }
        }
        const getExtensionFromType = (fileType: string) => {
            return fileType.split('/')[1];
        }
        try {
            let imgUrl = url;
            if (url.startsWith('ipfs://')) {
                imgUrl = imgUrl.replace('ipfs://', 'https://ipfs.scom.dev/ipfs/');
            }
            fetch(imgUrl)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                const fileType = getImageTypeFromUrl(imgUrl);
                const blob = new Blob([arrayBuffer], { type: fileType });
                const fileName = `image-${Date.now()}.${getExtensionFromType(fileType)}`;
                const file = new File([blob], fileName, { type: fileType });
                control.fileList = [file];
                control.preview(imgUrl);
            });
        } catch {
            control.fileList = [];
        }
    }

    const setData = (schema: JSONSchema.IDataSchema, data: any, scope: string = '#', idx?: number) => {
        if (!schema || (!data && !(schema.type === 'number' && data === 0))) return;

        const idxScope = idx !== undefined ? `${scope}_${idx}` : scope;
        if (schema.type === 'object') {
            if (!schema.properties) return;
            for (const propertyName in schema.properties) {
                setData((schema.properties[propertyName] as any), data[propertyName], `${idxScope}/properties/${propertyName}`, idx);
            }
        }
        else if (schema.type === 'array') {
            if (typeof schema.items === 'object' && (schema.items as JSONSchema.IDataSchema).properties) {
                const grid = controls[idxScope];
                const btnAdd = grid.querySelector("[role='add']");
                let rows = grid.querySelectorAll("[role='row']");
                if (data instanceof Array) {
                    for (let i = 0; i < data.length; i++) {
                        const columnData = data[i];
                        if (btnAdd && i > 0)
                            (btnAdd as any).onClick((btnAdd as Control));
                        if (typeof columnData === 'object') {
                            for (const propertyName in columnData) {
                                const fieldData = columnData[propertyName];
                                rows = grid.querySelectorAll(":scope > i-panel > [role='row']");
                                if (rows) {
                                    const row = rows[rows.length - 1];
                                    const column = row.querySelector(`[role='column'][field='${propertyName}']`);
                                    if (column) {
                                        if (column.tagName === 'I-CHECKBOX') {
                                            (column as Checkbox).checked = fieldData;
                                        } else if (column.tagName === 'I-COMBO-BOX') {
                                            ((column as ComboBox).selectedItem as any) = (column as ComboBox).items.find(v => v.value === fieldData) || undefined;
                                        } else if (column.tagName === 'I-DATEPICKER') {
                                            const format = column.getAttribute('format');
                                            let dateFormat;
                                            if (format === 'date')
                                                dateFormat = defaultDateFormat;
                                            else if (format === 'time')
                                                dateFormat = defaultTimeFormat;
                                            else
                                                dateFormat = defaultDateTimeFormat;
                                            (column as Datepicker).value = moment(fieldData, dateFormat);
                                        } else if (column.tagName === "I-UPLOAD") {
                                            setDataUpload(fieldData, column as Upload);
                                        } else {
                                            (column as any).value = fieldData;
                                        }
                                        continue;
                                    }
                                    const properties = (schema.items as any)?.properties || {};
                                    const objectField = row.querySelector(`:scope > [object-field='${propertyName}']`);
                                    if (objectField) {
                                        const idxObj = objectField.getAttribute('object-field-idx');
                                        setData(properties[propertyName], fieldData, `${idxScope}/properties/${propertyName}`, Number(idxObj));
                                        continue;
                                    }
                                    const arrayField = row.querySelector(`:scope > [array-field='${propertyName}']`);
                                    if (arrayField) {
                                        const idxObj = arrayField.getAttribute('array-field-idx');
                                        setData(properties[propertyName], fieldData, `${idxScope}/properties/${propertyName}`, Number(idxObj));
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                const grid = controls[idxScope];
                const btnAdd = grid.querySelector("[role='add']");
                for (let i = 0; i < data.length; i++) {
                    if (btnAdd && i > 0)
                        (btnAdd as any).onClick((btnAdd as Control));
                    if (typeof (schema.items) != 'boolean' && typeof (schema.items) != 'undefined')
                        setData(schema.items, data[i], `${scope}_${i + 1}`);
                }
            }
        }
        else {
            const control = controls[idxScope];
            if (control.tagName === 'I-CHECKBOX')
                (control as Checkbox).checked = data;
            else if (control.tagName === 'I-DATEPICKER') {
                const format = schema.format;
                let dateFormat;
                if (format === 'date')
                    dateFormat = defaultDateFormat;
                else if (format === 'time')
                    dateFormat = defaultTimeFormat;
                else
                    dateFormat = defaultDateTimeFormat;
                (control as Datepicker).value = moment(data, dateFormat);
            }
            else if (control.tagName === 'I-COMBO-BOX') {
                ((control as ComboBox).selectedItem as any) = (control as ComboBox).items.find(v => v.value === data) || undefined;
            } else if (control.tagName === "I-UPLOAD") {
                setDataUpload(data, control as Upload);
            } else
                (control as Input).value = data;
        }
    }

    const getData = async (schema: JSONSchema.IDataSchema, scope: string = '#', idx?: number) => {
        if (!schema) return null;
        const idxScope = idx !== undefined ? `${scope}_${idx}` : scope;
        if (schema.type === 'object') {
            const properties = schema.properties;
            if (!properties) return undefined;
            const data: any = {};
            for (const propertyName in properties) {
                data[propertyName] = await getData((properties[propertyName] as any), `${idxScope}/properties/${propertyName}`, idx);
            }
            return data;
        } else if (schema.type === 'array') {
            const grid = controls[idxScope];
            if (!grid) return undefined;
            const rows = grid.querySelectorAll("[role='row']");
            if (!rows) return undefined;
            const listData = [];
            for (const row of rows) {
                const parentRow = row.closest("[role='array']");
                if (parentRow !== grid) continue;
                const columns = row.querySelectorAll("[role='column']");
                const objects = row.querySelectorAll(":scope > [object-field]");
                const arrayField = row.querySelectorAll(":scope > [array-field]");
                if (!columns && !objects && !arrayField) continue;
                let columnData: any = {};
                for (const column of columns) {
                    const parentCol = column.closest("[role='row']");
                    if (parentCol !== row) continue;
                    const fieldName = column.getAttribute('field');
                    if (!fieldName) continue;
                    const isSingle = column.closest("[single-field]");
                    if (column.tagName === 'I-CHECKBOX') {
                        columnData[fieldName] = (column as Checkbox).checked;
                    } else if (column.tagName === 'I-COMBO-BOX') {
                        columnData[fieldName] = ((column as ComboBox).value as any)?.value;
                    } else if (column.tagName === 'I-DATEPICKER') {
                        const format = column.getAttribute('format');
                        let dateFormat;
                        if (format === 'date')
                            dateFormat = defaultDateFormat;
                        else if (format === 'time')
                            dateFormat = defaultTimeFormat;
                        else
                            dateFormat = defaultDateTimeFormat;
                        columnData[fieldName] = ((column as Datepicker).value as Moment)?.format(dateFormat) || ''
                    } else if (column.tagName === 'I-UPLOAD') {
                        if (!(column as Upload).fileList || (column as Upload).fileList && (column as Upload).fileList.length === 0) return undefined;
                        columnData[fieldName] = await (column as Upload).toBase64((column as Upload).fileList[0]);
                    } else if (column.tagName === 'I-INPUT') {
                        const format = column.getAttribute('format');
                        if (format === 'number')
                            columnData[fieldName] = parseFloat((column as Input).value);
                        else if (format === 'integer')
                            columnData[fieldName] = parseInt((column as Input).value);
                        else
                            columnData[fieldName] = (column as Input).value;
                    }
                    if (isSingle) {
                        columnData = columnData[fieldName];
                    }
                }
                const properties = (schema.items as any)?.properties || {};
                for (const obj of objects) {
                    const field = obj.getAttribute('object-field');
                    const idxObj = obj.getAttribute('object-field-idx');
                    if (field && properties[field]) {
                        columnData[field] = await getData(properties[field], `${idxScope}/properties/${field}`, Number(idxObj));
                    }
                }
                for (const card of arrayField) {
                    const field = card.getAttribute('array-field');
                    const idxObj = card.getAttribute('array-field-idx');
                    if (field && properties[field]) {
                        columnData[field] = await getData(properties[field], `${idxScope}/properties/${field}`, Number(idxObj));
                    }
                }
                listData.push(columnData);
            }
            return listData;
        } else {
            const control: Control = controls[idxScope];
            if (!control) return undefined;
            if (control.tagName === 'I-CHECKBOX')
                return (control as Checkbox).checked;
            else if (control.tagName === 'I-COMBO-BOX') {
                return ((control as ComboBox).value as any)?.value;
            } else if (control.tagName === 'I-DATEPICKER') {
                const value = (control as Datepicker).value;
                if (value === undefined)
                    return '';
                if (schema.format === 'date')
                    return (value as Moment)?.format(defaultDateFormat) || '';
                else if (schema.format === 'time')
                    return (value as Moment)?.format(defaultTimeFormat) || '';
                else if (schema.format === 'date-time')
                    return (value as Moment)?.format(defaultDateTimeFormat) || '';
            } else if (control.tagName === 'I-UPLOAD') {
                if (!(control as Upload).fileList || (control as Upload).fileList && (control as Upload).fileList.length === 0) return undefined;
                const dataUrl = await (control as Upload).toBase64((control as Upload).fileList[0]);
                return dataUrl;
            } else if (control.tagName === 'I-INPUT') {
                if (schema.type === 'string')
                    return (control as Input).value;
                else if (schema.type === 'integer') {
                    const value = parseInt((control as Input).value);
                    return isNaN(value) ? undefined : value;
                } else if (schema.type === 'number') {
                    const value = parseFloat((control as Input).value);
                    return isNaN(value) ? undefined : value;
                } else
                    return (control as Input).value;
            }
            return (control as any).value;
        }
    }

    const panel = new Panel();
    if (options?.jsonUISchema) {
        renderFormBySchema(options.jsonSchema, options.jsonUISchema)
    } else {
        const form = renderForm(options.jsonSchema);
        panel.append(form as Node);
    }

    const pnlButton = new HStack();
    const confirmButtonCaption = options.confirmButtonCaption ? options.confirmButtonCaption : 'Confirm'
    const buttonStack = new HStack(undefined, {
        justifyContent: 'end',
        alignItems: 'center',
        width: '100%',
        padding: {
            left: 10,
            right: 10,
            top: 5,
            bottom: 5
        }
    })
    if (options.showClearButton) {
        const clearButtonCaption = options.clearButtonCaption ? options.clearButtonCaption : 'Clear';
        const btnClear = new Button(buttonStack, {
            caption: clearButtonCaption,
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
            },
            margin: {
                right: 5
            },
            font: {
                color: (options.clearButtonFontColor ? options.clearButtonFontColor : '#FFF')
            },
            background: {
                color: (options.clearButtonBackgroundColor ? options.clearButtonBackgroundColor : '#3F51B5')
            }
        });
        btnClear.onClick = () => {
            for (const scope in controls) {
                const control = controls[scope];
                if (control.tagName === 'I-COMBO-BOX')
                    (control as ComboBox).clear();
                else if (control.tagName === 'I-CHECKBOX')
                    (control as Checkbox).checked = false;
                else
                    (control as Input).value = undefined;
            }
        }
    }
    if (!options.hideConfirmButton) {
        const btnConfirm = new Button(buttonStack, {
            caption: confirmButtonCaption,
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
            },
            font: {
                color: (options.confirmButtonFontColor ? options.confirmButtonFontColor : '#FFF')
            },
            background: {
                color: (options.confirmButtonBackgroundColor ? options.confirmButtonBackgroundColor : '#3F51B5')
            }
        });
        btnConfirm.onClick = async () => {
            if (!confirmCallback) return;
            const data = await getData(options.jsonSchema);
            const validationResult = validate(data, options.jsonSchema, { changing: false });
            if (validationResult?.valid) confirmCallback(true, data);
            else confirmCallback(false, validationResult);
        }

        panel.append(pnlButton);
    }

    if (target) {
        target.append(panel);
        if (buttonStack.childNodes.length > 0) {
            target.append(buttonStack);
        }
        if (options.data) {
            const validationResult = validate(options.data, options.jsonSchema, { changing: false });
            if (validationResult?.valid)
                setData(options.jsonSchema, options.data);
            else
                console.log(validationResult);
        }
    }
}

function convertFieldNameToLabel(name: string) {
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
