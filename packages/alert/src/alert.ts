import {
  Control,
  Container,
  customElements,
  ControlElement,
  I18n,
} from "@ijstech/base";
import { Button } from "@ijstech/button";
import { Icon, IconName } from "@ijstech/icon";
import { Label } from "@ijstech/label";
import { Modal } from "@ijstech/modal";
import { HStack, Panel, VStack } from "@ijstech/layout";
import { Theme } from "@ijstech/style";
import { application } from "@ijstech/application";

import "./style/alert.css";
import { GroupType } from "@ijstech/types";

export interface AlertElement extends ControlElement {
  status?: "warning" | "success" | "error" | "loading" | "confirm";
  title?: string;
  content?: string;
  link?: {
    caption: string;
    href: string;
  };
  onClose?: any;
  onConfirm?: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-alert"]: AlertElement;
    }
  }
}

export interface IAlertMessage {
  status: "warning" | "success" | "error" | "loading" | "confirm";
  title?: string;
  content?: string;
  link?: {
    caption: string;
    href: string;
  };
  onClose?: any;
  onConfirm?: any;
}

const DEFAULT_VALUES = {
  target: '_blank'
}

@customElements('i-alert', {
  icon: 'exclamation-circle',
  group: GroupType.BASIC,
  className: 'Alert',
  props: {
    status: { type: 'string' },
    title: { type: 'string' },
    content: { type: 'string' },
    link: {
      type: 'object',
      default: { target: DEFAULT_VALUES.target }
    },
  },
  dataSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['warning', 'success', 'error', 'loading', 'confirm']
      },
      title: {
        type: 'string'
      },
      content: {
        type: 'string'
      },
      link: {
        type: 'object',
        properties: {
          href: {
            type: 'string'
          },
          target: {
            type: 'string',
            enum: ['_blank', '_self', '_parent', '_top'],
            default: DEFAULT_VALUES.target
          }
        }
      }
    }
  },
  events: {}
})

export class Alert extends Control {
  private mdAlert: Modal;
  private pnlMain: Panel;
  private contentElm: Panel|null = null;
  private titleElm: Label|null = null;
  private linkElm: Label|null = null;
  private _status:
    | "warning"
    | "success"
    | "error"
    | "loading"
    | "confirm"
    | string;
  private _title: string;
  private _content: string;
  private _link: {
    caption: string;
    href: string;
  };
  public onClose?: any;
  public onConfirm?: any;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.closeModal = this.closeModal.bind(this);
  }

  get status(): string {
    return this._status;
  }
  set status(value: string) {
    this._status = value;
  }

  get title(): string {
    return this.getTranslatedText(this._title || '');
  }
  set title(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._title = value;
  }

  get content(): string {
    return this.getTranslatedText(this._content || '');
  }
  set content(value: string) {
    if (typeof value !== 'string') value = String(value || '');
    this._content = value;
  }

  updateLocale(i18n: I18n): void {
    super.updateLocale(i18n);
    if (this.titleElm && this._title?.startsWith('$'))
      this.titleElm.textContent = i18n.get(this._title) || '';
    if (this.contentElm && this._content?.startsWith('$')) {
      const text = i18n.get(this._content) || '';
      this.createLabels(text);
    }
    if (this.linkElm) this.linkElm.updateLocale(i18n);
  }

  private getTranslatedText(value: string): string {
    if (value?.startsWith('$')) {
      const translated =
        this.parentModule?.i18n?.get(value) ||
        application.i18n?.get(value) ||
        ''
      return translated;
    }
    return value;
  }

  get link(): {
    caption: string;
    href: string;
  } {
    return this._link;
  }
  set link(value: { caption: string; href: string }) {
    this._link = value;
  }

  private get iconName(): IconName {
    switch (this.status) {
      case "error":
        return "times";
      case "warning":
      case "confirm":
        return "exclamation";
      case "success":
        return "check";
      default:
        return "spinner";
    }
  }

  private get color(): string {
    switch (this.status) {
      case "error":
        return Theme.ThemeVars.colors.error.main;
      case "warning":
      case "confirm":
        return Theme.ThemeVars.colors.warning.main;
      case "success":
        return Theme.ThemeVars.colors.success.main;
      default:
        return Theme.ThemeVars.colors.primary.main;
    }
  }

  closeModal = () => {
    this.mdAlert.visible = false;
  };

  showModal = () => {
    this.renderUI();
    this.mdAlert.visible = true;
  };

  private renderUI() {
    this.pnlMain.clearInnerHTML();
    const wrapperElm = new VStack(this.pnlMain, {
      horizontalAlignment: "center",
      gap: "1.75rem",
    });

    const border: any =
      this.status === "loading"
        ? {}
        : {
            border: {
              width: 2,
              style: "solid",
              color: this.color,
              radius: "50%",
            },
          };
    const paddingSize: string =
      this.status === "loading" ? "0.25rem" : "0.6rem";
    new Icon(wrapperElm, {
      width: 55,
      height: 55,
      name: this.iconName,
      fill: this.color,
      padding: {
        top: paddingSize,
        bottom: paddingSize,
        left: paddingSize,
        right: paddingSize,
      },
      spin: this.status === "loading",
      ...border,
    });

    this.renderContent(wrapperElm);
    this.renderLink(wrapperElm);
    this.renderButtons(wrapperElm);
  }

  private renderContent(wrapperElm: Container) {
    if (!this.title && !this.content) return [];
    const contentElm = new VStack(wrapperElm, {
      horizontalAlignment: "center",
      gap: "0.75rem",
      lineHeight: 1.5,
    });

    this.titleElm = this.title
      ? new Label(contentElm, {
          caption: this.title,
          font: { size: "1.25rem", bold: true },
        })
      : null;

      this.contentElm = new Panel(contentElm, {width: '100%'});
      if (this.content) {
        this.createLabels(this.content);
      }
  }

  private createLabels(text: string) {
    this.contentElm?.clearInnerHTML();
    if (!text || !this.contentElm) return;
    const elements: Control[] = [];
    const newText = text.replace(/\r\n|\r|<br>/g, '\n');
    const lines = newText.split('\n');
    lines.forEach(line => {
      const label = new Label(this.contentElm as any, {
        caption: line,
        overflowWrap: "anywhere",
      });
      elements.push(label);
    });
    return elements;
  }

  private renderLink(wrapperElm: Container) {
    if (this.link)
      this.linkElm = new Label(wrapperElm, {
        class: "text-center",
        caption: (this.link as any).caption,
        font: { size: "0.875rem" },
        link: { href: (this.link as any).href, target: "_blank" },
        overflowWrap: "anywhere",
      });
  }

  private renderButtons(wrapperElm: Container) {
    if (this.status === "confirm") {
      const hStack = new HStack(wrapperElm, {
        verticalAlignment: "center",
        gap: "0.5rem",
      });
      new Button(hStack, {
        padding: {
          top: "0.5rem",
          bottom: "0.5rem",
          left: "2rem",
          right: "2rem",
        },
        caption: "$cancel",
        font: { color: Theme.ThemeVars.colors.secondary.contrastText, transform: 'capitalize' },
        background: { color: Theme.ThemeVars.colors.secondary.main },
        onClick: () => {
          if (typeof this.onClose === 'function') {
            this.onClose();
          }
          this.closeModal();
        },
      });
      new Button(hStack, {
        padding: {
          top: "0.5rem",
          bottom: "0.5rem",
          left: "2rem",
          right: "2rem",
        },
        caption: "$confirm",
        font: { color: Theme.ThemeVars.colors.primary.contrastText, transform: 'capitalize' },
        onClick: () => {
          if (typeof this.onConfirm === 'function') {
            this.onConfirm();
          }
          this.closeModal();
        },
      });
    } else {
      new Button(wrapperElm, {
        padding: {
          top: "0.5rem",
          bottom: "0.5rem",
          left: "2rem",
          right: "2rem",
        },
        caption: "$close",
        font: { color: Theme.ThemeVars.colors.primary.contrastText, transform: 'capitalize' },
        onClick: () => {
          if (typeof this.onClose === 'function') {
            this.onClose();
          }
          this.closeModal();
        },
      });
    }
  }

  protected async init() {
    if (!this.mdAlert) {
      super.init();

      this.status = this.getAttribute("status", true);
      this.title = this.getAttribute("title", true);
      this.content = this.getAttribute("content", true);
      this.link = this.getAttribute("link", true);
      this.onClose = this.getAttribute("onClose", true);
      this.onConfirm = this.getAttribute("onConfirm", true);

      this.mdAlert = await Modal.create({
        width: "400px",
      });
      this.appendChild(this.mdAlert);

      this.pnlMain = new Panel(this, {
        width: "100%",
        padding: {
          top: "1.5rem",
          bottom: "1.5rem",
          left: "1.5rem",
          right: "1.5rem",
        },
      });
      this.mdAlert.item = this.pnlMain;
    }
  }
}
