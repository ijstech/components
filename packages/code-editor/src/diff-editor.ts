import { Control, customElements } from "@ijstech/base";
import {addLib, addFile, getFileModel, updateFile, LanguageType, initMonaco, Monaco } from "./monaco";
import { CodeEditorElement } from "./code-editor";
import * as IMonaco from "./editor.api";
import "./style/code-editor.css";

enum EditorType {
  'modified',
  'original'
}

export interface CodeDiffEditorElement extends CodeEditorElement {
  onChange?: any;
  renderSideBySide?: boolean;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-code-diff-editor"]: CodeDiffEditorElement;
    }
  }
};

@customElements("i-code-diff-editor")
export class CodeDiffEditor extends Control {
  private _editor: IMonaco.editor.IDiffEditor;
  private _originalModel: IMonaco.editor.ITextModel | undefined;
  private _modifiedModel: IMonaco.editor.ITextModel | undefined;
  private _language: LanguageType;
  private _fileName: string;
  private _originalValue: string;
  private _modifiedValue: string;
  private _renderSideBySide: boolean = true;
  public onChange: any;

  public static addLib = addLib;
  public static addFile = addFile;
  public static getFileModel = getFileModel;
  public static updateFile = updateFile;

  protected init() {
    if (!this.editor) {
      super.init();
      this.language = this.getAttribute("language", true);
      this._renderSideBySide = this.getAttribute("renderSideBySide", true, true);
      this.style.display = "inline-block"; 
    };
  };  
  get editor(): IMonaco.editor.IDiffEditor {
    return this._editor;
  };
  get language(): LanguageType {
    return this._language;
  };
  set language(value: LanguageType) {
    this._language = value;
    if (!this.editor) {
      if (this.language) {
        this.loadContent(EditorType.original, '', this.language);
        this.loadContent(EditorType.modified, '', this.language);
      }
    } else {
      this.setModelLanguage(value, 'getOriginalEditor');
      this.setModelLanguage(value, 'getModifiedEditor');
    }
  };
  get designMode() {
    return this._designMode;
  }
  set designMode(value: boolean) {
    this._designMode = value;
    if (this.editor)
      this.editor.updateOptions({...this.editor.getModifiedEditor().getOptions(), readOnly: value});
  }

  get monaco(): Monaco{
    return (window as any).monaco as Monaco;
  }

  setModelLanguage(value: LanguageType, functionName: 'getModifiedEditor' | 'getOriginalEditor') {
    let monaco = (window as any).monaco as Monaco;
    let model = this.editor[functionName]().getModel();
    if (model) {      
      monaco.editor.setModelLanguage(model, value);
    }
  }

  dispose() {
    if (this._editor) {
      const originalModel = this.getModel(EditorType.original);
      const modifiedModel = this.getModel(EditorType.modified);

      if (originalModel) {
        originalModel.dispose();
      }

      if (modifiedModel) {
        modifiedModel.dispose();
      }
    }
  }

  updateFileName() {
  }

   getErrors() {
    const markers = this.monaco.editor.getModelMarkers({resource: this._editor.getModifiedEditor().getModel()?.uri});
    return markers.filter((marker) => marker.severity === this.monaco.MarkerSeverity.Error);
  }

  getEditor(type: EditorType) {
    if (type === EditorType.original)
      return this.editor.getOriginalEditor();
    else
      return this.editor.getModifiedEditor();
  }

  getModel(type: EditorType) {
    return this.getEditor(type).getModel();
  }

  async loadContent(type: EditorType, content?: string, language?: LanguageType, fileName?: string) {
    let monaco = await initMonaco();
    const funcName = type === EditorType.modified ? 'getModifiedEditor' : 'getOriginalEditor';
    const value = type === EditorType.modified ? this._modifiedValue : this._originalValue;
    const newFileName = `${type}` + fileName;

    if (content == undefined) content = content || value || '';
    type === EditorType.modified ? this._modifiedValue = content: this._originalValue = content;
    language = language || this._language || 'typescript';
    this._language = language;

    if (!this._editor) {
      let captionDiv = this.createElement("div", this);
      captionDiv.style.display = "inline-block";
      captionDiv.style.height = "100%";
      captionDiv.style.width = "100%";
      let options: IMonaco.editor.IStandaloneDiffEditorConstructionOptions = {
        theme: "vs-dark",
        originalEditable: false,
        automaticLayout: true,
        readOnly: this._designMode,
        renderSideBySide: this._renderSideBySide
      };
      this._editor = monaco.editor.createDiffEditor(captionDiv, options);

      this._editor.getModifiedEditor()?.onDidChangeModelContent((event: any) => {
        if (typeof this.onChange === 'function')
          this.onChange(this, event);
      });

      if (fileName){
        let model = await getFileModel(newFileName);
        if (model){
          this.editor[funcName]().setModel(model);
          model.setValue(content);
          return;
        }
      };
    }

    let model = this.getModel(type);
    if (model && model.getValue() === content && this._fileName === fileName) {
      return;
    }
    if (model) {
      if (fileName && this._fileName !== fileName){
        model.dispose();
        model = await getFileModel(newFileName);
        if (!model)
          model = monaco.editor.createModel(content || value || '', language || this._language || 'typescript', monaco.Uri.file(newFileName));
        this._editor[funcName]().setModel(model);
        this._editor[funcName]().setValue(content);
      }
      else {
        this.getEditor(type).setValue(content);
        if (language && model)
          monaco.editor.setModelLanguage(model, language);
      };
    } else {
      let model = await getFileModel(newFileName);
      if (!model) {
        const file = fileName ? monaco.Uri.file(newFileName) : undefined;
        if (language == 'typescript' || fileName?.endsWith('.tsx') || fileName?.endsWith('.ts')){
          model = monaco.editor.createModel(content || value || '', "typescript", file);
        }
        else
          model = monaco.editor.createModel(content || value || '', language || this._language || 'typescript', file);
      }
      this._editor[funcName]().setModel(model);
    }

    this._fileName = fileName || '';
  };
  updateOptions(options: IMonaco.editor.IEditorOptions) {
    this.editor.updateOptions(options);
  };
  get originalValue(): string {
    if (this.editor)
      return this.editor.getOriginalEditor().getValue();
    else
      return this._originalValue;
  };
  set originalValue(value: string) {
    this._originalValue = value;
    if (this.editor) {
      this.editor.getOriginalEditor().setValue(value);
    }
    else
      this.loadContent(EditorType.original);
  };

  get modifiedValue(): string {
    if (this.editor)
      return this.editor.getModifiedEditor().getValue();
    else
      return this._modifiedValue;
  };
  set modifiedValue(value: string) {
    this._modifiedValue = value;
    if (this.editor) {
      this.editor.getModifiedEditor().setValue(value);
    }
    else {
      this.loadContent(EditorType.modified);
    }
  };
};