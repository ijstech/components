import { Module} from '@ijstech/components';
export default class ICardLayoutExample extends Module {
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-card-layout id="cardLayout" cardMinWidth="100px" cardHeight="100px" columnsPerRow={3} gap={{column: '1rem', row: '1rem'}}>
                    <i-panel background={{color: "yellow"}}><i-button width="50%" height="50%" caption="Btn1"></i-button></i-panel>
                    <i-panel background={{color: "blue"}}><i-button width="50%" height="50%" caption="Btn2"></i-button></i-panel>
                    <i-panel background={{color: "red"}}><i-button width="50%" height="50%" caption="Btn3"></i-button></i-panel>
                    <i-panel background={{color: "red"}}><i-button width="50%" height="50%" caption="Btn4"></i-button></i-panel>
                    <i-panel background={{color: "yellow"}}><i-button width="50%" height="50%" caption="Btn5"></i-button></i-panel>
                    <i-panel background={{color: "blue"}}><i-button width="50%" height="50%" caption="Btn6"></i-button></i-panel>
                </i-card-layout>
            </i-panel>
        )
    }
}
