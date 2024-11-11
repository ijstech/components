import {Module, Label} from '@ijstech/components';
export default class IButtonExample extends Module{
    private label: Label;
    private counter: number = 0;

    btnClick(action: string) {
        if (action == "Add")
            this.counter++;
        else
            this.counter--;

        this.label.caption = 'Counter: ' + this.counter.toString();
    }

    render(){
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-label top={10} left={10} id='label' caption={'Counter: 0'}></i-label>
                <i-button top={50} left={10} padding={{left: 5, right: 5, top: 5, bottom: 5}} 
                    caption="Click me!" icon={{ name: "angle-up"}} onClick={() => this.btnClick("Add")} 
                ></i-button>
                <i-button top={90} left={10} padding={{left: 5, right: 5, top: 5, bottom: 5}} 
                    caption="Click me too!" rightIcon={{ name: "angle-down" }} onClick={() => this.btnClick("Reduce")} 
                ></i-button>
            </i-panel>
        )
    }
}
