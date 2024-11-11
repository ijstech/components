import {IJSONSchema4TypeName, IJSONSchema4} from './jsonSchema4';
import {IJSONSchema6TypeName, IJSONSchema6} from './jsonSchema6';
import {IJSONSchema7TypeName, IJSONSchema7} from "./jsonSchema7";

export type IUISchemaType = 'VerticalLayout' | 'HorizontalLayout' | 'Group' | 'Categorization' | 'Category' | 'Control';
export type IUISchemaRulesEffect = 'HIDE' | 'SHOW' | 'DISABLE' | 'ENABLE';

export interface IUISchemaRulesCondition {
    scope: string;
    schema: IDataSchema;
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

export interface ValidationError {
    property: string;
    scope: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

export type IDataSchemaTypeName = IJSONSchema4TypeName | IJSONSchema6TypeName | IJSONSchema7TypeName;

export type IDataSchema = IJSONSchema4 & IJSONSchema6 & IJSONSchema7;

export interface IUISchema {
    type: IUISchemaType;
    elements?: IUISchema[];
    label?: string | boolean;
    scope?: string;
    rule?: IUISchemaRules;
    options?: IUISchemaOptions;
}

export interface IInputOptions {
    inputType: string;
    height?: number | string;
    width?: number | string;
    value?: number | string;
    rows?: number;
}
