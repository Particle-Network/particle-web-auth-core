import { useConnect, useEthereum, useSolana } from '@particle-network/auth-core-modal';
import './App.css';

function App() {
    const { connect, disconnect, connectionStatus } = useConnect();

    // use for evm chains
    const { address, chainId, provider, sendTransaction, signMessage, signTypedData } = useEthereum();

    // use for solana chains
    const { address: solanaAddress, signAndSendTransaction } = useSolana();

    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                {connectionStatus !== 'connected' && (
                    <>
                        <button className="btn" onClick={handleConnect}>
                            {connectionStatus === 'disconnected' ? 'CONNECT' : connectionStatus.toUpperCase()}
                        </button>
                    </>
                )}

                {connectionStatus === 'connected' && (
                    <>
                        <button className="btn" onClick={handleDisconnect}>
                            DISCONNECT
                        </button>
                    </>
                )}
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://docs.particle.network" target="_blank" rel="noopener noreferrer">
                    Learn AuthCore
                </a>
            </header>
        </div>
    );
}

export default App;
