import {Module, Control, Upload, Label} from '@ijstech/components';
export default class IUploadExample extends Module{
    private label1: Label;

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
}
