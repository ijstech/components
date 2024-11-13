import {Module, Label} from '@ijstech/components';
export default class ICodeEditorSample extends Module{  
    render(){
        return <i-panel dock="fill">
                <i-code-editor language="typescript" width="100%" height="100%"></i-code-editor>
                </i-panel>
    }
}