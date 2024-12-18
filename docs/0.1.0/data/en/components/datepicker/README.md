# Datepicker

To select or input a date, time or datetime by clicking the input box or select from a popup calendar.

### `i-datepicker`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                       | Type             | Default |
| --------------- | ------------------------------------------------- | ----------       | ------- |
| caption         | Define the name of an `<i-datepicker>`            | string           |         |
| captionWidth    | Define the width of the caption                   | number \| string | 40      |
| value           | Define a value of an `<i-datepicker>`             | Moment.Moment    |         |
| minDate         | Define minimum date of an `<i-datepicker>`        | Moment.Moment    |         |
| placeholder     | Define a short hint that describes the expected value of an `<i-datepicker>` | string | |
| type            | Define the date type of an `<i-datepicker>`       | [dateType](#datetype) |   `date`    |
| dateTimeFormat  | Define the input format of an `<i-datepicker>`    | string           |         |

### dateType
`date` \| `dateTime` \| `time`;

## Event

| **onChanged**  |                                                |
| -------------- | ---------------------------------------------- |
| Description    | Callback executed when Datepicker value changed |
| Signature      | onChanged(target: Control, event: Event)       |

## Sample Code 

### Property
```typescript(samples/i-datepicker_1.tsx)
render() {
    return (
        <i-vstack height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}} gap={'1rem'}>
            <i-datepicker width={240} height={25} caption="Date" captionWidth={80} dateTimeFormat="YYYY-MM-DD" placeholder="YYYY-MM-DD"></i-datepicker>
            <i-datepicker width={240} height={25} caption="Time" captionWidth={80} type='time' dateTimeFormat="hh:mm A"></i-datepicker>
            <i-datepicker width={280} height={25} caption="Date Time" captionWidth={80} type='dateTime' dateTimeFormat="YYYY-MM-DD hh:mm:ss A"></i-datepicker>
        </i-vstack>
    )
}
```
**Tip**: _The properties `width`, `height` are inherited from [`Control`](components/Control/README.md)_

### Event
```typescript(samples/i-datepicker_2.tsx)
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
```
**Tip**: _The properties `id`, `width`, `height`, [`padding`](../customDataType/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_