import { Module, observable, customElements, Input, Repeater, Control } from '@ijstech/components';

@customElements('i-module1')
export default class IObservableExample extends Module {
    @observable()
    private _data: any = {
        title: '',
        about: '',
        tags: []
    }

    private handleButtonClick() {
        console.log('Save button clicked', this._data);
    }

    private addTag() {
        this._data.tags.push('New Tag');
    }

    private onRender(parent: Control, index: number) {
        const item = parent.children[index]
        const inputElm = item.querySelector('i-input') as Input;
        inputElm.value = this._data.tags[index];
        inputElm.onObserverChanged = (target: Control, event?: Event) => {
            this._data.tags[index] = (target as Input).value;
        }
    }

    init() {
        super.init();
        this._data.tags = ['New Tag 1', 'New Tag 2', 'New Tag 3'];
    }

    render() {
        return <i-vstack
            position='relative'
            width='100%'
            gap={16}
            padding={{ "top": "12px", "right": "16px", "bottom": "12px", "left": "16px" }}
        >
            <i-vstack
                position='relative'
                width='100%'
                gap={8}
            >
                <i-label
                    position='relative'
                    caption='Title'
                >
                </i-label>
                <i-input
                    value={this._data.title}
                    position='relative'
                    width='100%'
                    height='32px'
                    padding={{ "left": "8px", "right": "8px" }}
                    border={{ "width": "0px", "radius": "5px" }}
                >
                </i-input>
            </i-vstack>
            <i-vstack
                position='relative'
                width='100%'
                gap={8}
            >
                <i-label
                    position='relative'
                    caption='About'
                >
                </i-label>
                <i-input
                    value={this._data.about}
                    position='relative'
                    width='100%'
                    height='32px'
                    padding={{ "left": "8px", "right": "8px" }}
                    border={{ "width": "0px", "radius": "5px" }}
                >
                </i-input>
            </i-vstack>
            <i-vstack
                position='relative'
                width='100%'
                gap={8}
            >
                <i-hstack verticalAlignment="center" horizontalAlignment="space-between">
                    <i-label
                        position='relative'
                        caption='Tags'
                    >
                    </i-label>
                    <i-button
                        position='relative'
                        caption='Add'
                        width='50px'
                        height='30px'
                        border={{ "width": "0px", "radius": "5px" }}
                        onClick={this.addTag}
                    ></i-button>
                </i-hstack>
                <i-repeater id="pnlTags" data={this._data.tags} onRender={this.onRender}>
                    <i-input
                        position='relative'
                        width='100%'
                        height='32px'
                        border={{ "width": "0px", "radius": "5px" }}
                        padding={{ "left": "8px", "right": "8px" }}
                    >
                    </i-input>
                </i-repeater>
            </i-vstack>
            <i-hstack
                horizontalAlignment='end'
                verticalAlignment='center'
            >
                <i-button
                    id='btnSave'
                    minHeight={36}
                    minWidth={120}
                    caption='Save'
                    border={{ "radius": 18 }}
                    padding={{ "top": "0.25rem", "bottom": "0.25rem", "left": "1rem", "right": "1rem" }}
                    margin={{ "top": "0.25rem", "bottom": "0.5rem" }}
                    font={{ "color": "var(--colors-primary-contrast_text)", "bold": true }}
                    onClick={this.handleButtonClick}
                >
                </i-button>
            </i-hstack>
        </i-vstack>
    }
}
