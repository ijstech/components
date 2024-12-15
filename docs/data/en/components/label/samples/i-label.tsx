import {Module} from '@ijstech/components';
export default class ILabel extends Module{
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-label caption={"This is the i-label component of Secure Compute!"} link={{ href: "/#/test2_1", target: "_blank"}}></i-label>
                <i-label caption={"This is the i-label component of Secure Compute!"} textDecoration="line-through"></i-label>
            </i-panel>
        )
    }
}
