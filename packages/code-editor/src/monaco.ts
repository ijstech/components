import { RequireJS, LibPath } from "@ijstech/base";
import * as IMonaco from "./editor.api";

export type LanguageType = "txt" | "css" | "json" | "javascript" | "typescript" | "solidity" | "markdown" | "html" | "xml" | "shell";

export function getLanguageType(fileName: string): LanguageType|undefined{
  let ext = fileName.split('.').pop();
  switch (ext){
    case 'js':
      return 'javascript'
    case 'json':
      return 'json'
    case 'tsx':
    case 'ts':
      return 'typescript'    
    case 'css':
      return 'css'
    case 'sol':
      return 'solidity'
    case 'txt':
      return 'txt'
    case 'md':
      return 'markdown'
    case 'html':
    case 'htm':
      return 'html'
    case 'xml':
      return 'xml'
    case 'sh':
      return 'shell'    
  }
};
export interface Monaco{
  MarkerSeverity: typeof IMonaco.MarkerSeverity;
  editor: typeof IMonaco.editor;
  Uri: typeof IMonaco.Uri;
  languages: typeof IMonaco.languages;
  $loaded: boolean;
};
export async function addFile(fileName: string, content: string): Promise<IMonaco.editor.ITextModel|null>{  
  let monaco = await initMonaco();
  if (monaco){
    let model = await getFileModel(fileName);
    if (!model){
      if (fileName?.endsWith('.tsx') || fileName?.endsWith('.ts'))
        model = monaco.editor.createModel(content || '',"typescript", monaco.Uri.file(fileName))
      else
        model = monaco.editor.createModel(content || '', getLanguageType(fileName) || '', monaco.Uri.file(fileName))
    }
    return model;
  };
  return null;
};
export async function updateFile(fileName: string, content: string): Promise<IMonaco.editor.ITextModel|null>{
  let monaco = await initMonaco();
  if (monaco){
    let model = await getFileModel(fileName);
    if (model){
      model.setValue(content)
    }
    return model;
  };
  return null;
};
export async function getFileModel(fileName: string): Promise<IMonaco.editor.ITextModel|null>{
  let monaco = await initMonaco();
  if (monaco){
    let models = monaco.editor.getModels();
    for (let i = 0; i < models.length; i ++){
      let model = models[i];        
      if (model.uri.path == fileName || model.uri.path == '/' + fileName)
        return model;
    };
  };
  return null;
};
export async function getModels() {
  let monaco = await initMonaco();
  if (monaco){
    return monaco.editor.getModels();
  }
}
export async function addLib(lib: string, dts: string){
  let monaco = await initMonaco();
  monaco.languages.typescript.typescriptDefaults.addExtraLib(dts, lib);
};
export async function initMonaco(): Promise<Monaco>{  
  if ((window as any).monaco)
    return (window as any).monaco;
  return new Promise((resolve)=>{
    ((window as any).MonacoEnvironment as IMonaco.Environment) = {            
      // getWorkerUrl: function (moduleId: any, label: any) {
      //   switch (label) {
      //     // case "json":
      //     //   return `${LibPath}lib/monaco-editor/0.32.1/min/vs/language/json/jsonWorker.js`;
      //     // case "css":
      //     //   return `${LibPath}lib/monaco-editor/0.32.1/min/vs/language/css/cssWorker.js`;
      //     // case "html":
      //     //   return `${LibPath}lib/monaco-editor/0.32.1/min/vs/language/html/htmlWorker.js`;
      //     // case "typescript":
      //     // case "javascript":
      //     //   return `${LibPath}lib/monaco-editor/0.32.1/min/vs/language/typescript/tsWorker.js`;            
      //     default:
      //       return `${LibPath}lib/monaco-editor/0.32.1/min/vs/base/worker/workerMain.js`;
      //   }
      // }
    };
    RequireJS.config({ paths: { 'vs': `${LibPath}lib/monaco-editor/0.32.1/min/vs` } });
    RequireJS.require([`vs/editor/editor.main`], (monaco: Monaco) => {      
      resolve(monaco);      
      if (monaco.$loaded)
        return;
      monaco.$loaded = true;
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        jsx: monaco.languages.typescript.JsxEmit.Preserve,          
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        allowNonTsExtensions: true,
        target: monaco.languages.typescript.ScriptTarget.ES2020,
      });
      //https://stackoverflow.com/questions/57146485/monaco-editor-intellisense-from-multiple-files
      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
      monaco.languages.registerCompletionItemProvider('typescript',{
        triggerCharacters: ['>'],
        provideCompletionItems: (model: any, position: any) => {
          const code: string = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });
      
          const tag = code.slice(
            code.lastIndexOf('<') + 1,
            code.length
          );
          if (!tag || !tag.endsWith('>') || tag.startsWith('/') || tag.indexOf(' ') > 0)
            return;

          const word = model.getWordUntilPosition(position);
          return {
            suggestions: [
              {
                label: `</${tag}`,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `$1</${tag}`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range:  {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: word.startColumn,
                  endColumn: word.endColumn,
                }
              }
            ]
          };
        }
      }); 
    });
  });
};