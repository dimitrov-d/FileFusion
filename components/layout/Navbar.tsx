import React, {useState, useRef, useEffect} from 'react';
import {GiChaingun} from 'react-icons/gi';
import ConnectButton from '../connect/ConnectButton';
import {useAuth} from '@/context/AuthContext';
import TransfersModal from '../modals/TransfersModal';
//import { disconnect } from '@wagmi/core'
import config from '@/providers/wagmiConfig';
import {useAccount, useAccountEffect, useDisconnect} from "wagmi";
import {useEnsName} from 'wagmi'
import truncateEthAddress from 'truncate-eth-address';

const Navbar = () => {
    const {
        isAuthenticated,
        setIsAuthenticated,
        setPrivateMode,
        privateMode,
        storageMode,
        setStorageMode,
        transferMode,
        setTransferMode,
    } = useAuth();

    const {address} = useAccount();
    const {disconnect} = useDisconnect();
    const {data: ensName} = useEnsName({
        address: address,
    })

    useAccountEffect({
        onConnect(data) {
            setIsAuthenticated(true);
        },
        onDisconnect() {
            handleToggleMode('transfer');
            setIsAuthenticated(false);

        }
    })
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleToggleMode = (mode: 'private' | 'storage' | 'transfer') => {
        setPrivateMode(mode === 'private');
        setStorageMode(mode === 'storage');
        setTransferMode(mode === 'transfer');
        setIsDropdownOpen(false);
    };

    // Close modal if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            // @ts-ignore
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="w-full h-[65px] fixed top-0 shadow-lg backdrop-blur-md z-50 px-4">
            <div className="w-full h-full flex flex-row items-center justify-between mx-auto mt-4">
                <a className="flex items-center pl-0 md:pl-16">
                    <GiChaingun className="text-2xl lg:text-3xl text-gray-300"/>
                    <span className="font-bold text-sm lg:text-lg lg:block text-gray-300 ml-2">
              FileFusion
            </span>
                </a>

                <div className=" lg:flex w-auto h-full  items-center justify-between md:mr-20">
                    <div
                        className="flex items-center justify-between w-full h-auto bg-[#03001436] px-4 py-2 text-sm rounded-full text-gray-200 gap-10">
                        {isAuthenticated && (
                            <a className="hidden md:flex cursor-pointer" onClick={handleOpenModal}>
                                Transfer History
                            </a>
                        )}

                        {/*<a className="cursor-pointer">Contacts</a>*/}
                        {/*<a className="cursor-pointer">Branding</a>*/}
                        {/*<a className="cursor-pointer">Blog</a>*/}
                    </div>
                    <div className="relative ml-2">
                        {isAuthenticated && address ? (
                            <div>
                                <div onClick={toggleDropdown} className="cursor-pointer">
                                    <button
                                        className="button-primary flex align-center justify-center h-[30px] px-[10px] w-[130px]  md:w-[160px] md:h-[40px] text-white font-semibold px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
                                        <span className="text-sm md:text-base leading-[15px] ">{ensName ?? truncateEthAddress(address)}</span> </button>
                                    {/*<Avvvatars value={email ?? ''} />*/}
                                </div>
                                {isDropdownOpen && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute right-0 mt-2 w-48 bg-[#03001436] upload-card-gradient text-gray-300 rounded-md shadow-lg py-2 z-50 flex flex-col"
                                    >
                                        <a
                                            className={`block px-4 py-2 text-sm hover:bg-[#bf97ff70] rounded-t-md cursor-pointer ${
                                                privateMode ? 'bg-[#bf97ff70]' : ''
                                            }`}
                                            onClick={() => handleToggleMode('private')}
                                        >
                                            Private Mode
                                        </a>
                                        <a
                                            className={`block px-4 py-2 text-sm hover:bg-[#bf97ff70] cursor-pointer ${
                                                storageMode ? 'bg-[#bf97ff70]' : ''
                                            }`}
                                            onClick={() => handleToggleMode('storage')}
                                        >
                                            Storage Mode
                                        </a>
                                        <a
                                            className={`block px-4 py-2 text-sm hover:bg-[#bf97ff70] rounded-b-md cursor-pointer ${
                                                transferMode ? 'bg-[#bf97ff70]' : ''
                                            }`}
                                            onClick={() => handleToggleMode('transfer')}
                                        >
                                            Transfer Mode
                                        </a>
                                        <a className="md:hidden cursor-pointer px-4 py-2 text-sm hover:bg-[#bf97ff70] rounded-b-md cursor-pointer" onClick={handleOpenModal}>
                                            Transfer History
                                        </a>
                                        <a
                                            onClick={async () => await disconnect()}
                                            className="block px-4 py-2 text-sm hover:bg-[#bf97ff70] rounded-md mt-2"
                                        >
                                            Disconnect
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <ConnectButton/>
                        )}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div>
                    <TransfersModal isOpen={isModalOpen} onClose={handleCloseModal}/>
                </div>
            )}
        </div>
    );
};

export default Navbar;
