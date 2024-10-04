import React from 'react';
import { useConnectModal} from '@rainbow-me/rainbowkit';

const ConnectButton = () => {
    const {openConnectModal} = useConnectModal();
    return <button
        style={{'width': '160px'}}
        onClick={openConnectModal}
        className="button-primary text-white font-semibold px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
        Connect Wallet
    </button>
};

export default ConnectButton;