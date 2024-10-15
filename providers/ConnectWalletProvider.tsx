import '@rainbow-me/rainbowkit/styles.css';
import {
    RainbowKitProvider,
    darkTheme, RainbowKitAuthenticationProvider, createAuthenticationAdapter, AuthenticationStatus,
} from '@rainbow-me/rainbowkit';
import {WagmiProvider} from 'wagmi';
import {createSiweMessage} from 'viem/siwe';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import config from '@/providers/wagmiConfig';
import type {AppProps} from "next/app";
import {useEffect, useMemo, useRef, useState} from "react";
import {useAuth} from "@/context/AuthContext";

const queryClient = new QueryClient();


const ConnectWalletProvider = ({children, pageProps}: {
    children: React.ReactNode;
    pageProps: AppProps['pageProps']
}) => {
    const fetchingStatusRef = useRef(false);
    const verifyingRef = useRef(false);
    const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading');
    const {
        setIsAuthenticated
    } = useAuth();

    useEffect(() => {
        const fetchStatus = async () => {
            if (fetchingStatusRef.current || verifyingRef.current) {
                return;
            }
            fetchingStatusRef.current = true;
            try {
                const response = await fetch('/api/auth/me');
                const json = await response.json();
                setAuthStatus(json.address ? 'authenticated' : 'unauthenticated');
                setIsAuthenticated(!!json.address);
            } catch (_error) {
                setAuthStatus('unauthenticated');
                setIsAuthenticated(false);
            } finally {
                fetchingStatusRef.current = false;
            }
        };
        fetchStatus();

        window.addEventListener('focus', fetchStatus);
        return () => window.removeEventListener('focus', fetchStatus);
    }, []);

    const authAdapter = useMemo(() => {
        return createAuthenticationAdapter({
            getMessageBody<Message>(args: { message: Message }): string {
                return args.message as string;
            },
            getNonce: async () => {
                const response = await fetch('/api/auth/nonce');
                return await response.text();
            },

            createMessage: ({nonce, address, chainId}) => {

                return createSiweMessage({
                    domain: window.location.host,
                    // @ts-ignore
                    address: address,
                    statement: 'Sign in to File Fusion App',
                    uri: window.location.origin,
                    version: '1',
                    chainId,
                    nonce,
                });
            },

            verify: async ({message, signature}) => {
                verifyingRef.current = true;

                try {
                    const response = await fetch('/api/auth/verify', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({message, signature}),
                    });

                    const authenticated = Boolean(response.ok);

                    if (authenticated) {
                        setIsAuthenticated(authenticated);
                        setAuthStatus(authenticated ? 'authenticated' : 'unauthenticated');
                    }

                    return authenticated;
                } catch (error) {
                    return false;
                } finally {
                    verifyingRef.current = false;
                }
            },

            signOut: async () => {
                setAuthStatus('unauthenticated');
                setIsAuthenticated(false);
                await fetch('/api/auth/logout');
            }
        });
    }, []);

    return <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitAuthenticationProvider
                    adapter={authAdapter}
                    status={authStatus}
                >
                    <RainbowKitProvider theme={darkTheme()} modalSize="compact">
                        {children}
                    </RainbowKitProvider>
                </RainbowKitAuthenticationProvider>
            </QueryClientProvider>
    </WagmiProvider>
};

export default ConnectWalletProvider;