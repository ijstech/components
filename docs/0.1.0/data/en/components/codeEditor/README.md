# i-code-editor

## Usage

To call out the code editor for code editing.

## Properties

| Name     | Parameters                  | Default | Description |
| -------- | --------------------------- | ------- | ----------- |
| language | tableClasses?: LanguageType |         |             |

## i-code-editor (Property)
```typescript(samples/i-code-editor.tsx)
    render(){
        return <i-panel dock="fill">
                <i-code-editor language="typescript" width="100%" height="100%"></i-code-editor>
                </i-panel>
    }
```

## Functions

| Name          | Parameters                                            | Description      |
| ------------- | ----------------------------------------------------- | ---------------- |
| updateOptions | updateOptioons(options:IMonaco.editor.IEditorOptions) |                  |
| getValue      |                                                       | get editor value |
| setValue      | value: string                                         | set editor value |
