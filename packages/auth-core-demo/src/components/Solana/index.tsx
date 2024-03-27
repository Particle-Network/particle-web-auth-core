import { SafetyCertificateTwoTone } from '@ant-design/icons';
import { useConnect, useSolana } from '@particle-network/auth-core-modal';
import { useRequest } from 'ahooks';
import { Button, message } from 'antd';
import SolanaAllTransaction from './AllTransaction';
import SolanaSignMessage from './SignMessage';
import SignSolanaTransaction from './SignTransaction';
import SolanaTransaction from './Transaction';

const Solana = () => {
    const { address, enable } = useSolana();
    const { connected } = useConnect();

    const { run: createWallet, loading } = useRequest(enable, {
        manual: true,
        onSuccess: () => {
            message.success('Enable success');
        },
        onError: (error: any) => {
            message.error(error.message || error);
        },
    });

    return (
        <div className="transaction card">
            <div className="chain-title">
                <h2 className="line-title">
                    <SafetyCertificateTwoTone /> &nbsp; Solana
                </h2>

                {connected && !address && (
                    <Button type="primary" onClick={createWallet} loading={loading}>
                        Enable
                    </Button>
                )}
            </div>

            <>
                <SolanaTransaction />
                <SignSolanaTransaction />
                <SolanaAllTransaction />
                <SolanaSignMessage />
            </>
        </div>
    );
};
export default Solana;
