# Progress

It use to represents the completion progress of a task.

### `i-progress`

## Class Inheritance
Inherited from [`Control`](components/Control/README.md)

## Properties

| Name            | Description                                            | Type        | Default |
| --------------- | -------------------------------------------------      | ----------  | ------- |
| percent         | Define the percent value of an `<i-progress>`          | number      | 0       |
| strokeWidth     | Define the stroke width  of an `<i-progress>`          | number      | 2       |
| strokeColor     | Define the stroke color of an `<i-progress>`           | Types.Color |         |
| loading         | Define that an `<i-progress>` have loading event       | boolean     | false   |
| steps           | Define the legal number intervals of an `<i-progress>` | number      | 1       |
| type            | Define the type of an `<i-progress>` to display        | [ProgressType](#progresstype) | `line` |
| format          | Define the format of an `<i-progress>`                 | number      |         |

### ProgressType
`line` \| `circle`

## Events

| **onRenderStart** |                                                |
| --------------    | ---------------------------------------------- |
| Description       | Callback executed when the render start        |
| Signature         | onRenderStart(source: Control)                 |

| **onRenderEnd** |                                                |
| --------------  | ---------------------------------------------- |
| Description     | Callback executed when the render stop         |
| Signature       | onRenderEnd(source: Control)                   |

## Sample Code

### Property
```typescript(samples/i-progress_1.tsx)
addProgress() {
    let total: number = 100;

    if (this.progress < total) {
        this.progress++;
        this.percent = (this.progress / total) * 100;
    } else {
        this.progress = 0;
        this.percent = 0
    }

    this.progress1.percent = this.percent;
    this.progress1.format = () => this.percent + '%';
    this.progress2.percent = this.percent;
    this.progress3.percent = this.percent;
    this.progress3.format = () => this.percent + '%';
}
init(){
    super.init();
    setInterval(() => {
        this.addProgress();
    }, 500);
}
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-panel padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-progress id="progress1" strokeWidth={5} strokeColor="white" loading={true}></i-progress>
            </i-panel>
    
            <i-panel padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-progress id="progress2" percent={78.6} steps={5}></i-progress>
            </i-panel>
    
            <i-panel padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-progress id="progress3" type="circle" width={126} height={126} strokeColor="red"></i-progress>
            </i-panel>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, `width`, `height` are inherited from [`Control`](components/Control/README.md)_

### Event
```typescript(samples/i-progress_2.tsx)
addProgress() {
    let total: number = 2500;

    if (this.progress < total) {
        this.progress++;
        this.percent = (this.progress / total) * 100;
    } else {
        this.progress = 0;
        this.percent = 0
    }

    this.progress1.percent = this.percent;
    this.progress1.format = () => this.progress + '/' + total;
}
init(){
    super.init();
    setInterval(() => {
        this.addProgress();
    }, 500);
}
render() {
    return (
        <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
            <i-progress id="progress1" height={50} strokeWidth={10} strokeColor="white"
                onRenderStart={(source: Control) => {
                    source.appendChild(
                        <i-label caption="Render Start" padding={{ top: '0.3rem', bottom: '0.3rem', left: '1rem', right: '1rem' }} font={{ name: 'Helvetica' }}/>
                    )
                }}
                onRenderEnd={(source: Control) => {
                    source.appendChild(
                        <i-label caption="Render End" padding={{ top: '0.3rem', bottom: '0.3rem', left: '1rem', right: '1rem' }} font={{ name: 'Helvetica' }}/>
                    )
                }}
            ></i-progress>
        </i-panel>
    )
}
```
**Tip**: _The properties `id`, `height`, [`padding`](../customDataType/README.md#ispace), [`font`](../customDataType/README.md#ifont) are inherited from [`Control`](components/Control/README.md)_