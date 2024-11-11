//https://typestyle.github.io/#/

export * as Theme from './theme';
export {Colors} from './colors';
import {typeStyle} from './typestyle';
// export { TypeStyle };

/**
 * All the CSS types in the 'types' namespace
 */
// export * as types from './types';
// export * as cssTypes from './csstype';
// export { types };

/**
 * Export certain utilities
 */
// export { extend, classes, media } from './utilities';


/** Sets the target tag where we write the css on style updates */
// export const setStylesTarget = ts.setStylesTarget;

/**
 * Insert `raw` CSS as a string. This is useful for e.g.
 * - third party CSS that you are customizing with template strings
 * - generating raw CSS in JavaScript
 * - reset libraries like normalize.css that you can use without loaders
 */
export const cssRaw = typeStyle.cssRaw;

/**
 * Takes CSSProperties and registers it to a global selector (body, html, etc.)
 */
export const cssRule = typeStyle.cssRule;

/**
 * Renders styles to the singleton tag imediately
 * NOTE: You should only call it on initial render to prevent any non CSS flash.
 * After that it is kept sync using `requestAnimationFrame` and we haven't noticed any bad flashes.
 **/
// export const forceRenderStyles = ts.forceRenderStyles;

/**
 * Utility function to register an @font-face
 */
export const fontFace = typeStyle.fontFace;
// export {rotate} from './snippets';
export function rotate(degree: number): string {
    if (degree !== 0 && !degree)
        return ''
    let value = `rotate(${degree}deg)`;
    return style({
        transform: value
    })
}
/**
 * Allows use to use the stylesheet in a node.js environment
 */
// export const getStyles = ts.getStyles;

/**
 * Takes keyframes and returns a generated animationName
 */
export const keyframes = typeStyle.keyframes;

/**
 * Helps with testing. Reinitializes FreeStyle + raw
 */
// export const reinit = ts.reinit;

/**
 * Takes CSSProperties and return a generated className you can use on your component
 */
export const style = typeStyle.style;

/**
 * Takes an object where property names are ideal class names and property values are CSSProperties, and
 * returns an object where property names are the same ideal class names and the property values are
 * the actual generated class names using the ideal class name as the $debugName
 */
// export const stylesheet = ts.stylesheet;

/**
 * Creates a new instance of TypeStyle separate from the default instance.
 *
 * - Use this for creating a different typestyle instance for a shadow dom component.
 * - Use this if you don't want an auto tag generated and you just want to collect the CSS.
 *
 * NOTE: styles aren't shared between different instances.
 */
// export function createTypeStyle(target?: { textContent: string | null }): TypeStyle {
//   const instance = new TypeStyle({ autoGenerateTag: false });
//   if (target) {
//     instance.setStylesTarget(target);
//   }
//   return instance;
// }