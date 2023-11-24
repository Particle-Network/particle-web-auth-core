import type { SmartAccount } from '@particle-network/aa';
// import type { Web3 } from 'web3';

declare global {
    interface Window {
        web3: Web3;
        smartAccount: SmartAccount;
    }
}

declare module '*.less' {
    const content: { [className: string]: string };
    export default content;
}

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare module '@nbfe/react-color';
