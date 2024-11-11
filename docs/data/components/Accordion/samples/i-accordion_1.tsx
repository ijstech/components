import { Module, Accordion } from '@ijstech/components';
export default class IAccordionExample extends Module {
    private accordion_1: Accordion;

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
}
