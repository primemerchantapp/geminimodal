import React from 'react';
import { X } from 'lucide-react';
import { Personality } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  personalities: Personality[];
  selectedPersonality: Personality;
  setSelectedPersonality: (personality: Personality) => void;
  onKnowledgeBaseUpload: (file: File) => void;
  knowledgeBase: File | null;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  personalities,
  selectedPersonality,
  setSelectedPersonality,
  onKnowledgeBaseUpload,
  knowledgeBase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              AICONNECT API KEY
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your API key"
            />
          </div>
          <div>
            <label htmlFor="personality" className="block text-sm font-medium text-gray-700 mb-1">
              Personality
            </label>
            <select
              id="personality"
              value={selectedPersonality.id}
              onChange={(e) => setSelectedPersonality(personalities.find(p => p.id === e.target.value) || personalities[0])}
              className="w-full p-2 border rounded-md"
            >
              {personalities.map((personality) => (
                <option key={personality.id} value={personality.id}>
                  {personality.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="knowledgeBase" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Knowledge Base
            </label>
            <input
              type="file"
              id="knowledgeBase"
              onChange={(e) => e.target.files && onKnowledgeBaseUpload(e.target.files[0])}
              className="w-full p-2 border rounded-md"
              accept=".txt,.pdf,.doc,.docx"
            />
            {knowledgeBase && (
              <p className="mt-1 text-sm text-gray-500">
                Uploaded: {knowledgeBase.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;