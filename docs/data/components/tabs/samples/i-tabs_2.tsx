import {Module, Tabs} from '@ijstech/components';
export default class ITabExample extends Module{
    private tabs1: Tabs;

    addTab() {
        this.tabs1.add({caption: 'new tab'})
    }
    deleteTab() {
        this.tabs1.delete(this.tabs1.activeTab)
    }
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-panel>
                    <i-hstack width="100%" height="100%" margin={{bottom: 20}} gap="10px">
                        <i-button height="50" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Click here to add a new tab' onClick={() => this.addTab}></i-button>
                        <i-button height="50" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Click here to delete the current tab' onClick={() => this.deleteTab}></i-button>
                    </i-hstack>
                </i-panel>
                <i-panel>
                    <i-tabs id='tabs1' mode = {'horizontal'} closable = {true} draggable = {true}>
                        <i-tab caption='Tab1' ></i-tab>
                        <i-tab caption='Tab2' ></i-tab>
                        <i-tab caption='Tab3' ></i-tab>
                    </i-tabs>
                </i-panel>
            </i-panel>
        )
    }
}
