import {Control} from '@ijstech/base';
// import {Checkbox} from '@ijstech/checkbox';
interface IControl{
    enabled: boolean;
    _handleBlur(event: Event, stopPropagation?: boolean): boolean;
    _handleClick(event: Event, stopPropagation?: boolean): boolean;
    _handleDblClick(event: Event, stopPropagation?: boolean): boolean;
    _handleFocus(event: Event, stopPropagation?: boolean): boolean;
    _handleKeyDown(event: Event, stopPropagation?: boolean): boolean;
    _handleKeyUp(event: Event, stopPropagation?: boolean): boolean;
    _handleMouseDown(event: Event, stopPropagation?: boolean): boolean;
    _handleMouseMove(event: Event, stopPropagation?: boolean): boolean;
    _handleMouseUp(event: Event, stopPropagation?: boolean): boolean;
    _handleMouseWheel(event: Event, stopPropagation?: boolean): boolean;    
    _handleContextMenu(event: Event, stopPropagation?: boolean): boolean;
};
function getControl(target: EventTarget | null): IControl | null{    
    if (target instanceof Control){
        return <any>target;
    }
    if ((target instanceof HTMLElement || target instanceof SVGElement) && target.parentElement)
        return getControl(target.parentElement);
    return null;
};
export class GlobalEvents {
    public _leftMouseButtonDown: boolean;

    private _initialTouchPos: boolean = false;

    constructor(){
        this._handleMouseDown = this._handleMouseDown.bind(this);
        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._handleMouseUp = this._handleMouseUp.bind(this);
        this.bindEvents();
    }
    abortEvent(event: Event){
        event.stopPropagation();
    };
    private _handleClick(event: MouseEvent){
        let control = getControl(event.target);
        if (control){// && !(control instanceof Checkbox)){            
            if (control.enabled){                
                if (control._handleClick(event)){
                    // event.preventDefault();
                    event.stopPropagation();
                };
            };
        };
    };
    private _handleMouseDown(event: PointerEvent|MouseEvent|TouchEvent){
        const target = event.target as HTMLElement;
        let control = getControl(target);
        if (control?.enabled){
            this._initialTouchPos = true;
            if (control._handleMouseDown(event)){
                // event.preventDefault();
                event.stopPropagation();
            }
            if (window.PointerEvent) {
                // target.setPointerCapture((event as PointerEvent).pointerId);
                document.addEventListener('pointermove', this._handleMouseMove, true);
                document.addEventListener('pointerup', this._handleMouseUp, true);
            } else {
                document.addEventListener('mousemove', control._handleMouseMove, true);
                document.addEventListener('mouseup', control._handleMouseUp, true);
            }
        }
    }
    private _handleMouseMove(event: PointerEvent|MouseEvent|TouchEvent){
        let control = getControl(event.target);
        if (control?.enabled){
            if (!this._initialTouchPos){
                return;
            }
            if (control._handleMouseMove(event)){
                event.preventDefault();
                event.stopPropagation();
            }
        }
    };
    private _handleMouseUp(event: PointerEvent|MouseEvent|TouchEvent){
        const target = event.target as HTMLElement;
        let control = getControl(target);
        if (control?.enabled){
            if (window.PointerEvent) {
                // target.releasePointerCapture((event as PointerEvent).pointerId);
                document.removeEventListener('pointermove', this._handleMouseMove, true);
                document.removeEventListener('pointerup', this._handleMouseUp, true);
            } else {
                document.removeEventListener('mousemove', control._handleMouseMove, true);
                document.removeEventListener('mouseup', control._handleMouseUp, true);
            }
            this._initialTouchPos = false;
            if (control._handleMouseUp(event)){
                event.preventDefault();
                event.stopPropagation();
            }
        }
    };
    private _handleDblClick(event: MouseEvent){
        let control = getControl(event.target);
        if (control){            
            if (control.enabled){
                if (control._handleDblClick(event)){
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }
    private _handleKeyDown(event: KeyboardEvent){
        let control = getControl(event.target);
        if (control){            
            if (control.enabled){
                if (control._handleKeyDown(event)){
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }
    private _handleKeyUp(event: KeyboardEvent){
        let control = getControl(event.target);
        if (control){            
            if (control.enabled){
                if (control._handleKeyUp(event)){
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
    }
    private _handleContextMenu(event: MouseEvent){
        let control = getControl(event.target);
        if (control){
            // event.preventDefault();
            event.stopPropagation();
            if (control.enabled)
                control._handleContextMenu(event);
        }
    }
    // private _handleTouchStart(event: TouchEvent){

    // }
    // private _handleTouchEnd(event: TouchEvent){
        
    // }
    // private _handleTouchMove(event: TouchEvent){
        
    // }
    private _handleChange(event: Event){
        
    }
    private _handleMouseWheel(event: MouseEvent){
        let control = getControl(event.target);
        if (control){
            // event.preventDefault();
            event.stopPropagation();
            if (control.enabled && control._handleMouseWheel)
                control._handleMouseWheel(event);
        }
    }
    private _handleFocus(event: FocusEvent){
        let control = getControl(event.target);
        if (control){
            // event.preventDefault();
            // event.stopPropagation();
            if (control.enabled && control._handleFocus)
                control._handleFocus(event);
        }
    }
    private _handleBlur(event: FocusEvent){
        let control = getControl(event.target);
        if (control){
            // event.preventDefault();
            // event.stopPropagation();
            if (control.enabled && control._handleBlur)
                control._handleBlur(event);
        }
    }

    private bindEvents(){
        // window.addEventListener('mousedown', this._handleMouseDown.bind(this));
		// window.addEventListener('mousemove', this._handleMouseMove.bind(this));
		// window.addEventListener('mouseup', this._handleMouseUp.bind(this));

        document.addEventListener('click', this._handleClick.bind(this));
		window.addEventListener('dblclick', this._handleDblClick.bind(this));
		window.oncontextmenu = this._handleContextMenu.bind(this);
		window.addEventListener('keydown', this._handleKeyDown);
		window.addEventListener('keyup', this._handleKeyUp);
		// window.addEventListener('touchstart', this._handleTouchStart);
		// window.addEventListener('touchend', this._handleTouchEnd);
		// window.addEventListener('touchmove', this._handleTouchMove);
		window.addEventListener('change', this._handleChange);		
		window.addEventListener("wheel", this._handleMouseWheel, { passive: false });
		window.addEventListener('focus', this._handleFocus, true);
		window.addEventListener('blur', this._handleBlur, true);

        document.addEventListener('touchstart', this._handleMouseDown, { passive: false });
        document.addEventListener('touchmove', this._handleMouseMove, { passive: false });
        // document.addEventListener('touchend', this._handleMouseUp, true);
        // document.addEventListener('touchcancel', this._handleMouseUp, true);

        if (window.PointerEvent) {
            document.addEventListener('pointerdown', this._handleMouseDown, true);
        } else {
            document.addEventListener('mousedown', this._handleMouseDown, true);
        }
    }
};