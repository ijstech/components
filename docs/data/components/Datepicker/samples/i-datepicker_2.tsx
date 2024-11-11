import {Module, Control, Datepicker, Label} from '@ijstech/components';
export default class IDatepickerSample extends Module {
    private label1: Label;

    onDateChanged(source: Control, event: Event) {
        this.label1.caption = "changed date: " + (source as Datepicker).value;
    }
    
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-panel padding={{top: 10, bottom: 10}}><i-panel><i-label id='label1' caption='changed date: '></i-label></i-panel></i-panel>
                <i-panel padding={{top: 10, bottom: 10}}><i-datepicker width={240} height={25} caption="Date" captionWidth={40} dateTimeFormat="YYYY-MM-DD" placeholder="YYYY-MM-DD" 
                    onChanged={this.onDateChanged.bind(this)}
                ></i-datepicker></i-panel>
            </i-panel>
        )
    }
}