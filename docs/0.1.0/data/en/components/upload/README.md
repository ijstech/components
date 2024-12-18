# Upload

Use for uploading one or more information for publishing such as (image, video, text, web page, etc.) to server via web page or upload tool, with uploading process, drag and drop upload features.

### `i-upload`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                                            | Type       | Default |
| --------------- | -------------------------------------------------                      | ---------- | ------- |
| fileList        |                                                                        | [File&#91;&#93;](../customDataType/README.md#file) | |
| multiple        | Define that an `<i-upload>` that allows multiple files to be selected. | boolean    |         |
| accept          | Define a filter for what file types can be select `<i-upload>`         | string     |         |
| draggable       | Define that an `<i-upload>` can be draggable                           | boolean    |         |
| caption         | Define the display of an `<i-upload>`                                  | string     |         |
| showFileList    | Define that an `<i-upload>` should be show the selected file list      | boolean    |         |

## Events

| **onChanged**  |                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when added file change       |
| Signature      | onChanged(target: Upload, files: File[])       |

| **onRemoved**  |                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when removed the added files |
| Signature      | onRemoved(target: Upload, file: File)          |

| **onAdded**    |                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when select files added      |
| Signature      | onAdded(target: Upload, file: File)            |

| **onUploading**|                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when selected upload files   |
| Signature      | onUploading(target: Upload, file: File)        |

| **onBeforeDrop**|                                               |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when drag start              |
| Signature      | target: onBeforeDrop(target: Upload)           |

## Sample Code

### Properties
```typescript(samples/i-upload_1.tsx)
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-upload id="upload" margin={{ top: 8, bottom: 0 }} caption="Drag and drop file here" 
                accept="image/*,audio/*" draggable multiple showFileList={true}
            />
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, [`margin`](../customDataType/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_

### Events
```typescript(samples/i-upload_2.tsx)
handleBeforeUpload(target: Upload, file: File) {
    this.label1.caption = "Event called: handleBeforeUpload event";
    return Promise.resolve(true);
}
handleChangeFile(source: Control, value: File[]) {
    this.label1.caption = "Event called: handleChangeFile event";
}
handleAddFile(source: Control, value: File) {
    this.label1.caption = "Event called: handleAddFile event";
    return Promise.resolve(true);
}
handleRemoveFile(source: Control, value: File) {
    this.label1.caption = "Event called: handleRemoveFile event";
}
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-panel><i-label id='label1' caption='Event called: ' padding={{left: 20}}></i-label></i-panel>
            <i-upload id="upload" margin={{ top: 8, bottom: 0 }} caption="Drag and drop file here"
                accept="image/*,audio/*" multiple showFileList={true}
                onUploading={this.handleBeforeUpload}
                onChanged={this.handleChangeFile}
                onAdded={this.handleAddFile}
                onRemoved={this.handleRemoveFile}
            />
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, [`margin`](../customDataType/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_