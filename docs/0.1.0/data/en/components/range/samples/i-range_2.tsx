import {Module, Label, Range, observable} from '@ijstech/components';
export default class RangeSample extends Module{
    private label: Label;
    private range: Range;

    @observable()
    private _value: number = 0;

    tipFormatter(value: any) {
        return `${Number(value).toFixed()}%`;
    }

    onChanged(){
        this.label.caption = 'Range value: ' + this.range.value.toString() + '%';
    }

    init() {
        super.init();
        setTimeout(() => {
            this._value = 50;
            this.label.caption = 'Range value: ' + this.range.value.toString() + '%';
        }, 1000)
    }

    render() {
        return (
            <i-vstack gap="0.5rem" height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}} horizontalAlignment="center">
                <i-label id='label' caption='Range value: 0%' padding={{left: 20}}></i-label>
                <i-range
                    id='range'
                    value={this._value}
                    width={200} height="auto"
                    trackColor="pink"
                    min={0} max={100}
                    step={10} stepDots={10}
                    tooltipFormatter={this.tipFormatter}
                    tooltipVisible={true}
                    onChanged={this.onChanged}
                />
            </i-vstack>
        )
    }
}