import React, {useState, useRef, useEffect} from 'react';
import { useAuth } from '@/context/AuthContext';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';
import SuccessModal from '../modals/SuccessModal';
import { toast } from 'react-toastify';
import helpers from '@/utils/helpers';
import {Computing, Storage} from "@apillon/sdk";
import {StorageBucket} from "@apillon/sdk/dist/modules/storage/storage-bucket";

interface EncryptedUploadProps {
  storage: Storage;
  bucket: StorageBucket;
}

const computing = new Computing({
  key: process.env.NEXT_PUBLIC_APILLON_API_KEY,
  secret: process.env.NEXT_PUBLIC_APILLON_API_SECRET,
});

const contract = computing.contract(process.env.NEXT_PUBLIC_COMPUTING_CONTRACT_UUID as string);

const EncryptedUpload: React.FC<EncryptedUploadProps> = () => {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [targetWalletAddress, setTargetWalletAddress] = useState('');
  const [message, setMessage] = useState('');
  const [nftId, setNftId] = useState<string | number>('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (nftId === '') {
      alert('Please enter a valid NFT ID.');
      return;
    }

    setLoading(true);

    try {

      //const encryptedContent = await encryptContent(fileContent);
      const buffer = await helpers.getFileBuffer(file) as Buffer;

      if (!contract) {
        throw new Error('Contract not initialized.');
      }

      // @ts-ignore
      const contractDetails = await contract.get();
      console.log("contractDetails", contractDetails);

      const encryptionResult = await contract.encryptFile({
        fileName: file.name,
        content: buffer,
        nftId: nftId as number,

      });

     console.log("encryptionResult", encryptionResult);


      console.log(
        'File uploaded, synchronized to IPFS and Crust, and session ended successfully!'
      );


      await helpers.sendEmail({
        to: recipientEmail,
        from: 'info@filefusion.com',
        fromName: 'FileFusion',
        subject: '[FileFusion] You have a new encrypted file!',
        text: `Hello,\n\n${message}\n\nYou can download the file using this link`,
        templateName: 'encrypted',
        link: 'https://file-fusion-decrypt.vercel.app',
        nftId: `#${nftId}`,
        targetWalletAddress,
      });


      setRecipientEmail('');
      setNftId('');
      setMessage('');
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setShowModal(true);
      console.log('Email sent successfully!');
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
          <label className="block text-sm text-gray-100">
            Target Wallet Address:
          </label>
          <input
            type="text"
            className="w-full border border-gray-500 rounded-md text-sm p-2 bg-[#03001436] text-white placeholder:text-xs"
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
            disabled={!isAuthenticated || loading}
          >
            {loading ? <ClipLoader color="white" size={20} /> : 'Transfer'}
          </button>
        </div>
      </form>
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default EncryptedUpload;
