export type IJSONSchema4TypeName = | 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null' | 'any';
export type IJSONSchema4Type = string | number | boolean | IJSONSchema4Object | IJSONSchema4Array | null;

export interface IJSONSchema4Object {
    [key: string]: IJSONSchema4Type;
}

export interface IJSONSchema4Array extends Array<IJSONSchema4Type> {
}

export type IJSONSchema4Version = string;

export interface IJSONSchema4 {
    id?: string | undefined;
    $ref?: string | undefined;
    $schema?: IJSONSchema4Version | undefined;

    title?: string | undefined;

    description?: string | undefined;
    tooltip?: string | undefined;

    default?: IJSONSchema4Type | undefined;
    multipleOf?: number | undefined;
    maximum?: number | undefined;
    exclusiveMaximum?: boolean | undefined;
    minimum?: number | undefined;
    exclusiveMinimum?: boolean | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;

    additionalItems?: boolean | IJSONSchema4 | undefined;

    items?: IJSONSchema4 | IJSONSchema4[] | undefined;

    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    maxProperties?: number | undefined;
    minProperties?: number | undefined;

    required?: boolean | string[] | undefined;

    additionalProperties?: boolean | IJSONSchema4 | undefined;

    definitions?: {
        [k: string]: IJSONSchema4;
    } | undefined;

    properties?: {
        [k: string]: IJSONSchema4;
    } | undefined;

    patternProperties?: {
        [k: string]: IJSONSchema4;
    } | undefined;
    dependencies?: {
        [k: string]: IJSONSchema4 | string[];
    } | undefined;

    enum?: IJSONSchema4Type[] | undefined;

    type?: IJSONSchema4TypeName | IJSONSchema4TypeName[] | undefined;

    allOf?: IJSONSchema4[] | undefined;
    anyOf?: IJSONSchema4[] | undefined;
    oneOf?: IJSONSchema4[] | undefined;
    not?: IJSONSchema4 | undefined;

    extends?: string | string[] | undefined;

    [k: string]: any;

    format?: string | undefined;
}

// JSON Schema 6
export type IJSONSchema6TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null' | 'any';
export type IJSONSchema6Type = | string | number | boolean | IJSONSchema6Object | IJSONSchema6Array | null;

export interface IJSONSchema6Object {
    [key: string]: IJSONSchema6Type;
}

export interface IJSONSchema6Array extends Array<IJSONSchema6Type> {
}

export type IJSONSchema6Version = string;
export type IJSONSchema6Definition = IJSONSchema6 | boolean;

export interface IJSONSchema6 {
    $id?: string | undefined;
    $ref?: string | undefined;
    $schema?: IJSONSchema6Version | undefined;
    multipleOf?: number | undefined;
    maximum?: number | undefined;
    exclusiveMaximum?: number | undefined;
    minimum?: number | undefined;
    exclusiveMinimum?: number | undefined;
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;
    items?: IJSONSchema6Definition | IJSONSchema6Definition[] | undefined;
    additionalItems?: IJSONSchema6Definition | undefined;
    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    contains?: IJSONSchema6Definition | undefined;
    maxProperties?: number | undefined;
    minProperties?: number | undefined;
    required?: string[] | undefined;
    properties?: {
        [k: string]: IJSONSchema6Definition;
    } | undefined;
    patternProperties?: {
        [k: string]: IJSONSchema6Definition;
    } | undefined;
    additionalProperties?: IJSONSchema6Definition | undefined;
    dependencies?: {
        [k: string]: IJSONSchema6Definition | string[];
    } | undefined;
    propertyNames?: IJSONSchema6Definition | undefined;
    enum?: IJSONSchema6Type[] | undefined;
    const?: IJSONSchema6Type | undefined;
    type?: IJSONSchema6TypeName | IJSONSchema6TypeName[] | undefined;
    allOf?: IJSONSchema6Definition[] | undefined;
    anyOf?: IJSONSchema6Definition[] | undefined;
    oneOf?: IJSONSchema6Definition[] | undefined;
    not?: IJSONSchema6Definition | undefined;
    definitions?: {
        [k: string]: IJSONSchema6Definition;
    } | undefined;
    title?: string | undefined;
    description?: string | undefined;
    tooltip?: string | undefined;
    default?: IJSONSchema6Type | undefined;
    examples?: IJSONSchema6Type[] | undefined;
    format?: string | undefined;
}

// JSON Schema 7
export type IJSONSchema7TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';
export type IJSONSchema7Type = string | number | boolean | IJSONSchema7Object | IJSONSchema7Array | null;

export interface IJSONSchema7Object {
    [key: string]: IJSONSchema7Type;
}

export interface IJSONSchema7Array extends Array<IJSONSchema7Type> {
}

export type IJSONSchema7Version = string;
export type IJSONSchema7Definition = IJSONSchema7 | boolean;

export interface IJSONSchema7 {
    $id?: string | undefined;
    $ref?: string | undefined;
    $schema?: IJSONSchema7Version | undefined;
    $comment?: string | undefined;

    $defs?: {
        [key: string]: IJSONSchema7Definition;
    } | undefined;

    type?: IJSONSchema7TypeName | IJSONSchema7TypeName[] | undefined;
    enum?: IJSONSchema7Type[] | undefined;
    const?: IJSONSchema7Type | undefined;

    multipleOf?: number | undefined;
    maximum?: number | undefined;
    exclusiveMaximum?: number | undefined;
    minimum?: number | undefined;
    exclusiveMinimum?: number | undefined;

    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;

    items?: IJSONSchema7Definition | IJSONSchema7Definition[] | undefined;
    additionalItems?: IJSONSchema7Definition | undefined;
    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    contains?: IJSONSchema7 | undefined;

    maxProperties?: number | undefined;
    minProperties?: number | undefined;
    required?: string[] | undefined;
    properties?: {
        [key: string]: IJSONSchema7Definition;
    } | undefined;
    patternProperties?: {
        [key: string]: IJSONSchema7Definition;
    } | undefined;
    additionalProperties?: IJSONSchema7Definition | undefined;
    dependencies?: {
        [key: string]: IJSONSchema7Definition | string[];
    } | undefined;
    propertyNames?: IJSONSchema7Definition | undefined;

    if?: IJSONSchema7Definition | undefined;
    then?: IJSONSchema7Definition | undefined;
    else?: IJSONSchema7Definition | undefined;

    allOf?: IJSONSchema7Definition[] | undefined;
    anyOf?: IJSONSchema7Definition[] | undefined;
    oneOf?: IJSONSchema7Definition[] | undefined;
    not?: IJSONSchema7Definition | undefined;

    format?: string | undefined;

    contentMediaType?: string | undefined;
    contentEncoding?: string | undefined;

    definitions?: {
        [key: string]: IJSONSchema7Definition;
    } | undefined;
    title?: string | undefined;
    description?: string | undefined;
    tooltip?: string | undefined;
    default?: IJSONSchema7Type | undefined;
    readOnly?: boolean | undefined;
    writeOnly?: boolean | undefined;
    examples?: IJSONSchema7Type | undefined;
};
export type IDataSchema = IJSONSchema4 | IJSONSchema6 | IJSONSchema7;