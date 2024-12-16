import { Module, Accordion, AccordionItem } from '@ijstech/components';
export default class IAccordionExample extends Module {
    private accordion: Accordion;
    private item2: AccordionItem;

    init() {
        super.init();
    }

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

    handleUpdate() {
        this.item2.name = 'Header 2-updated';
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
                    caption='Update name'
                    onClick={this.handleUpdate}
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
}
