import React, { useState, useEffect, useRef } from 'react';
import { Contact, Message } from '../types';
import { WinWindow, WinTitleBar, WinButton, WinTextArea, WinInsetPanel } from './RetroUI';
import { ICQFlower, SendIcon } from './Icons';
import { getReplyFromGemini } from '../services/geminiService';
import { useSound } from '../hooks/useSound';

interface Props {
  contact: Contact;
  initialMessages: Message[];
  onClose: () => void;
  onSendMessage: (contactId: string, text: string) => void;
}

export const ChatWindow: React.FC<Props> = ({ contact, initialMessages, onClose, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { playIncomingMessage, playTypewriter } = useSound();

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    playTypewriter();
    
    // Simulate network delay and typing
    setIsTyping(true);
    
    // Call Gemini
    const replyText = await getReplyFromGemini(contact.name, contact.id, userMsg.text);
    
    setIsTyping(false);
    
    const replyMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'contact',
      text: replyText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, replyMsg]);
    playIncomingMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <WinWindow className="w-[320px] h-[350px] absolute top-10 left-10 z-50 flex flex-col">
      <WinTitleBar 
        title={`Message Session with ${contact.name}`} 
        icon={<ICQFlower status={contact.isOnline ? 'online' : 'offline'} />} 
        onClose={onClose} 
      />

      <div className="flex-1 flex flex-col p-1 gap-1 overflow-hidden">
        
        {/* Toolbar Placeholder */}
        <div className="flex gap-1 mb-1 border-b border-[#808080] pb-1">
            <WinButton className="w-6 h-6 flex items-center justify-center">T</WinButton>
            <WinButton className="w-6 h-6 flex items-center justify-center text-xs">A</WinButton>
            <WinButton className="w-6 h-6 flex items-center justify-center font-bold">B</WinButton>
            <WinButton className="w-6 h-6 flex items-center justify-center italic">I</WinButton>
        </div>

        {/* Message Log */}
        <WinInsetPanel className="flex-1 bg-white overflow-y-scroll p-1 font-['Tahoma'] text-[11px] leading-tight">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <div className={`font-bold ${msg.sender === 'user' ? 'text-[#000080]' : 'text-[#800000]'}`}>
                {msg.sender === 'user' ? 'You' : contact.name}:
              </div>
              <div className="pl-2 text-black whitespace-pre-wrap">
                  {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="text-[#808080] italic text-[10px] pl-2">* User is typing...</div>
          )}
          <div ref={messagesEndRef} />
        </WinInsetPanel>

        {/* Bottom Split: Input Area */}
        <div className="h-[80px] flex gap-1 mt-1">
          <div className="flex-1 h-full">
            <WinTextArea 
              className="w-full h-full"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="w-[60px] flex flex-col gap-1">
            <WinButton className="flex-1 font-bold flex flex-col items-center justify-center" onClick={handleSend}>
                <span className="text-[9px] mb-1">Send</span>
                <SendIcon />
            </WinButton>
            <WinButton className="h-[20px] text-[9px]" onClick={onClose}>Close</WinButton>
          </div>
        </div>
      </div>
    </WinWindow>
  );
};
