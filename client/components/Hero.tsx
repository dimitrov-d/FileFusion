import React from 'react';
import Image from 'next/image';
import UploadCard from './upload/Upload';

const Hero = () => {
  return (
    <div className="flex items-center justify-between mt-[120px] h-full px-14 w-full overflow-hidden">
      <div className="flex gap-12 ">
        <div className="pt-4">
          <UploadCard />
        </div>
      </div>
      <div className="border border-blue-800 text-white text-center p-6 rounded-2xl shadow-lg max-w-md h-[40%] mb-[180px]">
        <div className="mb-4">
          <span className="bg-white text-black text-xs font-semibold px-2 py-1 rounded-full">
            NEW
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Trustless File Transfer Network
        </h1>
        <p className="text-lg mb-4">
          Experience secure, decentralized file transfers with our
          Apillon-powered platform.
        </p>
        <p className="text-lg mb-6">
          Free trial for a limited time{' '}
          <span role="img" aria-label="party">
            🎉
          </span>
        </p>
        <button className="bg-blue-800 text-white font-semibold px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
          Learn more
        </button>
      </div>

      <div className="mb-[140px]">
        <Image
          src="/images/planet.png"
          alt="work icons"
          height={400}
          width={400}
          className="animate-[spin_50s_linear_infinite] "
        />
      </div>
    </div>
  );
};

export default Hero;
