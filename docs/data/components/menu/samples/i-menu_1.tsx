import {Module, Menu} from '@ijstech/components';

export default class IMenuSample extends Module{
    private menu1: Menu;
    private menu2: Menu;

    init() {
        super.init();
        this.menu1.data = [
            { title: 'Test 1', link: { href: '/#/test1', target: '_blank' } },
            {
                title: 'Test 2',
                items: [
                    { title: 'Test 2.1', link: { href: '/#/test2_1', target: '_blank' } },
                    {
                        title: 'Test 2.2',
                        items: [
                            { title: 'Test 2.2.1', link: { href: '/#/test2_2_1' } }
                        ]
                    }
                ]
            }
        ];
        this.menu2.data = [
            { title: 'Test 1', link: { href: '/#/test1', target: '_blank' } },
            {
                title: 'Test 2',
                items: [
                    { title: 'Test 2.1', link: { href: '/#/test2_1', target: '_blank' } },
                    {
                        title: 'Test 2.2',
                        items: [
                            { title: 'Test 2.2.1', link: { href: '/#/test2_2_1' } }
                        ]
                    }
                ]
            }
        ];
    }

    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-label caption="horizontal" margin={{ bottom: '0.5rem' }} font={{ bold: true }}></i-label>
                <i-menu id="menu1" mode="horizontal"></i-menu>
                <i-label caption="vertical" margin={{ top: '2rem', bottom: '0.5rem' }} font={{ bold: true }}></i-label>
                <i-menu id="menu2" mode="vertical" maxWidth="500px"></i-menu>
            </i-panel>
        )
    }
}