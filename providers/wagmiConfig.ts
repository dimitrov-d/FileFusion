import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import {
    metaMaskWallet,
    walletConnectWallet,
    coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import {arbitrum, base, mainnet, optimism, polygon} from "wagmi/chains";

const config = getDefaultConfig({
    appName: 'FileFusion',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    chains: [mainnet, polygon, optimism, arbitrum, base],
    wallets: [
        {
            groupName: 'Recommended',
            wallets: [metaMaskWallet],
        },
        {
            groupName: 'Other',
            wallets: [walletConnectWallet, coinbaseWallet],
        },
    ],
    ssr: true,
});


export default config;