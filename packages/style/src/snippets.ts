import {style} from './index';

export function rotate(degree: number): string {
    if (degree !== 0 && !degree)
        return ''
    let value = `rotate(${degree}deg)`;
    return style({
        transform: value
    })
}