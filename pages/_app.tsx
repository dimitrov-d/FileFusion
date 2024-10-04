import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import {AuthProvider} from '@/context/AuthContext';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConnectWalletProvider from "../providers/ConnectWalletProvider";

export default function App({Component, pageProps}: AppProps) {
    return (
        <AuthProvider>
            <ConnectWalletProvider>
                <ToastContainer theme="dark"/>
                <Component {...pageProps} />
            </ConnectWalletProvider>
        </AuthProvider>
    );
}
