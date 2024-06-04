import React from 'react';
import { FileCardProps } from './types';

const FileCard: React.FC<FileCardProps> = ({ title, description, link }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(link);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="mt-2 p-4 border rounded-lg flex justify-between items-center">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={handleDownload}
        className="text-purple-600 font-semibold"
      >
        Download
      </button>
    </div>
  );
};

export default FileCard;
