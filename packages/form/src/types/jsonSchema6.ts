export type IJSONSchema6TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null' | 'any';
type IJSONSchema6Type = | string | number | boolean | IJSONSchema6Object | IJSONSchema6Array | null;

interface IJSONSchema6Object {
    [key: string]: IJSONSchema6Type;
}

interface IJSONSchema6Array extends Array<IJSONSchema6Type> {
}

type IJSONSchema6Version = string;
type IJSONSchema6Definition = IJSONSchema6 | boolean;

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
    placeholder?: string | undefined;
    description?: string | undefined;
    tooltip?: string | undefined;
    default?: IJSONSchema6Type | undefined;
    examples?: IJSONSchema6Type[] | undefined;
    format?: string | undefined;
}
