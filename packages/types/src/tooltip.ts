export type PlacementType = 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
export type TriggerType = 'hover' | 'click';
export interface ITooltipImpl{
    content: string;
    popperClass: string;
    color: string;
    placement: PlacementType;
    trigger: TriggerType;
    duration: number;
    maxWidth: string;
    designMode: boolean;
    isSmallScreen: boolean;
    show(elm: HTMLElement): void;
    close(): void;
  };
  export interface ITooltip {
    content?: string;
    popperClass?: string;
    color?: string;
    placement?: PlacementType;
    trigger?: TriggerType;
    duration?: number;
    maxWidth?: string;
  };