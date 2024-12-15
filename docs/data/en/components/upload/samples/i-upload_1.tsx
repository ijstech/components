import {Module} from '@ijstech/components';
export default class IUploadExample extends Module{
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-upload id="upload" margin={{ top: 8, bottom: 0 }} caption="Drag and drop file here" 
                    accept="image/*,audio/*" draggable multiple showFileList={true}
                />
            </i-panel>
        )
    }
}