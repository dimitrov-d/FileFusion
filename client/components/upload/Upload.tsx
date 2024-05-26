import React from 'react';

const UploadCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-600 to-blue-900 border-gray-500 border text-black p-6 rounded-lg shadow-lg max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white rounded-full p-2">
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
        <a href="#" className="text-sm text-gray-100 underline">
          Or select a folder
        </a>
      </div>
      <div className="bg-[#03001436] p-2 rounded-lg mb-4 text-center">
        <p className="text-xs text-white">
          Up to 2 GB free{' '}
          <span className="text-purple-300">⚡ Increase limit</span>
        </p>
      </div>
      <form className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm text-gray-100">Email to</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 bg-[#03001436]"
            placeholder="0 of 10"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-gray-100">Your email</label>
          <div className="flex items-center border border-gray-300 rounded-md p-2 bg-[#03001436] text-white">
            <input
              type="email"
              className="w-full  bg-[#03001436]"
              autoComplete="off"
              //   value="walkingtemplar@gmail.com"
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
            className="w-full border border-gray-300 rounded-md p-2 bg-[#03001436]"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-gray-100">Message</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 bg-[#03001436]"
            rows={3}
          ></textarea>
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
            className="bg-gray-400 text-white font-semibold px-6 py-2 rounded-full"
          >
            Transfer
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadCard;
