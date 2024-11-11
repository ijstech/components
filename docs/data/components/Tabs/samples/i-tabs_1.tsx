import {Module, Label, Tabs, Tab} from '@ijstech/components';
export default class ITabExample extends Module{
    private label: Label;
    private tabs: Tabs;

    init() {
        super.init();
        this.getActiveTab();
    }

    getActiveTab() {
        let tmp:Tab = this.tabs.activeTab;
        this.label.caption = "Active Tab is: " + tmp.caption + "(#" + tmp.index + ")";
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-label id='label' caption='Active Tab is: '></i-label>
                <i-tabs id = "tabs" mode = {'horizontal'} closable = {true} draggable = {true} activeTabIndex = {1} onChanged = {this.getActiveTab}>
                    <i-tab caption='Tab1' font={{size:'14px'}} icon={{ name: 'angle-right'}}></i-tab>
                    <i-tab caption='Tab2' font={{size:'12px'}} icon={{ name: 'angle-right'}}></i-tab>
                    <i-tab caption='Tab3' font={{size:'22px', color: 'red'}} icon={{ name: 'angle-right'}}></i-tab>
                </i-tabs>
            </i-panel>
        )
    }
}