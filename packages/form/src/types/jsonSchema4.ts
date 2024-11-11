export type IJSONSchema4TypeName = | 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null' | 'any';
type IJSONSchema4Type = string | number | boolean | IJSONSchema4Object | IJSONSchema4Array | null;

interface IJSONSchema4Object {
    [key: string]: IJSONSchema4Type;
}

interface IJSONSchema4Array extends Array<IJSONSchema4Type> {
}

type IJSONSchema4Version = string;

export interface IJSONSchema4 {
    id?: string | undefined;
    $ref?: string | undefined;
    $schema?: IJSONSchema4Version | undefined;

    title?: string | undefined;

    placeholder?: string | undefined;
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
