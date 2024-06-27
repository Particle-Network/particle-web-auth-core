// SA 配置（客户端用） https://minijoy.feishu.cn/docx/DFkUdi9rbovXpzxN2uEc4pmRnYg#QZY3d99too9km0x5ly3cQwa0nIg
export const options = {
    BICONOMY_V1: {
        NAME: 'BiconomyV1 Account',
        SUPPORTED_CHAIN_IDS: [1, 5, 137, 56, 97, 42161, 42170, 10, 43114, 43113, 8453, 1101, 59140],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    BICONOMY_V2: {
        NAME: 'Biconomy Account',
        SUPPORTED_CHAIN_IDS: [
            1, 11155111, 137, 80002, 56, 97, 42161, 42170, 421614, 10, 11155420, 43114, 43113, 8453, 84532, 1101, 2442,
            59144, 204, 5611, 5000, 5003, 169, 3441005, 9980, 1284, 534352, 534351, 81457, 168587773, 196, 195, 100,
            10200, 7000, 7001, 80085,
        ],
        BATCH_TX: true,
        VERSION: '2.0.0',
    },
    SIMPLE: {
        NAME: 'Simple Account',
        SUPPORTED_CHAIN_IDS: [
            1, 11155111, 17000, 137, 80002, 56, 97, 204, 5611, 42161, 42170, 421614, 43114, 43113, 8453, 84532, 59144,
            59141, 10, 11155420, 169, 3441005, 5000, 5003, 534352, 534351, 100, 10200, 424, 58008, 88, 89, 1284, 1285,
            1287, 1101, 250, 4002, 9980, 1715, 42766, 43851, 167000, 167009, 196, 195, 3776, 6038361, 12008, 12015,
            7000, 7001, 1116, 1115, 34443, 919, 888888888, 28122024, 81457, 168587773, 80084, 80085, 112358, 1637450,
            2777, 202402181627, 13473, 2241, 9990, 7560, 111557560, 1224, 200901, 200810, 122, 123, 4689, 4690, 1329,
            1328, 713715,
        ],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    SIMPLE_V2: {
        NAME: 'Simple Account',
        SUPPORTED_CHAIN_IDS: [
            1, 11155111, 17000, 137, 80002, 56, 97, 204, 5611, 42161, 42170, 421614, 43114, 43113, 8453, 84532, 59144,
            59141, 10, 11155420, 169, 3441005, 5000, 5003, 534352, 534351, 100, 10200, 424, 58008, 88, 89, 1284, 1285,
            1287, 1101, 250, 4002, 9980, 1715, 42766, 43851, 167000, 167009, 196, 195, 3776, 6038361, 12008, 12015,
            7000, 7001, 1116, 1115, 34443, 919, 888888888, 28122024, 81457, 168587773, 80084, 80085, 112358, 1637450,
            2777, 202402181627, 13473, 2241, 9990, 7560, 111557560, 1224, 200901, 200810, 122, 123, 4689, 4690, 1329,
            1328, 713715,
        ],
        BATCH_TX: true,
        VERSION: '2.0.0',
    },
    CYBERCONNECT: {
        NAME: 'Cyber Account',
        SUPPORTED_CHAIN_IDS: [1, 11155111, 56, 97, 10, 137, 8453, 59144, 42161, 204, 5611, 534352, 534351],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    LIGHT: {
        NAME: 'Alchemy Account',
        SUPPORTED_CHAIN_IDS: [1, 11155111, 10, 137, 8453, 42161, 421613],
        BATCH_TX: true,
        VERSION: '1.0.2',
    },
    // 这个仅支持 BTC 钱包，不支持 Particle Auth 和 MetaMask 这种 EVM 钱包
    BTC: {
        NAME: 'BTC Account',
        SUPPORTED_CHAIN_IDS: [
            4200, 686868, 223, 1123, 200901, 200810, 11501, 11503, 1501, 1502, 3109, 3110, 22776, 212, 60808, 111, 8329,
            83291, 1116, 1115, 3636, 89682, 1, 11155111, 137, 80002, 2442, 56, 97, 42161, 421614, 5000, 5003,
        ],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    // 测试用，实际没有这个版本
    BTC_V1_1: {
        NAME: 'BTC Account',
        SUPPORTED_CHAIN_IDS: [137],
        BATCH_TX: true,
        VERSION: '1.1.0',
    },
    BTC_V2: {
        NAME: 'BTC Account',
        SUPPORTED_CHAIN_IDS: [
            4200, 686868, 223, 1123, 200901, 200810, 11501, 11503, 1501, 1502, 3109, 3110, 22776, 212, 60808, 111, 8329,
            83291, 1116, 1115, 3636, 89682, 1, 11155111, 137, 80002, 2442, 56, 97, 42161, 421614, 5000, 5003,
        ],
        BATCH_TX: true,
        VERSION: '2.0.0',
    },
    UNIVERSAL: {
        NAME: 'Universal Account',
        SUPPORTED_CHAIN_IDS: [
            2011, 11155111, 11155420, 421614, 84532, 59141, 168587773, 80002, 97, 5611, 1715, 1637450, 43113, 686868,
            1123, 200810, 80084, 1328,
        ],
        BATCH_TX: true,
        VERSION: '1.0.0',
    },
    XTERIO: {
        NAME: 'Xterio Account',
        SUPPORTED_CHAIN_IDS: [2702128, 112358, 1637450, 1, 11155111, 56, 204, 8453, 42161, 137],
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
        XTERIO: [
            {
                version: options.XTERIO.VERSION,
                chainIds: options.XTERIO.SUPPORTED_CHAIN_IDS,
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
