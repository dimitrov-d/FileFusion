import { Socials } from '@/constants';
import Image from 'next/image';
import React, { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { GiChaingun } from 'react-icons/gi';
import ConnectBtn from '../connect/ConnectBtn';
import { useAuth } from '@/context/AuthContext';
import Avvvatars from 'avvvatars-react';
import TransfersModal from '../modals/TransfersModal';

const Navbar = () => {
  const { isAuthenticated, email } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
            {isAuthenticated && (
              <a className="cursor-pointer" onClick={handleOpenModal}>
                Transfers
              </a>
            )}

            <a className="cursor-pointer ">Contacts</a>
            <a className="cursor-pointer">Branding</a>
            <a className="cursor-pointer">Blog</a>
          </div>
          <div>
            {isAuthenticated ? (
              <div className="ml-2">
                <Avvvatars value={email ?? ''} />
              </div>
            ) : (
              <ConnectBtn />
            )}
          </div>
        </div>
      </div>
      <TransfersModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Navbar;
