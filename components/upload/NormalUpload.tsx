import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ClipLoader } from 'react-spinners';
import { IoCloudUploadOutline } from 'react-icons/io5';
import UploadSuccessModal from '../modals/UploadSuccessModal';
import helpers from "@/utils/helpers";
import {toast} from "react-toastify";
import {useAccount} from "wagmi";
import {useConnectModal} from "@rainbow-me/rainbowkit";


const NormalUpload: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const { address: connectedWalletAddress } = useAccount();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadedFileLink, setUploadedFileLink] = useState('');
  const {openConnectModal} = useConnectModal();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated && openConnectModal) {
      openConnectModal();
      return;
    }

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setLoading(true);
    const buffer = await helpers.getFileBuffer(file) as Buffer;
    const base64Content = buffer.toString('base64');

    try {
      const response = await fetch('/api/apillon/upload-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          content: base64Content
        }),
      });

        if (!response.ok) {
            throw new Error('An error occurred.');
        }

      const data = await response.json();
      // @ts-ignore
      if(!data.ipfs_url) {
        throw new Error('File upload failed.');
      }
      // Reset form
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadedFileLink(data.ipfs_url);
      setShowModal(true);
    } catch (error) {
      console.error('Error during upload process:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card-gradient mt-0 border-gray-500 border text-black p-6 rounded-lg shadow-lg  mx-auto z-[1000] transition-all duration-500 -mt-[120px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="button-primary text-white rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>

          <span className="font-semibold text-gray-100">Upload files</span>
        </div>
      </div>
      <div className="bg-[#03001436] p-2 rounded-lg mb-4 text-center">
        <p className="text-xs text-white">
          Up to 2 GB free{' '}
          <span className="text-purple-300">⚡ Increase limit</span>
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1 flex flex-col items-center border-2 border-dashed border-gray-300 p-8 rounded-lg">
          <IoCloudUploadOutline className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500">Upload your file</p>
          <input
            type="file"
            className="w-full border border-gray-500 rounded-md p-2 bg-[#03001436] text-gray-300 mt-4"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className={`font-semibold px-6 py-2 rounded-full transition-colors w-[120px] button-primary text-white cursor-pointer`}
            disabled={loading}
          >
            {loading ? <ClipLoader color="white" size={20} /> : 'Upload'}
          </button>
        </div>
      </form>
      <UploadSuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        fileLink={uploadedFileLink}
      />
    </div>
  );
};

export default NormalUpload;
