import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const UploadCard: React.FC = () => {
  const { email, isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
    console.log('result:', result);
    
    const directories = result.data.directories || [];

    return directories.some((dir: any) => dir.path === directoryPath);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

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
    } catch (error) {
      console.error('Error during upload process:', error);
    }
  };

  return (
    <div className="upload-card-gradient border-gray-500 border text-black p-6 rounded-lg shadow-lg max-w-sm mx-auto z-[1000]">
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
        <a href="#" className="text-sm text-gray-100 underline ml-6">
          Or select a folder
        </a>
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
            className="w-full border border-gray-500 rounded-md p-2 bg-[#03001436]"
            onChange={handleFileChange}
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
            Transfer
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadCard;
