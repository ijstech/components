import {Module} from '@ijstech/components';
export default class IDatepickerSample extends Module {
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-panel padding={{top: 10, bottom: 10}}><i-datepicker width={240} height={25} caption="Date" captionWidth={80} dateTimeFormat="YYYY-MM-DD" placeholder="YYYY-MM-DD"></i-datepicker></i-panel>
                <i-panel padding={{top: 10, bottom: 10}}><i-datepicker width={240} height={25} caption="Time" captionWidth={80} type='time' dateTimeFormat="hh:mm A"></i-datepicker></i-panel>
                <i-panel padding={{top: 10, bottom: 10}}><i-datepicker width={280} height={25} caption="Date Time" captionWidth={80} type='dateTime' dateTimeFormat="YYYY-MM-DD hh:mm:ss A"></i-datepicker></i-panel>
            </i-panel>
        )
    }
}