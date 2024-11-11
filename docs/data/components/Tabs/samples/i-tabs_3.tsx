import {Module, Label} from '@ijstech/components';

export default class ITabExample extends Module{
    private label1: Label;
    private label2: Label;

    changeTab() {
        this.label1.caption='The tab is changed!'
    }
    
    closeTab() {
        this.label2.caption='The tab is closed!'
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-panel><i-label id='label1' caption='Try to select another tab'></i-label></i-panel>
                <i-panel><i-label id='label2' caption='Try to close another tab'></i-label></i-panel>
                <i-tabs mode = {'horizontal'} closable = {true} draggable = {true}
                    onChanged = {this.changeTab} onCloseTab = {this.closeTab}
                >
                    <i-tab caption='Tab1'></i-tab>
                    <i-tab caption='Tab2'></i-tab>
                    <i-tab caption='Tab3'></i-tab>
                </i-tabs>
            </i-panel>
        )
    }
}
