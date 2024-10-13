import React, { useRef } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  icon: React.ReactNode;
  accept: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, icon, accept }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {icon}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
    </>
  );
};

export default FileUpload;