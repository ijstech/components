# Tabs

Use to display information by switching to different views. A tabs starts with the [`i-tabs`](components/Tabs/iTabs/README.md) tag. Each tabs item starts with the [`i-tab`](components/Tabs/iTab/README.md) tag.

* [`i-tabs`](components/Tabs/iTabs/README.md) defines the element contains one or more [`i-tab`](components/Tabs/iTab/README.md) elements.
* [`i-tab`](components/Tabs/iTab/README.md) defines the elements in the tabs slider.

## Sample Codes 

### Property
```typescript(samples/i-tabs_1.tsx)
getActiveTab() {
    let tmp: Tab = this.tabs.activeTab;
    this.label.caption = "Active Tab is: " + tmp.caption + "(#" + tmp.index + ")";
}

render() {
    return (
        <i-panel height="100%" width="100%" padding={{ left: 10, right: 10, top: 10, bottom: 10 }}>
            <i-label id='label' caption='Active Tab is: '></i-label>
            <i-tabs
                id="tabs" mode={'horizontal'}
                closable={true} draggable={true}
                activeTabIndex={1}
                onChanged={this.getActiveTab}
                mediaQueries={
                    [
                        {
                            maxWidth: '767px',
                            properties: {
                                mode: 'vertical'
                            }
                        }
                    ]
                }
            >
                <i-tab caption='Tab1' font={{ size: '14px' }} icon={{ name: 'angle-right' }}></i-tab>
                <i-tab caption='Tab2' font={{ size: '12px' }} icon={{ name: 'angle-right' }}></i-tab>
                <i-tab caption='Tab3' font={{ size: '22px', color: 'red' }} icon={{ name: 'angle-right' }}></i-tab>
            </i-tabs>
        </i-panel>
    )
}
```
**Tip**: _The property `id` is inherited from [`Control`](components/Control/README.md)_

### Event
```typescript(samples/i-tabs_3.tsx)
changeTab() {
    this.label1.caption = 'The tab is changed!'
}

closeTab() {
    this.label2.caption = 'The tab is closed!'
}

render() {
    return (
        <i-vstack height="100%" width="100%" padding={{ left: 10, right: 10, top: 10, bottom: 10 }} gap="1rem">
            <i-panel><i-label id='label1' caption='Try to select another tab'></i-label></i-panel>
            <i-panel><i-label id='label2' caption='Try to close another tab'></i-label></i-panel>
            <i-tabs mode={'horizontal'} closable={true} draggable={true}
                onChanged={this.changeTab} onCloseTab={this.closeTab}
            >
                <i-tab caption='Tab1'></i-tab>
                <i-tab caption='Tab2'></i-tab>
                <i-tab caption='Tab3'></i-tab>
            </i-tabs>
        </i-vstack>
    )
}
```

### Function
```typescript(samples/i-tabs_2.tsx)
 addTab() {
    this.tabs1.add({ caption: 'new tab' })
}
deleteTab() {
    this.tabs1.delete(this.tabs1.activeTab)
}
render() {
    return (
        <i-panel height="100%" width="100%" padding={{ left: 10, right: 10, top: 10, bottom: 10 }}>
            <i-panel>
                <i-hstack width="100%" height="100%" margin={{ bottom: 20 }} gap="10px">
                    <i-button height="50" padding={{ left: 10, right: 10, top: 10, bottom: 10 }} caption='Click here to add a new tab' onClick={this.addTab}></i-button>
                    <i-button height="50" padding={{ left: 10, right: 10, top: 10, bottom: 10 }} caption='Click here to delete the current tab' onClick={this.deleteTab}></i-button>
                </i-hstack>
            </i-panel>
            <i-panel>
                <i-tabs id='tabs1' mode='horizontal' closable={true} draggable={true}>
                    <i-tab caption='Tab1'></i-tab>
                    <i-tab caption='Tab2'></i-tab>
                    <i-tab caption='Tab3'></i-tab>
                </i-tabs>
            </i-panel>
        </i-panel>
    )
}
```
**Tip**: _The property `id` is inherited from [`Control`](components/Control/README.md)_