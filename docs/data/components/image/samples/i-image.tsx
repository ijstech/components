import {Module} from '@ijstech/components';
export default class IImageSample extends Module {
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-image width="50%" height="50%" rotate={45} url="https://ipfs.ijs.dev/ipfs/QmX5dS7t1qBWhQoiSD7mUbKVgh38BDpaJ7ZnQoiv2HqRC4/assets/img/openswap-logo-beta.svg" 
                    fallbackUrl="https://www.openswap.xyz/"
                ></i-image>
            </i-panel>
        )
    }
}