import { Control, customElements, ControlElement, notifyEventCallback, notifyKeyboardEventCallback } from "@ijstech/base";
import {addLib, addFile, getFileModel, updateFile, LanguageType, initMonaco, Monaco, getModels } from "./monaco";
import * as IMonaco from "./editor.api";
import "./style/code-editor.css";
import { GroupType } from "@ijstech/types";

export interface CodeEditorElement extends ControlElement {
  language?: LanguageType;
  onChange?: notifyEventCallback;
  onKeyDown?: notifyKeyboardEventCallback;
  onKeyUp?: notifyKeyboardEventCallback;
  onAddAction?: (editor: IMonaco.editor.IStandaloneCodeEditor) => void;
};
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-code-editor"]: CodeEditorElement;
    }
  }
};

@customElements('i-code-editor', {
  icon: 'code',
  group: GroupType.FIELDS,
  className: 'CodeEditor',
  props: {
    language: {
      type: 'string',
      default: ''
    },
  },
  events: {
    onChange: [
      {name: 'target', type: 'Control', isControl: true},
      {name: 'event', type: 'Event'}
    ],
    onKeyDown: [
      {name: 'target', type: 'Control', isControl: true},
      {name: 'event', type: 'KeyboardEvent'}
    ],
    onKeyUp: [
      {name: 'target', type: 'Control', isControl: true},
      {name: 'event', type: 'KeyboardEvent'}
    ]
  },
  dataSchema: {
    type: 'object',
    properties: {
      language: {
        type: 'string'
      }
    }
  }
})
export class CodeEditor extends Control {
  private _editor: IMonaco.editor.IStandaloneCodeEditor;
  private _language: LanguageType;  
  private _fileName: string;
  private _value: string;
  private _options: IMonaco.editor.IEditorOptions;
  public onChange: notifyEventCallback;
  public onKeyDown: notifyKeyboardEventCallback;
  public onKeyUp: notifyKeyboardEventCallback;
  public onAddAction: (editor: IMonaco.editor.IStandaloneCodeEditor) => void;
  
  public static addLib = addLib;
  public static addFile = addFile;
  public static getFileModel = getFileModel;
  public static updateFile = updateFile;
  get monaco(): Monaco{
    return (window as any).monaco as Monaco;
  }
  protected init() {
    if (!this.editor) {
      super.init();
      let language = this.getAttribute("language", true);
      if (language)
        this.language = language;
      this.style.display = "inline-block";

      if (this.language)
        this.loadContent(undefined, this.language);
    };
  };  
  get editor(): IMonaco.editor.IStandaloneCodeEditor{
    return this._editor;
  };  
  focus(): void {
    this._editor.focus();
  };
  setCursor(line: number, column: number){
    this.editor.setPosition({lineNumber: line, column: column});
  };
  get language(): LanguageType {
    return this._language;
  };
  set language(value: LanguageType) {          
    this._language = value;
    if (!this.editor) {      
      this.loadContent();
    }
    else{
      let monaco = this.monaco;
      let model = this.editor.getModel();
      if (model){        
        monaco.editor.setModelLanguage(model, value);
      }
    }
  };
  get designMode() {
    return this._designMode;
  }
  set designMode(value: boolean) {
    this._designMode = value;
    if (this.editor)
      this.editor.updateOptions({readOnly: value});
  }
  getErrors() {
    const markers = this.monaco.editor.getModelMarkers({resource: this._editor.getModel()?.uri});
    return markers.filter((marker) => marker.severity === this.monaco.MarkerSeverity.Error);
  }
  async loadContent(content?: string, language?: LanguageType, fileName?: string){    
    let monaco = await initMonaco();

    if (content == undefined)
        content = content || this._value || '';
    this._value = content;
    language = language || this._language || 'typescript';
    this._language = language;    

    if (!this._editor){
      let captionDiv = this.createElement("div", this);
      captionDiv.style.display = "inline-block";
      captionDiv.style.height = "100%";
      captionDiv.style.width = "100%";
      const customOptions = this._options || {};
      let options:IMonaco.editor.IStandaloneEditorConstructionOptions = {
        theme: "vs-dark",
        tabSize: 2,
        autoIndent: 'advanced',
        formatOnPaste: true,
        formatOnType: true,
        renderWhitespace: "none",
        automaticLayout: true,
        readOnly: this._designMode,
        minimap: {
          enabled: false
        },
        ...customOptions
      };
      this._editor = monaco.editor.create(captionDiv, options);
      if (typeof this.onAddAction === 'function') {
        this.onAddAction(this._editor);
      }
      this._editor.onDidChangeModelContent((event: any) => {
        if (typeof this.onChange === 'function')
          this.onChange(this, event);
      });
      this._editor.onKeyDown((event: any) => {
        if (typeof this.onKeyDown === 'function') {
          this.onKeyDown(this, event);
        }
      });
      this._editor.onKeyUp((event: any) => {
        if (typeof this.onKeyUp === 'function') {
          this.onKeyUp(this, event);
        }
      });
      this._editor.onMouseDown((event: any) => {
        if (typeof this.onMouseDown === 'function') {
          this.onMouseDown(this, event);
        }
      });
      this._editor.onContextMenu((event: any) => {
        if (typeof this.onContextMenu === 'function') {
          this.onContextMenu(this._editor as any, event);
        }
      });
      if (fileName){
        let model = await getFileModel(fileName);
        if (model){
          this._editor.setModel(model);
          model.setValue(content);
          return;
        }
      };      
      if (language == 'typescript' || fileName?.endsWith('.tsx') || fileName?.endsWith('.ts')){                
        let model = monaco.editor.createModel(content || this._value || '',"typescript", fileName?monaco.Uri.file(fileName):undefined);
        this._editor.setModel(model);
      }
      else{
        let model = monaco.editor.createModel(content || this._value || '',language || this._language, fileName?monaco.Uri.file(fileName):undefined);        
        this._editor.setModel(model);      
      };
    }
    else{
      let model = this._editor.getModel();
      if (language == 'typescript' && model && fileName && this._fileName != fileName){        
        if (!this._fileName)
          model.dispose();
        model = await getFileModel(fileName);
        if (!model) {
          model = monaco.editor.createModel(content || this._value || '',"typescript", monaco.Uri.file(fileName));
        }
        this._editor.setModel(model);
      }
      else{
        this._editor.setValue(content);
        if (language && model)
          monaco.editor.setModelLanguage(model, language);
      };
    };
    this._fileName = fileName || '';
    this._editor.setScrollTop(0);    
  };
  saveViewState() {
    if (this._editor) {
      return this._editor.saveViewState();
    }
  }
  restoreViewState(state: IMonaco.editor.ICodeEditorViewState) {
    if (this._editor && state) {
      this._editor.restoreViewState(state);
    }
  }
  async updateFileName(oldValue: string, newValue: string) {
    let oldModel = await getFileModel(oldValue);
    if (oldModel) {
      if (!oldModel) {
        console.error('Model not found');
        return;
      }
      let newModel = await getFileModel(newValue);
      const newUri = this.monaco.Uri.parse(newValue);
      if (!newModel) newModel = this.monaco.editor.createModel(oldModel.getValue(), oldModel.getLanguageId(), newUri);
      newModel.setValue(oldModel.getValue());
      this.editor.setModel(newModel);
      oldModel.dispose();
    }
  }

  dispose() {
    if (this._editor) {
      this._editor.getModel()?.dispose();
    }
  }
  disposeEditor() {
    if (this._editor) {
      this._editor.getModel()?.dispose();
      this._editor.dispose();
      const domNode = this._editor.getDomNode();
      if (domNode) {
        if (this.contains(domNode)) this.removeChild(domNode);
        domNode.remove();
      }
    }
  }
  scrollToLine(line: number, column: number) {
    const topOffset = this._editor.getTopForPosition(line, column);
    this._editor.setScrollTop(topOffset);
  }
  async loadFile(fileName: string){
    let model = await getFileModel(fileName);
    if (model){
      if (!this._fileName)
        this._editor.getModel()?.dispose();
      this._fileName = fileName;
      this._editor.setModel(model);
    };
  };
  updateOptions(options: IMonaco.editor.IEditorOptions) {
    this._options = options;
    if (this._editor)
      this._editor.updateOptions(options);    
  };
  get value(): string {
    if (this._editor)
      return this._editor.getValue()
    else
      return this._value;
  };
  set value(value: string) {
    this._value = value;
    if (this._editor) {
      this._editor.setValue(value);
      this._editor.setScrollTop(0);
    }
    else
      this.loadContent();
  };
};