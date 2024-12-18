# Input 

A basic widget for getting the user input is a text field. Keyboard and mouse can be used for providing or changing data.

### `i-input`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                                       | Type             | Default |
| --------------- | -------------------------------------------------                 | ----------       | ------- |
| caption         | Define the name of an `<i-input>`                                 | string           |         |
| captionWidth    | Define the width of the caption                                   | number \| string |         |
| inputType       | Define the type of an `<i-input>` to display                      | [InputType](#inputtype)| `text` |
| value           | Define the value of an `<i-input>`                                | string           |         |
| placeholder     | Define a short hint that describes the expected value of an `<i-input>` | string     |         |
| readOnly        | Define that an `<i-input>` is read-only                           | boolean          | false      |
| showClearButton | Define that an `<i-input>` show the clear button                  | boolean          | false      |
| rows            | Define the visible number of lines in a text area                 | number           | 4       |
| multiline       | Define that a user can enter more than one line in an `<i-input>` | boolean          | false       |
| resize          | Define the resize mode of an `<i-input>` with type `textarea`     | [ResizeType](#resizetype) |   `none`      |
| maxLength       | Define the maximum number of characters in an `<i-input>`         | number           |         |

### InputType
`date` \| `time` \| `dateTime` \| `password` \| `number` \| `textarea`

### ResizeType
`none` \| `auto` \| `both` \| `horizontal` \| `vertical` \| `initial` \| `inherit` \| `auto-grow`;

## Events

| **onChanged**  |                                                  |
| -------------- | ----------------------------------------------   |
| Description    | Callback executed when input field value changed |
| Signature      | onChanged(target: Control, event: Event)         |

| **onKeyDown**  |                                                           |
| -------------- | ----------------------------------------------            |
| Description    | Callback executed when user pressing a key in input field |
| Signature      | onKeyDown(target: Input, val: string)                     |

| **onKeyUp**    |                                                           |
| -------------- | ----------------------------------------------            |
| Description    | Callback executed when user releases a key in input field |
| Signature      | onKeyUp(target: Input, val: string)                       |

| **onBlur**     |                                                   |
| -------------- | ----------------------------------------------    |
| Description    | Callback executed when user leaves an input field |
| Signature      | onBlur(target: Input)                             |

| **onFocus**    |                                                  |
| -------------- | ----------------------------------------------   |
| Description    | Callback executed when an input field gets focus |
| Signature      | onFocus(target: Input)                           |

| **onClearClick** |                                                |
| --------------   | ---------------------------------------------- |
| Description      | Callback executed when click the clear button  |
| Signature        | onFocus(target: Input)                         |

| **onClosed** |                                                    |
| --------------   | ---------------------------------------------- |
| Description      | Callback executed when close the color picker  |
| Signature        | onClosed()                                     |

## Function

| **focus**   |                              |
| ----------- | ---------------------------  |
| Description | Focus the input field |
| Signature   | focus()                      |

## Sample Code

### Property
```typescript(samples/i-input_1.tsx)
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
```
**Tip**: _The properties `width`, `height`, [`padding`](../customDataType/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_

### Event
```typescript(samples/i-input_2.tsx)
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
```
**Tip**: _The properties `width`, [`padding`](../customDataType/README.md#ispace) are inherited from [`Control`](components/Control/README.md)_