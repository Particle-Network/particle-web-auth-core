import { useConnect, useEthereum } from '@particle-network/auth-core-modal';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
    const { address } = useEthereum();
    const { connect, connected, disconnect } = useConnect();

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                {address && <div>{address} </div>}
                {connected ? (
                    <button onClick={() => disconnect()}>Disconnect</button>
                ) : (
                    <button onClick={() => connect()}>Connect</button>
                )}
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </>
    );
}

export default App;
