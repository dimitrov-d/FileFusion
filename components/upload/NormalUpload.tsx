import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import emailjs from 'emailjs-com';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { LuSwitchCamera } from 'react-icons/lu';
import Image from 'next/image';
import { IoCloudUploadOutline } from 'react-icons/io5';
import UploadSuccessModal from '../modals/UploadSuccessModal';

const NormalUpload: React.FC = () => {
  const { email, isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadedFileLink, setUploadedFileLink] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const checkDirectoryExists = async (
    bucketUuid: string,
    directoryPath: string
  ) => {
    const url = `https://api.apillon.io/storage/buckets/${bucketUuid}/content`;
    const credentials = process.env.NEXT_PUBLIC_APILLON_CREDENTIALS;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const directories = result.data.directories || [];

    return directories.some((dir: any) => dir.path === directoryPath);
  };

  const fetchFiles = async (bucketUuid: string) => {
    const url = `https://api.apillon.io/storage/buckets/${bucketUuid}/files`;
    const credentials = process.env.NEXT_PUBLIC_APILLON_CREDENTIALS;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.items;
  };

  const pollForFileLink = async (bucketUuid: string, fileName: string) => {
    const maxRetries = 10;
    const delay = 6000;
    let retries = 0;

    while (retries < maxRetries) {
      const files = await fetchFiles(bucketUuid);
      const uploadedFile = files.find((f: any) => f.name === fileName);

      if (uploadedFile && uploadedFile.link) {
        return uploadedFile.link;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      retries += 1;
    }

    throw new Error('File link not found after maximum retries.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setLoading(true);
    const bucketUuid = process.env.NEXT_PUBLIC_BUCKET_UUID;
    const directoryPath = email;

    try {
      const directoryExists = await checkDirectoryExists(
        bucketUuid ?? '',
        directoryPath ?? ''
      );

      if (!directoryExists) {
        console.log('Directory does not exist. Creating a new one.');
      } else {
        console.log('Directory exists. Uploading file to existing directory.');
      }

      const url = `https://api.apillon.io/storage/buckets/${bucketUuid}/upload`;
      const credentials = process.env.NEXT_PUBLIC_APILLON_CREDENTIALS;

      const data = {
        files: [
          {
            fileName: file.name,
            contentType: file.type,
          },
        ],
        directoryPath: directoryPath,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const fileUrl = result.data.files[0].url;
      const sessionUuid = result.data.sessionUuid;

      const fileResponse = await fetch(fileUrl, {
        method: 'PUT',
        body: file,
      });

      if (!fileResponse.ok) {
        throw new Error(`File upload error! Status: ${fileResponse.status}`);
      }

      const endSessionUrl = `https://api.apillon.io/storage/buckets/${bucketUuid}/upload/${sessionUuid}/end`;
      const endSessionResponse = await fetch(endSessionUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wrapWithDirectory: true,
          directoryPath: directoryPath,
          syncToCrust: true,
        }),
      });

      if (!endSessionResponse.ok) {
        throw new Error(
          `End session error! Status: ${endSessionResponse.status}`
        );
      }

      console.log(
        'File uploaded, synchronized to IPFS and Crust, and session ended successfully!'
      );

      const fileLink = await pollForFileLink(bucketUuid ?? '', file.name);

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setUploadedFileLink(fileLink);
      setShowModal(true);
      console.log('File uploaded successfully!');
    } catch (error) {
      console.error('Error during upload process:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card-gradient border-gray-500 border text-black p-6 rounded-lg shadow-lg  mx-auto z-[1000] transition-all duration-500 -mt-[120px]">
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
            disabled={!isAuthenticated}
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
