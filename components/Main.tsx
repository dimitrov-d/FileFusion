'use client';
import React from 'react';
import TransferUpload from './upload/TransferUpload';
import EncryptedUpload from './upload/EncryptedUploads';
import NormalUpload from './upload/NormalUpload';
import {useAuth} from '@/context/AuthContext';

const Main = () => {
    const {privateMode, storageMode, transferMode} = useAuth();

    let UploadComponent;
    if (privateMode) {
        UploadComponent = EncryptedUpload;
    } else if (storageMode) {
        UploadComponent = NormalUpload;
    } else {
        UploadComponent = TransferUpload;
    }

    return (
        <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-[100px] md:mt-[120px] h-full px-[10px] md:px-20 w-full overflow-hidden pt-10">
            <div
                className={`text-white  text-start p-6 rounded-2xl shadow-lg h-[40%] ${
                    privateMode ? 'mb-[300px]' : 'mb-[200px]'
                }  `}
            >
                <div className="mb-8">
          <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-full">
            NEW
          </span>
                </div>

                <h1 className="text-5xl font-bold mb-4">
                    {privateMode
                        ? 'Encrypted File Transfers'
                        : transferMode
                            ? 'Trustless File Transfer Network'
                            : storageMode
                                ? 'Decentralized File Storage'
                                : 'Trustless File Transfer Network'}{' '}
                </h1>

                <p className="text-xl mb-4">
                    {privateMode
                        ? 'Experience private, decentralized file transfers powered by Apillon and Phala.'
                        : 'Experience secure, decentralized file transfers with our Apillon-powered platform.'}
                </p>
                <p className="text-xl mb-6 text-gray-300">
                    Meet the future of web3{' '}
                    <span role="img" aria-label="party">
            🎉
          </span>
                </p>
                <button
                    className="button-primary text-white font-semibold px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
                    Learn more
                </button>

            </div>

            <div className="flex gap-12  mb-[50px] md:mb-[0px]">
                <div className="pt-4">
                    <UploadComponent />
                </div>
            </div>

            <div
                className="rotate-180 absolute top-[-360px] object-fill  h-[100vh] w-full left-0 z-[-4] bg-transparent"
                id="about-me"
            >
                <video autoPlay muted loop className={`${privateMode ? '' : 'hidden'}`}>
                    <source src="/encryption.webm" type="video/webm"/>
                </video>

                <video autoPlay muted loop className={`${privateMode ? 'hidden' : ''}`}>
                    <source src="/blackhole.webm" type="video/webm"/>
                </video>
            </div>
        </div>
    );
};

export default Main;
