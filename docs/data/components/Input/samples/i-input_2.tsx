import {Module, Label} from '@ijstech/components';
export default class InputSample extends Module{
    private label1: Label;
    private label2: Label;
    private label3: Label;
    private label4: Label;
    private label5: Label;
    private label6: Label;
    private clearCounter: number = 0;
    private changeCounter: number = 0;
    private keydownCounter: number = 0;
    private keyupCounter: number = 0;
    private onblurCounter: number = 0;
    private focusCounter: number = 0;
    
    clearcallback(){
        this.clearCounter += 1;
        this.label1.caption = 'Clear counter: ' + this.clearCounter.toString();
    }
    change(){
        this.changeCounter += 1;
        this.label2.caption = 'Change counter: ' + this.changeCounter.toString();
    }
    keydown(){
        this.keydownCounter += 1;
        this.label3.caption = 'Key down counter: ' + this.keydownCounter.toString();
    }
    keyup(){
        this.keyupCounter += 1;
        this.label4.caption = 'Key up counter: ' + this.keyupCounter.toString();
    }
    _onblur(){
        this.onblurCounter += 1;
        this.label5.caption = 'Blur counter: ' + this.onblurCounter.toString();
    }
    onfoucus(){
        this.focusCounter += 1;
        this.label6.caption = 'Focus counter: ' + this.focusCounter.toString();
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-input width="100%"
                    background={{color: "transparent"}}
                    height="2rem" padding={{left: 20}}
                    caption={'please input something here'} captionWidth={175} showClearButton={true}
                    onClearClick={this.clearcallback} onChanged={this.change}
                    onKeyDown={this.keydown} onKeyUp={this.keyup}
                    onBlur={this._onblur}  onFocus={this.onfoucus}
                ></i-input>
                <i-panel><i-label id='label1' caption='Clear counter: 0' padding={{left: 20}}></i-label></i-panel>
                <i-panel><i-label id='label2' caption='Change counter: 0' padding={{left: 20}}></i-label></i-panel>
                <i-panel><i-label id='label3' caption='Key down counter: 0' padding={{left: 20}}></i-label></i-panel>
                <i-panel><i-label id='label4' caption='Key up counter: 0' padding={{left: 20}}></i-label></i-panel>
                <i-panel><i-label id='label5' caption='Blur counter: 0' padding={{left: 20}}></i-label></i-panel>
                <i-panel><i-label id='label6' caption='Focus counter: 0' padding={{left: 20}}></i-label></i-panel>
            </i-panel>
        )
    }
}