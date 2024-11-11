export type IJSONSchema7TypeName = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';
type IJSONSchema7Type = string | number | boolean | IJSONSchema7Object | IJSONSchema7Array | null;

interface IJSONSchema7Object {
    [key: string]: IJSONSchema7Type;
}

interface IJSONSchema7Array extends Array<IJSONSchema7Type> {
}

type IJSONSchema7Version = string;
type IJSONSchema7Definition = IJSONSchema7 | boolean;

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
    placeholder?: string | undefined;
    description?: string | undefined;
    tooltip?: string | undefined;
    default?: IJSONSchema7Type | undefined;
    readOnly?: boolean | undefined;
    writeOnly?: boolean | undefined;
    examples?: IJSONSchema7Type | undefined;
}
