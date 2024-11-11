import {Module} from '@ijstech/components';
export default class InputSample extends Module{
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-input width="auto" height="auto" margin={{left: 20, top: 20}}
                    background={{color: "transparent"}}
                    caption="This is the text" captionWidth={150} inputType="text"
                    value="Test123" placeholder="please input something" readOnly={true} showClearButton={false}
                />
                <i-input width="auto" height="auto" margin={{left: 20, top: 20}}
                    background={{color: "transparent"}}
                    caption="This is the textarea" captionWidth={150} inputType="textarea" 
                    placeholder="please input something" readOnly={false} showClearButton={true} rows={3} multiline={true}
                />
            </i-panel>
        )
    }
}