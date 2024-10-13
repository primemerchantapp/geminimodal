import React from 'react';
import { Message } from '../types';
import { FileText, Image, Video } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isUser ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg p-3 shadow`}>
        {message.files && message.files.length > 0 && (
          <div className="mb-2">
            {message.files.map((file, index) => (
              <div key={index} className="flex items-center mb-1">
                {file.mimeType.startsWith('image/') && <Image size={16} className="mr-1" />}
                {file.mimeType.startsWith('video/') && <Video size={16} className="mr-1" />}
                {file.mimeType.includes('pdf') || file.mimeType.includes('document') && <FileText size={16} className="mr-1" />}
                <span className="text-sm">{file.name}</span>
              </div>
            ))}
          </div>
        )}
        <p className="break-words">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;