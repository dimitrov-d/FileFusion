import { Socials } from '@/constants';
import Image from 'next/image';
import React from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { GiChaingun } from 'react-icons/gi';
import ConnectBtn from '../connect/ConnectBtn';

const Navbar = () => {
  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg backdrop-blur-md z-50 px-4">
      <div className="w-full h-full flex flex-row items-center justify-between mx-auto mt-4">
        <a href="#about-me" className="flex items-center pl-16">
          <GiChaingun className="text-2xl lg:text-3xl text-gray-300" />
          <span className="font-bold text-sm lg:text-lg hidden lg:block text-gray-300 ml-2">
            FileFusion
          </span>
        </a>

        <div className="hidden lg:flex w-auto h-full items-center justify-between mr-20">
          <div className="flex items-center justify-between w-full h-auto bg-[#03001436] px-4 py-2 text-sm rounded-full text-gray-200 gap-10">
            <a href="#about-me" className="cursor-pointer">
              Transfers
            </a>
            <a href="#skills" className="cursor-pointer ">
              Contacts
            </a>
            <a href="#projects" className="cursor-pointer">
              Branding
            </a>
            <a href="#contact" className="cursor-pointer">
              Blog
            </a>
          </div>
          <div>
            <ConnectBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
