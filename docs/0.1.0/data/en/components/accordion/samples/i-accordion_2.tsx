import {
    Module,
    customModule,
    Container,
    AccordionItem,
    Label
} from '@ijstech/components';

@customModule
export class IAccordionExample extends Module {
    private label1: Label;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    init() {
        super.init();
    }

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
}
