import { Module, Control, Datepicker, Label, observable } from '@ijstech/components';
export default class IDatepickerSample extends Module {
    private label1: Label;

    @observable()
    private dateStr: string = '';

    onDateChanged(source: Control, event: Event) {
        this.label1.caption = "changed date: " + (source as Datepicker).value;
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <i-panel padding={{ top: 10, bottom: 10 }}>
                    <i-label id='label1' caption="Change date: "></i-label>
                </i-panel>
                <i-panel padding={{ top: 10, bottom: 10 }}>
                    <i-datepicker
                        width={240} height={25}
                        caption="Date"
                        captionWidth={40}
                        dateTimeFormat="YYYY-MM-DD"
                        placeholder="YYYY-MM-DD"
                        valueFormat={this.dateStr}
                        onChanged={this.onDateChanged.bind(this)}
                    ></i-datepicker>
                </i-panel>
                <i-label caption={this.dateStr}></i-label>
            </i-panel>
        )
    }
}