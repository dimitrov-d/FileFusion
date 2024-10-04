import {getDefaultConfig} from "@rainbow-me/rainbowkit";
import {arbitrum, base, mainnet, optimism, polygon} from "wagmi/chains";

const config = getDefaultConfig({
    appName: 'FileFusion',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: true,
});

export default config;