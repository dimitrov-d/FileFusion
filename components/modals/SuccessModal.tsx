import React from 'react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[99999]">
     <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <DialogPanel className="max-w-lg space-y-4 border border-gray-600 bg-[#030014] p-12 rounded-2xl text-white">
          <DialogTitle className="font-bold text-center text-xl">Congratulations!! Your file has been sent</DialogTitle>
          <Description className="text-gray-400">Recipient would receive an email to access the file</Description>
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

export default SuccessModal;
