import {Module, Label, application, ComboBox, Locales} from '@ijstech/components';
export default class IButtonExample extends Module{
    private label: Label;
    private cbLocale: ComboBox;

    async init(){
        this.i18n.init({
            'en': {
                'hello': 'Hello',
            },
            'zh-hant': {
                'hello': '你好'
            }
        });
        super.init();
    }
    localeChanged(){
        if (this.cbLocale.selectedItem)
            application.locale = this.cbLocale.selectedItem.value as Locales;
    }
    render(){
        return (
            <i-panel padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-combo-box id='cbLocale' onChanged={this.localeChanged} value="en">
                    <i-combo-box-item value="en">English</i-combo-box-item>
                    <i-combo-box-item value="zh-hant">繁體中文</i-combo-box-item>
                </i-combo-box>
                <i-label id='label' caption={'$hello'}></i-label>
            </i-panel>
        )
    }
}
