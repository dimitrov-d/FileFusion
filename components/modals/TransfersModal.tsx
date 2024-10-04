import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileCard from '../cards/FileCard';
import { FileInfo } from '../cards/types';
import { Storage, LogLevel } from '@apillon/sdk';
import { useAccount } from 'wagmi';
import dayjs from 'dayjs';

const storage = new Storage({
  key: process.env.NEXT_PUBLIC_APILLON_API_KEY,
  secret: process.env.NEXT_PUBLIC_APILLON_API_SECRET,
  logLevel: LogLevel.VERBOSE,
});

const bucket = storage.bucket(process.env.NEXT_PUBLIC_APILLON_BUCKET_UUID as string);

interface TransfersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransfersModal: React.FC<TransfersModalProps> = ({ isOpen, onClose }) => {
  const [userFiles, setUserFiles] = useState<FileInfo[]>([]);
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const directoryPath = address;
      const allBucketFilesAndDirectories = await bucket.listObjects();
      const directoryUuid = allBucketFilesAndDirectories.items.find((item) => item.type === 1 && item.name === directoryPath)?.uuid;

      if(!directoryUuid) {
        setUserFiles([]);
        setLoading(false);
        return;
      }
      const data = await bucket.listObjects({ directoryUuid });
      //@ts-ignore
      const uniqueFiles = filterUniqueFiles(data.items);
      setUserFiles(uniqueFiles);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching files:', error);
      setLoading(false);
    }
  };

  const filterUniqueFiles = (files: File[]) => {
    const uniqueFilesMap = new Map();
    files.forEach((file) => {
      if (!uniqueFilesMap.has(file.name)) {
        uniqueFilesMap.set(file.name, file);
      }
    });
    return Array.from(uniqueFilesMap.values());
  };

  const groupFilesByMonth = (files: FileInfo[]) => {
    const groupedFiles: { [key: string]: FileInfo[] } = {};

    files.forEach((file) => {
      const monthYear = dayjs(file.createTime).format('MMMM YYYY');
      if (!groupedFiles[monthYear]) {
        groupedFiles[monthYear] = [];
      }
      groupedFiles[monthYear].push(file);
    });

    return groupedFiles;
  };

  const groupedFiles = groupFilesByMonth(userFiles);

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
                    </div>
                    <div className="mt-4">
                      <div className="bg-purple-100 text-[#3c087e] p-4 rounded-lg flex justify-between items-center w-full">
                    <span>
                      Files are pinned to IPFS via CRUST Network and Apillon
                    </span>
                        <button className="bg-[#3c087e] text-white py-2 px-4 rounded-lg text-xs">
                          Learn More
                        </button>
                      </div>
                      <div className="mt-4">
                        {loading && (
                            <div className="flex justify-center items-center">
                              <li className="flex items-center">
                                <div role="status">
                                  <svg aria-hidden="true"
                                       style={{fill: 'rgb(147 51 234 / 1)'}}
                                       className="w-4 h-4 me-2 text-gray-200 animate-spin"
                                       viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"/>
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"/>
                                  </svg>
                                  <span className="sr-only">Loading...</span>
                                </div>
                                Fetching files...
                              </li>
                            </div>
                        )}
                        {!loading && userFiles.length === 0 && (
                            <div className="flex justify-center items-center text-gray-500">
                              No files found.
                            </div>
                        )}
                        {!loading && userFiles.length > 0 &&
                            Object.keys(groupedFiles).map((month) => (
                                <div key={month}>
                                  <h3 className="text-lg font-semibold">{month}</h3>
                                  {groupedFiles[month].map((file) => (
                                      <FileCard
                                          key={file.fileUuid}
                                          title={file.name}
                                          description={`- File uploaded · ${new Date(file.createTime).toLocaleDateString()} · ${new Date(file.updateTime).toLocaleDateString()}`}
                                          link={file.link}
                                      />
                                  ))}
                                </div>
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
