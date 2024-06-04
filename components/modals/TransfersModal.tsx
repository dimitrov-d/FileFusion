import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import FileCard from '../cards/FileCard';
import { FileInfo } from '../cards/types';

interface TransfersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransfersModal: React.FC<TransfersModalProps> = ({ isOpen, onClose }) => {
  const [userFiles, setUserFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen]);

  const fetchFiles = async () => {
    const bucketUuid = process.env.NEXT_PUBLIC_BUCKET_UUID;
    const url = `https://api.apillon.io/storage/buckets/${bucketUuid}/files`;
    const credentials = process.env.NEXT_PUBLIC_APILLON_CREDENTIALS;

    try {
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
      console.log('Fetched files:', result.data.items);
      setUserFiles(result.data.items);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed flex justify-center w-full bg-black/50 backdrop-blur-sm h-screen">
          <div
            className="fixed inset-0 bg-black bg-opacity-10 w-full "
            onClick={onClose}
          ></div>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white w-1/2 max-h-[600px] shadow-lg ml-auto mr-4 rounded-xl overflow-y-auto modal-content"
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-[#3c087e]">
                  Transfers
                </h2>
                <button onClick={onClose} className="text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <div className="flex space-x-4">
                  <button className="py-2 px-4 border-b-2 border-black font-semibold">
                    Sent
                  </button>
                  {/* <button className="py-2 px-4 font-semibold">Received</button> */}
                </div>
                <div className="mt-4">
                  <div className="bg-purple-100 text-[#3c087e] p-4 rounded-lg flex justify-between items-center w-full">
                    <span>
                      Upgrade to receive with ease. Get a custom URL
                      y.
                    </span>
                    <button className="bg-[#3c087e] text-white py-2 px-4 rounded-lg">
                      Upgrade
                    </button>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">May 2024</h3>
                    {userFiles.map((file) => (
                      <FileCard
                        key={file.fileUuid}
                        title={file.name}
                        description={`Not yet downloaded · ${
                          file.size
                        } BYTES · Sent ${new Date(
                          file.createTime
                        ).toLocaleDateString()} · ${new Date(
                          file.updateTime
                        ).toLocaleDateString()}`}
                        link={file.link}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransfersModal;
