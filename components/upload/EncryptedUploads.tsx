import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import emailjs from 'emailjs-com';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';

const EncryptedUpload: React.FC = () => {
  const { email, isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [targetWalletAddress, setTargetWalletAddress] = useState('');
  const [message, setMessage] = useState('');
  const [nftId, setNftId] = useState<string | number>('');
  const [loading, setLoading] = useState(false);

  const collectionUUID = process.env.NEXT_PUBLIC_COLLECTION_UUID;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const encryptContent = async (content: string) => {
    const url = `https://api.apillon.io/computing/contracts/${process.env.NEXT_PUBLIC_COMPUTING_CONTRACT_UUID}/encrypt`;
    const credentials = process.env.NEXT_PUBLIC_APILLON_CREDENTIALS;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`Encryption error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.encryptedContent;
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
    console.log('Files fetched:', result.data);
    return result.data.items;
  };

  const pollForFileLink = async (bucketUuid: string, fileName: string) => {
    const maxRetries = 10;
    const delay = 6000;
    let retries = 0;

    while (retries < maxRetries) {
      const files = await fetchFiles(bucketUuid);
      const uploadedFile = files.find((f: any) => f.name === fileName);

      if (uploadedFile && uploadedFile.CID) {
        console.log('File link found:', uploadedFile);
        return uploadedFile;
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

    if (nftId === '') {
      alert('Please enter a valid NFT ID.');
      return;
    }

    setLoading(true);
    const bucketUuid = process.env.NEXT_PUBLIC_ENCRYPTED_BUCKET_UUID;

    try {
      const fileContent = await file.text();
      const encryptedContent = await encryptContent(fileContent);

      const url = `https://api.apillon.io/storage/buckets/${bucketUuid}/upload`;
      const credentials = process.env.NEXT_PUBLIC_APILLON_CREDENTIALS;

      const data = {
        files: [
          {
            fileName: file.name,
            contentType: file.type,
          },
        ],
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
      console.log('Session started:', result.data);

      const fileUrl = result.data.files[0].url;
      const sessionUuid = result.data.sessionUuid;

      const fileResponse = await fetch(fileUrl, {
        method: 'PUT',
        body: new Blob([encryptedContent]),
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
      });

      if (!endSessionResponse.ok) {
        throw new Error(
          `End session error! Status: ${endSessionResponse.status}`
        );
      }

      console.log(
        'File uploaded, synchronized to IPFS and Crust, and session ended successfully!'
      );

      const fileData = await pollForFileLink(bucketUuid ?? '', file.name);
      const { CID, link } = fileData;

      console.log('File link:', link);
      console.log('CID:', CID);

      const assignCidUrl = `https://api.apillon.io/computing/contracts/${process.env.NEXT_PUBLIC_COMPUTING_CONTRACT_UUID}/assign-cid-to-nft`;
      const assignCidResponse = await fetch(assignCidUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid: CID,
          nftId: Number(nftId),
        }),
      });

      if (!assignCidResponse.ok) {
        throw new Error(
          `Assign CID to NFT error! Status: ${assignCidResponse.status}`
        );
      }

      console.log('CID assigned to NFT successfully!');

      const emailData = {
        email: email,
        title: 'Encrypted File',
        // message: `Hello,\n\n${message}\n\nYou can download the file using this link`,
        targetWalletAddress,
        link: link,
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_ENCRYPTED_TEMPLATE_ID!,
        emailData,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      );

      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error during upload process:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card-gradient border-gray-500 border text-black p-6 rounded-lg shadow-lg  mx-auto z-[1000] transition-all duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="">
            <Image
              src="/images/LockTop.png"
              alt="Lock top"
              width={24}
              height={24}
              className="w-[24px] translate-y-3 transition-all duration-200 "
            />
            <Image
              src="/images/LockMain.png"
              alt="Lock Main"
              width={24}
              height={24}
              className=" z-10"
            />
          </div>

          <span className="font-semibold text-gray-100 text-xs pt-3">
            Only Authorized users can access encrypted files
          </span>
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
          <label className="block text-sm text-gray-100">
            Target Wallet Address:
          </label>
          <input
            type="text"
            className="w-full border border-gray-500 rounded-md p-2 bg-[#03001436] text-white placeholder:text-xs"
            placeholder="0x3d61594..."
            value={targetWalletAddress}
            onChange={(e) => setTargetWalletAddress(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-gray-100">NFT Token ID:</label>
          <input
            type="number"
            className="w-full border border-gray-500 rounded-md p-2 bg-[#03001436] text-white placeholder:text-xs"
            placeholder="(i.e) 2"
            value={nftId}
            onChange={(e) => setNftId(e.target.value)}
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
    </div>
  );
};

export default EncryptedUpload;
