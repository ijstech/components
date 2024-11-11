import { ControlElement } from "@ijstech/base";

export interface IAccordionItem extends ControlElement {
  name: string;
  defaultExpanded?: boolean;
  showRemove?: boolean;
}

export interface IAccordion {
  items: IAccordionItem[];
  isFlush?: boolean;
}
