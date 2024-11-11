import {ICustomProperties} from './types';
export class IdUtils {
    public static generateUUID(length?: number): string {
        const uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        if (length) {
            return uuid.substring(0, length);
        }
        return uuid;
    }
};
let _customElementProperties: {[name: string]: ICustomProperties | undefined} = {};

export function getCustomElements(){
    return _customElementProperties;
};
export function customElements(tagName: string, properties?: ICustomProperties): (constructor: CustomElementConstructor) => void {
    return (constructor: CustomElementConstructor) => {
        try{
            if (properties)
                properties.tagName = tagName
            else
                properties = {
                    props: {},
                    events: {},
                    tagName: tagName
                };
            _customElementProperties[tagName] = properties;
            if (!window.customElements.get(tagName))
                window.customElements.define(tagName, constructor);
        }
        catch(err){}
    };
};
export function getCustomElementProperties(name: string): ICustomProperties | undefined{
    return _customElementProperties[name?.toLowerCase()];
};