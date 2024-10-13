import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, FileText, Video, Settings } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import FileUpload from './components/FileUpload';
import SettingsModal from './components/SettingsModal';
import { Message, FileType, Personality } from './types';

const personalities: Personality[] = [
  { id: 'default', name: 'AiConnect', prompt: '' },
  { id: 'attorney', name: 'Attorney from Aitek', prompt: 'You are an experienced attorney specializing in corporate law.' },
  { id: 'doctor', name: 'Doctor from Aitek PH', prompt: 'You are a licensed medical doctor with expertise in general medicine.' },
  { id: 'teacher', name: 'Teacher', prompt: 'You are a passionate elementary school teacher with 15 years of experience.' },
  { id: 'chef', name: 'Chef', prompt: 'You are a Michelin-starred chef specializing in fusion cuisine.' },
  { id: 'engineer', name: 'Engineer', prompt: 'You are a software engineer with expertise in AI and machine learning.' },
  { id: 'psychologist', name: 'Psychologist', prompt: 'You are a licensed clinical psychologist specializing in cognitive behavioral therapy.' },
  { id: 'financial_advisor', name: 'Financial Advisor', prompt: 'You are a certified financial planner with 20 years of experience in investment strategies.' },
  { id: 'travel_agent', name: 'Travel Agent', prompt: 'You are an experienced travel agent specializing in luxury and adventure travel.' },
  { id: 'fitness_trainer', name: 'Fitness Trainer', prompt: 'You are a certified personal trainer and nutritionist with expertise in weight loss and muscle building.' },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState<Personality>(personalities[0]);
  const [knowledgeBase, setKnowledgeBase] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' && uploadedFiles.length === 0) return;

    const newMessage: Message = {
      role: 'user',
      content: input,
      files: uploadedFiles,
    };

    setMessages([...messages, newMessage]);
    setInput('');
    setUploadedFiles([]);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            { role: 'system', parts: [{ text: selectedPersonality.prompt }] },
            ...messages,
            newMessage,
          ].map(msg => ({
            role: msg.role,
            parts: [
              ...(msg.files?.map(file => ({
                fileData: {
                  fileUri: file.fileUri,
                  mimeType: file.mimeType,
                },
              })) || []),
              { text: msg.content },
            ],
          })),
          generationConfig: {
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      });

      const data = await response.json();
      const botReply: Message = {
        role: 'model',
        content: data.candidates[0].content.parts[0].text,
      };

      setMessages(prevMessages => [...prevMessages, botReply]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'X-Goog-Upload-Command': 'start, upload, finalize',
          'X-Goog-Upload-Header-Content-Length': file.size.toString(),
          'X-Goog-Upload-Header-Content-Type': file.type,
        },
        body: formData,
      });

      const data = await response.json();
      setUploadedFiles(prevFiles => [...prevFiles, {
        fileUri: data.file.uri,
        mimeType: file.type,
        name: file.name,
      }]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setIsUploading(false);
  };

  const handleKnowledgeBaseUpload = (file: File) => {
    setKnowledgeBase(file);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{selectedPersonality.name}</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <Settings size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white">
        <div className="flex items-center space-x-2 mb-2">
          <FileUpload onFileUpload={handleFileUpload} icon={<Image size={20} />} accept="image/*" />
          <FileUpload onFileUpload={handleFileUpload} icon={<FileText size={20} />} accept=".pdf,.doc,.docx" />
          <FileUpload onFileUpload={handleFileUpload} icon={<Video size={20} />} accept="video/*" />
        </div>
        {uploadedFiles.length > 0 && (
          <div className="mb-2">
            {uploadedFiles.map((file, index) => (
              <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {file.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white rounded-r-lg p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isUploading}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        personalities={personalities}
        selectedPersonality={selectedPersonality}
        setSelectedPersonality={setSelectedPersonality}
        onKnowledgeBaseUpload={handleKnowledgeBaseUpload}
        knowledgeBase={knowledgeBase}
      />
    </div>
  );
}

export default App;