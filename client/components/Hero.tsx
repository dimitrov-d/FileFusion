import React from 'react';
import Image from 'next/image';
import UploadCard from './upload/Upload';

const Hero = () => {
  return (
    <div className="flex items-center justify-between mt-[120px] h-full px-20 w-full overflow-hidden pt-10">
      <div className="text-white  text-start p-6 rounded-2xl shadow-lg h-[40%] mb-[180px] ">
        <div className="mb-8">
          <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-full">
            NEW
          </span>
        </div>
        <h1 className="text-5xl font-bold mb-4">
          Trustless File Transfer Network
        </h1>
        <p className="text-xl mb-4">
          Experience secure, decentralized file transfers with our
          Apillon-powered platform.
        </p>
        <p className="text-xl mb-6">
          Free trial for a limited time{' '}
          <span role="img" aria-label="party">
            🎉
          </span>
        </p>
        <button className="button-primary text-white font-semibold px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
          Learn more
        </button>

        <div className="flex items-center mt-9 rounded-full border border-[#5a0fc8] w-full max-w-xl">
          <input
            type="email"
            placeholder="Send me a download link"
            className="flex-grow bg-transparent text-white text-lg px-4 py-2 rounded-full focus:outline-none placeholder-gray-500"
          />
          <button className="button-primary text-white font-semibold text-md px-6 py-2 rounded-full flex items-center transition-transform transform hover:scale-105">
            Email me
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>

      <div className="flex gap-12 ">
        <div className="pt-4">
          <UploadCard />
        </div>
      </div>

      <div className="  " id="about-me">
        <video
          autoPlay
          muted
          loop
          className="rotate-180 absolute top-[-360px] object-fill  h-[100vh] w-full left-0 z-[-4] bg-transparent"
        >
          <source src="/blackhole.webm" type="video/webm" />
        </video>
      </div>
    </div>
  );
};

export default Hero;
