import { Module} from '@ijstech/components';
export default class IVstack extends Module {
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-vstack width="100%" height="100%" margin={{bottom: 20}} gap="10px" verticalAlignment="center" horizontalAlignment="center">
                    <i-button id="withdrawBtn" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Withdraw'></i-button>
                    <i-button id="stakeBtn" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Stake'></i-button>
                    <i-button id="unstakeBtn" padding={{left: 10, right: 10, top: 10, bottom: 10}} caption='Unstake'></i-button>
                </i-vstack>
            </i-panel>
        )
    }
}