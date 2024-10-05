import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ClipLoader } from 'react-spinners';
import { IoCloudUploadOutline } from 'react-icons/io5';
import UploadSuccessModal from '../modals/UploadSuccessModal';
import {Storage} from "@apillon/sdk";
import helpers from "@/utils/helpers";
import {toast} from "react-toastify";
import {useAccount} from "wagmi";
import {StorageBucket} from "@apillon/sdk/dist/modules/storage/storage-bucket";

interface NormalUploadProps {
  storage: Storage;
  bucket: StorageBucket;
}

const NormalUpload: React.FC<NormalUploadProps> = ({bucket, storage}) => {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const { address: connectedWalletAddress } = useAccount();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadedFileLink, setUploadedFileLink] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setLoading(true);
    const directoryPath = connectedWalletAddress;
    const buffer = await helpers.getFileBuffer(file) as Buffer;

    try {
      const response = await bucket.uploadFiles(
          [
            {
              fileName: file.name,
              contentType: file.type,
              content: buffer,
            },
          ],
          { wrapWithDirectory: true, directoryPath, awaitCid: true }
      );

      if (!response) {
        throw new Error('File upload failed.');
      }

      const fileCID = response[0].CID as string;

      if(!fileCID) {
        throw new Error('File CID not found.');
      }

      const ipfsLink = await storage.generateIpfsLink(fileCID);

      // Reset form
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadedFileLink(ipfsLink);
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
            className={`font-semibold px-6 py-2 rounded-full transition-colors w-[120px] ${
              isAuthenticated
                ? 'button-primary text-white cursor-pointer'
                : 'bg-gray-800 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!isAuthenticated || loading}
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
