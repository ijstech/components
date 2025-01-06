import { Module, customElements, Input, Repeater, Control, Label } from '@ijstech/components';

@customElements('i-module1')
export default class IObservableExample extends Module {
  private _data: any = {
    title: 'Title',
    about: 'About',
    tags: ['New Tag 1', 'New Tag 2', 'New Tag 3']
  }

  onRender(parent: Control, index: number) {
    const inputElm = parent.children[index] as Input;
    if (inputElm)
      inputElm.value = this._data.tags[index];
  }

  render() {
    return <i-vstack
      width='100%' gap={16}
      padding={{ left: '1rem', right: '1rem', top: '1rem' }}
    >
      <i-vstack width='100%' gap={8}>
        <i-label caption='Title'></i-label>
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
      <i-vstack width='100%' gap={8}>
        <i-label caption='About'></i-label>
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
      <i-vstack width='100%' gap={8}>
        <i-label caption='Tags'></i-label>
        <i-repeater id="pnlTags" count={3} onRender={this.onRender}>
          <i-input
            position='relative'
            width='100%'
            height='32px'
            margin={{bottom: 10}}
            border={{ "width": "0px", "radius": "5px" }}
            padding={{ "left": "8px", "right": "8px" }}
          >
          </i-input>
        </i-repeater>
      </i-vstack>
    </i-vstack>
  }
}
