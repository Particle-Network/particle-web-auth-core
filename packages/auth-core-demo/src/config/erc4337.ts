export const options = {
    BICONOMY_V1: {
        NAME: 'BiconomyV1 Account',
        SUPPORTED_CHAIN_IDS: [1, 5, 137, 56, 97, 42161, 42170, 421613, 10, 420, 43114, 43113, 8453, 84531, 1101, 59140],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    BICONOMY_V2: {
        NAME: 'Biconomy Account',
        SUPPORTED_CHAIN_IDS: [
            1, 5, 11155111, 137, 56, 97, 42161, 42170, 421613, 421614, 10, 420, 43114, 43113, 8453, 84531, 1101, 59144,
            59140, 204, 5611, 5000, 5001, 169, 3441005, 9980, 91715, 1284, 534351, 168587773,
        ],
        BATCH_TX: true,
        VERSION: '2.0.0',
    },
    SIMPLE: {
        NAME: 'Simple Account',
        SUPPORTED_CHAIN_IDS: [
            1, 5, 11155111, 17000, 137, 80002, 56, 97, 204, 5611, 42161, 42170, 421613, 421614, 43114, 43113, 8453,
            84531, 84532, 59144, 59140, 10, 420, 11155420, 169, 3441005, 5000, 5003, 534352, 534351, 100, 10200, 424,
            58008, 88, 89, 1284, 1285, 1287, 1101, 250, 4002, 9980, 91715, 42766, 43851, 167008, 195, 3776, 6038361,
            12008, 12015, 7000, 7001, 1116, 1115, 34443, 919, 888888888, 28122024, 81457, 168587773, 80085, 112358,
            1637450, 202402181627, 13473, 2241, 9990,
        ],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    CYBERCONNECT: {
        NAME: 'Cyber Account',
        SUPPORTED_CHAIN_IDS: [
            1, 11155111, 56, 97, 10, 420, 137, 8453, 84531, 59144, 59140, 42161, 421613, 204, 5611, 534352, 534351,
        ],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    LIGHT: {
        NAME: 'Alchemy Account',
        SUPPORTED_CHAIN_IDS: [1, 11155111, 10, 420, 137, 8453, 84531, 42161, 421613],
        BATCH_TX: true,
        VERSION: '1.0.2',
    },
    // 这个仅支持 BTC 钱包，不支持 Particle Auth 和 MetaMask 这种 EVM 钱包
    BTC: {
        NAME: 'BTC Account',
        SUPPORTED_CHAIN_IDS: [4200, 686868, 28206, 11503, 1501, 1502, 22776, 212, 3110, 1],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    BTC_V2: {
        NAME: 'BTC Account',
        SUPPORTED_CHAIN_IDS: [200810, 3636, 2442, 1123, 5000, 5003, 2648, 111],
        BATCH_TX: true,
        VERSION: '2.0.0',
    },
    UNIVERSAL: {
        NAME: 'Universal Account',
        SUPPORTED_CHAIN_IDS: [11155111, 2011],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
};

export const aaOptions = {
    accountContracts: {
        BICONOMY: [
            {
                version: options.BICONOMY_V1.VERSION,
                chainIds: options.BICONOMY_V1.SUPPORTED_CHAIN_IDS,
            },
            {
                version: options.BICONOMY_V2.VERSION,
                chainIds: options.BICONOMY_V2.SUPPORTED_CHAIN_IDS,
            },
        ],
        CYBERCONNECT: [
            {
                version: options.CYBERCONNECT.VERSION,
                chainIds: options.CYBERCONNECT.SUPPORTED_CHAIN_IDS,
            },
        ],
        SIMPLE: [
            {
                version: options.SIMPLE.VERSION,
                chainIds: options.SIMPLE.SUPPORTED_CHAIN_IDS,
            },
        ],
        LIGHT: [
            {
                version: options.LIGHT.VERSION,
                chainIds: options.LIGHT.SUPPORTED_CHAIN_IDS,
            },
        ],
    },
    paymasterApiKeys: [
        { apiKey: 'y2oPaKtU4.aa0dad3c-6e92-4992-ba4a-d4f5bf2c6060', chainId: 1 },
        { apiKey: 'RWBf97p9s.ada0ab42-eb24-45b7-8968-176c09735ad3', chainId: 5 },
        { apiKey: '6thfcuz3h.f6c26989-e8b9-4127-9153-3d92c983c54d', chainId: 137 },
        { apiKey: 'sNEd_Dfjt.88e85c83-dc0e-45e0-931b-b835f1f5f11b', chainId: 56 },
        { apiKey: 'u7F_1lHe5.f9c588e6-96d6-4965-bc33-03f96fa05387', chainId: 97 },
        { apiKey: '2CBwiCy6J.9c03be35-3919-44b8-89b6-20d9b7d4c3e4', chainId: 42161 },
        { apiKey: '8ZjvqB5tK.67175bf2-5fda-4f7c-9d89-d6261fabd067', chainId: 42170 },
        { apiKey: 'dQtl-pe_y.e5a1650f-a217-4f4b-82b0-fa9e9da7b66b', chainId: 421613 },
        { apiKey: '3A1BYKK_I.55523344-94da-4373-8f90-e88ab91f447c', chainId: 10 },
        { apiKey: '4hIGLyGyA.aa55cdab-5da6-472d-ad00-e5af7e77ef59', chainId: 420 },
        { apiKey: 'ecNdhdLmf.09ded20e-4e97-400a-b212-bb0653314d76', chainId: 43114 },
        { apiKey: 'mc7THlBmj.827b72e3-a50f-4d9b-b619-ca7d5680655b', chainId: 43113 },
        { apiKey: 'O5wKuVWnx.77266509-b911-4fbf-9cb4-c31a375082a6', chainId: 8453 },
        { apiKey: 'fUdkgt1xP.76d20585-29e8-4ad8-9c07-711220b551ce', chainId: 84531 },
        { apiKey: 'rXFRzlkTW.513e8442-e0f9-43c6-89eb-8bd546eda6ce', chainId: 59140 },
    ],
};

export default aaOptions;
