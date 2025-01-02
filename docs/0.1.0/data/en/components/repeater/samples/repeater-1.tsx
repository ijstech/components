import {
  Module,
  customElements,
  Container,
  Repeater,
  observable,
  Control,
  Label
} from '@ijstech/components';

@customElements('i-module1')
export class RepeaterTest extends Module {
  private repeater: Repeater;

  @observable('dataList', true)
  private dataList: any[] = [];

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  onRender(parent: Control, index: number) {
    const item = parent.children[index]
    const label = item.querySelector('#lbItem') as Label;
    if (label) {
      label.caption = this.dataList?.[index]?.name || 'Untitled';
    }
  }

  init() {
    super.init();
    this.dataList.push({ name: 'New Item 1', value: '1' });
    this.dataList.push({ name: 'New Item 2', value: '2' });

    setTimeout(() => {
      this.dataList.push({ name: 'New Item 3', value: '3' });
      this.dataList.push({ name: 'New Item 4', value: '4' });
    }, 1000);

    setTimeout(() => {
      this.dataList.shift();
    }, 2000);
  }

  render() {
    return <i-panel
      id={'wrapper'}
      padding={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <i-repeater
        id="repeater"
        data={this.dataList}
        layout="horizontal"
        gap={10}
        onRender={this.onRender}
      >
        <i-hstack gap={'1rem'} verticalAlignment='center' justifyContent='space-between' padding={{ top: '0.5rem', bottom: '0.5rem' }}>
          <i-hstack gap={`0.5rem`} verticalAlignment='center'>
            <i-image url="https://picsum.photos/200/300" width="40px" height="40px" rotate={90} border={{ radius: '50%' }} objectFit='cover'></i-image>
            <i-label id="lbItem" caption='Repeater item' font={{ bold: true }}></i-label>
          </i-hstack>
          <i-icon name='edit' width='16px' height='16px' stack={{ shrink: '0' }} fill='#007bff'></i-icon>
        </i-hstack>
      </i-repeater>
    </i-panel>
  }
}
