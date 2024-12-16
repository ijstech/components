import { Module} from '@ijstech/components';
export default class IStack extends Module {
    render() {
        return (
            <i-panel height="100%" width="100%" padding={{left: 10, right: 10, top: 10, bottom: 10}}>
                <i-stack id='pnlButton' padding={{left: 4}} 
                    gap={10} wrap="nowrap" direction="vertical" 
                    justifyContent="end" alignItems="center"
                    grid={{ area: 'pnlButton' }} 
                    mediaQueries={[{maxWidth: '500px', properties: {direction: 'horizontal'}}]}
                >
                    <i-button width={30} height={30} icon={{ name: 'file-code' }} margin={{bottom: 6}}></i-button>
                    <i-button width={30} height={30} icon={{ name: 'search' }} margin={{bottom: 6}}></i-button>
                    <i-button width={30} height={30} icon={{ name: 'code-branch' }} margin={{bottom: 6}}></i-button>
                </i-stack>
            </i-panel>
        )
    }
}