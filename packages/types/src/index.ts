export * as JSONSchema from './jsonSchema';
export {IDataSchema} from './jsonSchema';
export {ITooltipImpl, PlacementType, TriggerType, ITooltip} from './tooltip';
export {I18nInterface,Locales,Translations,languages} from './i18n';
import {I18nInterface,Locales} from './i18n';
export interface IApplication{
    locale: Locales;
    i18n: I18nInterface;
};
export interface IModule extends HTMLElement {
    i18n: I18nInterface;
    isModule: boolean;
    currentModuleDir?: string;
    updateLocale(): void;
};
export function isModule(value: IModule): value is IModule {
    return (value as IModule).isModule = true;
};
export enum GroupType {
    'BASIC' = 'Basic',
    'LAYOUT' = 'Layout',
    'FIELDS' = 'Fields'
};
