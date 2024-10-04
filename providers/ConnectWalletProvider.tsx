import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
    RainbowKitProvider,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import {WagmiProvider} from 'wagmi';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import config from '../providers/wagmiConfig';

const queryClient = new QueryClient();

const ConnectWalletProvider = ({children}: { children: React.ReactNode }) => {

    return <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme()} modalSize="compact">
                {children}
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
};

export default ConnectWalletProvider;