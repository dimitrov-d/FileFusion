import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import emailjs from 'emailjs-com';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { LuSwitchCamera } from 'react-icons/lu';
import Image from 'next/image';
import SuccessModal from '../modal/SuccessModal';

const TransferUploadCard: React.FC = () => {
  const { email, isAuthenticated, privateMode } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const emailData = {
        email: email,
        title: 'a file',
        link: fileLink,
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        emailData,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      );

      toast.success('File uploaded and email sent successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
      });

      setRecipientEmail('');
      setTitle('');
      setMessage('');
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setShowModal(true);
    } catch (error) {
      console.error('Error during upload process:', error);
      toast.error('An error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card-gradient border-gray-500 border text-black p-6 rounded-lg shadow-lg  mx-auto z-[1000] transition-all duration-500">
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
        {/* <a href="#" className="text-sm text-gray-100 underline ml-6">
          Or select a folder
        </a> */}
      </div>
      <div className="bg-[#03001436] p-2 rounded-lg mb-4 text-center">
        <p className="text-xs text-white">
          Up to 2 GB free{' '}
          <span className="text-purple-300">⚡ Increase limit</span>
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="block text-sm text-gray-100">Email to</label>
          <input
            type="email"
            className="w-full border border-gray-500 rounded-md p-2 bg-[#03001436] text-white placeholder:text-sm"
            placeholder="Recipient email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-gray-100">Your email</label>
          <div className="flex items-center border border-gray-500 rounded-md p-2 bg-[#03001436] text-white">
            <input
              type="email"
              className="w-full bg-[#03001436]"
              autoComplete="off"
              value={email ?? ''}
              readOnly
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-gray-100">Title</label>
          <input
            type="text"
            className="w-full border border-gray-500 rounded-md p-2 bg-[#03001436] text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-gray-100">Message</label>
          <textarea
            className="w-full border border-gray-500 rounded-md p-2 bg-[#03001436] text-white"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-gray-100">Select File</label>
          <input
            type="file"
            className="w-full border border-gray-500 rounded-md p-2 bg-[#03001436] text-gray-300"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 rounded-full p-2"
          >
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
          </button>
          <button
            type="submit"
            className={`font-semibold px-6 py-2 rounded-full transition-colors ${
              isAuthenticated
                ? 'button-primary text-white cursor-pointer'
                : 'bg-gray-800 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!isAuthenticated}
          >
            {loading ? <ClipLoader color="white" size={20} /> : 'Transfer'}
          </button>
        </div>
      </form>
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
      {/* <ToastContainer /> */}
    </div>
  );
};

export default TransferUploadCard;
