'use client';
import React from 'react';
import TransferUpload from './upload/TransferUpload';
import EncryptedUpload from './upload/EncryptedUploads';
import NormalUpload from './upload/NormalUpload';
import {useAuth} from '@/context/AuthContext';
import {LogLevel, Storage} from "@apillon/sdk";

const storage = new Storage({
    key: process.env.NEXT_PUBLIC_APILLON_API_KEY,
    secret: process.env.NEXT_PUBLIC_APILLON_API_SECRET,
    logLevel: LogLevel.VERBOSE,
});

const bucket = storage.bucket(process.env.NEXT_PUBLIC_APILLON_BUCKET_UUID as string);


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

                {/*<div className="flex items-center mt-9 rounded-full border border-[#5a0fc8] w-full max-w-xl">*/}
                {/*    <input*/}
                {/*        type="email"*/}
                {/*        placeholder="Send me a download link"*/}
                {/*        className="flex-grow bg-transparent text-white text-lg px-4 py-2 rounded-full focus:outline-none placeholder-gray-500"*/}
                {/*    />*/}
                {/*    <button*/}
                {/*        className="button-primary text-white font-semibold text-md px-6 py-2 rounded-full flex items-center transition-transform transform hover:scale-105">*/}
                {/*        Email me*/}
                {/*        <span className="ml-2">→</span>*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>

            <div className="flex gap-12  mb-[50px] md:mb-[0px]">
                <div className="pt-4">
                    <UploadComponent bucket={bucket} storage={storage}/>
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
