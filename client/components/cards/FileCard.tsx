import React from 'react';
import { FileCardProps } from './types';

const FileCard: React.FC<FileCardProps> = ({ title, description, link }) => {
  return (
    <div className="mt-2 p-4 border rounded-lg flex justify-between items-center">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <a
        href={link}
        className="text-purple-600 font-semibold"
        target="_blank"
        rel="noopener noreferrer"
      >
        View
      </a>
    </div>
  );
};

export default FileCard;
