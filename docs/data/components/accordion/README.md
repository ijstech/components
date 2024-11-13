# Accordion

A accordion is a vertically stacked set of panels that are collapsed by default. Clicking an accordion item will expand or collapse it. The component `i-accordion` is used to define a accordion.

- [`i-accordion`](components/Accordion/iAccordion/README.md) defines the element contains one or more [`i-accordion-item`](components/Accordion/iAccordionItem/README.md) elements.
- [`i-accordion-item`](components/Accordion/iAccordionItem/README.md) defines the elements in the accordion.

## Sample Codes

### Property

```typescript(samples/i-accordion_1.tsx)
    render(){
    return <i-panel
        height='100%'
        width='100%'
        padding={{"left":10,"right":10,"top":10,"bottom":10}}
>
        <i-accordion
            id='accordion_1'
            width='100%'
            isFlush={true}
        >
            <i-accordion-item
                name='Header 1'
                defaultExpanded={true}
            >
                <i-label
                    caption='Content 1'
                >
                </i-label>
            </i-accordion-item>
            <i-accordion-item
                name='Header 2'
            >
                <i-label
                    caption='Content 2'
                >
                </i-label>
            </i-accordion-item>
            <i-accordion-item
                name='Header 3'
            >
                <i-label
                    caption='Content 3'
                >
                </i-label>
            </i-accordion-item>
        </i-accordion>
    </i-panel>
}
```

### Event

```typescript(samples/i-accordion_2.tsx)
async onCustomItemRemoved(item: AccordionItem) {
    this.label1.caption = 'Removed item: ' + item.name;
}

render() {
    return <i-panel
        height='100%'
        width='100%'
        padding={{ "left": 10, "right": 10, "top": 10, "bottom": 10 }}
    >
        <i-label id='label1' caption='Removed item: ' font={{ size: '16px', color: 'red' }} margin={{"top":"10px","right":"10px","bottom":"10px","left":"10px"}}></i-label>
        <i-accordion
            width='100%'
            padding={{ "top": "0px", "right": "16px", "bottom": "0px", "left": "16px" }}
            margin={{ "bottom": "12px" }}
            onCustomItemRemoved={this.onCustomItemRemoved}
        >
            <i-accordion-item
                width='100%'
                name="Relays"
                defaultExpanded={true}
                showRemove={true}
                font={{ "size": "20px", "weight": "600" }}
            >
                <i-stack
                    width='100%'
                    position="relative"
                    direction="vertical"
                    gap={24}
                    padding={{ "top": "0px", "right": "0px", "bottom": "0px", "left": "0px" }}
                    margin={{ "top": "12px" }}
                >
                    <i-label
                        caption="My Relays"
                        link={{ "target": "_blank" }}
                        font={{ "size": "18px", "weight": "400" }}
                        opacity="0.6"
                    >
                    </i-label>
                    <i-stack
                        width='100%'
                        position="relative"
                        direction="vertical"
                    >
                    </i-stack>
                    <i-label
                        caption="Your Nostr account doesn't have any relays specified, so we connected you to a default set of relays. To configure your desired set of relays, please select them from the list below."
                        link={{ "target": "_blank" }}
                        font={{ "weight": "400" }}
                    >
                    </i-label>
                    <i-label
                        caption="Recommended Relays"
                        link={{ "target": "_blank" }}
                        font={{ "size": "18px", "weight": "400" }}
                        opacity="0.6"
                    >
                    </i-label>
                </i-stack>
            </i-accordion-item>
            <i-accordion-item
                width='100%'
                name="Storage Service"
                font={{ "size": "20px", "weight": "600" }}
                showRemove={true}
            >
                <i-stack
                    width='100%'
                    position="relative"
                    direction="vertical"
                    gap={24}
                    margin={{ "top": "12px", "bottom": "12px" }}
                >
                    <i-label
                        caption="Connected storage service"
                        font={{ "weight": "400", "size": "18px" }}
                        opacity="0.6"
                    >
                    </i-label>
                </i-stack>
            </i-accordion-item>
        </i-accordion>
    </i-panel>
}
```

### Function

```typescript(samples/i-accordion_3.tsx)
handleAdd() {
    const item = this.accordion.add({
        name: 'New item',
        defaultExpanded: false,
        showRemove: true
    })
    item.add(<i-label caption='Content' font={{ size: '14px', color: 'red' }}></i-label>)
}

handleRemove() {
    this.accordion.delete(this.item2);
}

handleClear() {
    this.accordion.clear();
}

render() {
    return <i-panel
        height='100%'
        width='100%'
        padding={{ "left": 10, "right": 10, "top": 10, "bottom": 10 }}
    >
        <i-hstack
            width='100%'
            margin={{ bottom: 20 }}
            gap='10px'
        >
            <i-button
                caption='Add'
                height={40}
                width={80}
                onClick={this.handleAdd}
            ></i-button>
            <i-button
                height={40}
                width={80}
                caption='Remove'
                onClick={this.handleRemove}
            ></i-button>
            <i-button
                height={40}
                width={80}
                caption='Clear'
                onClick={this.handleClear}
            ></i-button>
        </i-hstack>
        <i-accordion
            id='accordion'
            width='100%'
        >
            <i-accordion-item
                name='Header 1'
                defaultExpanded={true}
            >
                <i-label
                    caption='Content 1'
                >
                </i-label>
            </i-accordion-item>
            <i-accordion-item
                id="item2"
                name='Header 2'
            >
                <i-label
                    caption='Content 2'
                >
                </i-label>
            </i-accordion-item>
            <i-accordion-item
                name='Header 3'
            >
                <i-label
                    caption='Content 3'
                >
                </i-label>
            </i-accordion-item>
        </i-accordion>
    </i-panel>
}
```
