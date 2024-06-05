import React, { useState } from 'react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { IoCopyOutline } from 'react-icons/io5';

interface UploadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileLink: string;
}

function UploadSuccessModal({
  isOpen,
  onClose,
  fileLink,
}: UploadSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const maxLength = 25;

  const shortenedLink =
    fileLink.length > maxLength
      ? `${fileLink.substring(0, maxLength)}...`
      : fileLink;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[99999]">
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <DialogPanel className="max-w-lg space-y-4 border border-gray-600 bg-[#030014] p-12 rounded-2xl text-white">
          <DialogTitle className="font-bold text-center text-xl">
            Congratulations!! Your file has been uploaded
          </DialogTitle>
          <div className="flex items-center justify-center gap-2">
            <p className="text-gray-400">File link:</p>
            <span className="text-blue-400">{shortenedLink}</span>{' '}
            <button onClick={copyToClipboard} title="Copy to Clipboard">
              <IoCopyOutline
                className={`h-6 w-6 ${
                  copied ? 'text-green-400' : 'text-gray-400'
                }`}
              />
            </button>
          </div>
          <div className="flex justify-center cursor-pointer">
            <button
              onClick={onClose}
              className="px-4 py-2 button-primary text-gray-300 rounded w-[120px]"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default UploadSuccessModal;
