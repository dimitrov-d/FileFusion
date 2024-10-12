import React, {useState, useRef} from 'react';
import {useAuth} from '@/context/AuthContext';
import {ClipLoader} from 'react-spinners';
import {toast} from 'react-toastify';
import SuccessModal from '../modals/SuccessModal';
import {useAccount} from "wagmi";
import helpers from "@/utils/helpers";
import {useConnectModal} from "@rainbow-me/rainbowkit";

const TransferUploadCard: React.FC = () => {
    const {address: connectedWalletAddress} = useAccount();
    const {isAuthenticated} = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {openConnectModal} = useConnectModal();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated && openConnectModal) {
            openConnectModal();
            return;
        }

        if (!file || !recipientEmail) {
            toast.error('Please select a file and enter a recipient email.');
            return;
        }

        setLoading(true);
        const directoryPath = connectedWalletAddress;
        const buffer = await helpers.getFileBuffer(file) as Buffer;

        try {
            const response = await fetch('/api/apillon/upload-files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    content: buffer,
                    directoryPath
                })
            });

            const data = await response.json();
            // @ts-ignore
            if (!data.ipfs_url) {
                throw new Error('File upload failed.');
            }

            await helpers.sendEmail({
                to: recipientEmail,
                from: 'info@filefusion.com',
                fromName: 'FileFusion',
                subject: 'Someone sent you a file via FileFusion',
                text: `${message}\n\nFile link: ${data.ipfs_url}`,
                link: data.ipfs_url,
            });

            toast.success('File uploaded and email sent successfully!');

            // Reset form
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
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="upload-card-gradient border-gray-500 border text-black p-6 rounded-lg shadow-lg  mx-auto z-[1000] transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="button-primary text-white rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                             className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-100">Upload files</span>
                </div>
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
                        disabled={loading}
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
                        className={`font-semibold px-6 py-2 rounded-full transition-colors button-primary text-white cursor-pointer`}
                        disabled={loading}
                    >
                        {loading ? <ClipLoader color="white" size={20}/> : 'Transfer'}
                    </button>
                </div>
            </form>
            <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)}/>
        </div>
    );
};

export default TransferUploadCard;
