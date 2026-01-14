import React, { useState, useEffect, useRef } from 'react';
import { Contact, Message } from '../types';
import { WinWindow, WinTitleBar, WinButton, WinTextArea, WinInsetPanel } from './RetroUI';
import { ICQFlower, SendIcon } from './Icons';

interface Props {
  contact: Contact;
  messages: Message[];
  onClose: () => void;
  onMinimize: () => void;
  onSendMessage: (contactId: string, text: string) => void;
  isActive: boolean;
  isTyping: boolean;
  onMouseDown: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

export const ChatWindow: React.FC<Props> = ({ 
  contact, messages, onClose, onMinimize, onSendMessage, isActive, isTyping, onMouseDown, onDragStart 
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new message or when typing starts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(contact.id, inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertTag = (tag: string) => {
    if (!textAreaRef.current) return;
    
    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    const text = inputText;
    
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    
    const openTag = `[${tag}]`;
    const closeTag = `[/${tag}]`;
    
    const newText = before + openTag + selection + closeTag + after;
    setInputText(newText);
    
    // Restore focus and selection
    setTimeout(() => {
        if(textAreaRef.current) {
            textAreaRef.current.focus();
            textAreaRef.current.setSelectionRange(start + openTag.length, end + openTag.length);
        }
    }, 0);
  };

  // Simple parser for [b] and [i] tags and URLs
  const renderMessageText = (text: string) => {
    // 1. Split by tags
    const parts = text.split(/(\[b\].*?\[\/b\]|\[i\].*?\[\/i\]|https?:\/\/[^\s]+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('[b]') && part.endsWith('[/b]')) {
        return <strong key={index}>{part.slice(3, -4)}</strong>;
      }
      if (part.startsWith('[i]') && part.endsWith('[/i]')) {
        return <em key={index}>{part.slice(3, -4)}</em>;
      }
      if (part.match(/^https?:\/\//)) {
        return <a key={index} href={part} target="_blank" rel="noreferrer" className="text-blue-800 underline hover:text-blue-600">{part}</a>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <WinWindow 
      className="w-[320px] h-[350px] flex flex-col"
      onMouseDown={onMouseDown} // Bring to front on click
    >
      <WinTitleBar 
        title={`Message Session with ${contact.name}`} 
        icon={<ICQFlower status={contact.isOnline ? 'online' : 'offline'} />} 
        onClose={onClose} 
        onMinimize={onMinimize}
        isActive={isActive}
        onMouseDown={onDragStart} // Start drag
        className="cursor-default"
      />

      <div className="flex-1 flex flex-col p-1 gap-1 overflow-hidden">
        
        {/* Toolbar */}
        <div className="flex gap-1 mb-1 border-b border-[#808080] pb-1">
            <WinButton className="w-6 h-6 flex items-center justify-center font-serif">T</WinButton>
            <WinButton className="w-6 h-6 flex items-center justify-center font-bold" onClick={() => insertTag('b')}>B</WinButton>
            <WinButton className="w-6 h-6 flex items-center justify-center italic font-serif" onClick={() => insertTag('i')}>I</WinButton>
            <WinButton className="w-6 h-6 flex items-center justify-center underline">U</WinButton>
            <div className="border-l border-[#808080] mx-1 h-full"></div>
            <WinButton className="w-6 h-6 flex items-center justify-center text-[9px]">☺</WinButton>
        </div>

        {/* Message Log */}
        <WinInsetPanel className="flex-1 bg-white overflow-y-scroll p-1 font-['Tahoma'] text-[11px] leading-tight">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <div className={`font-bold ${msg.sender === 'user' ? 'text-[#000080]' : 'text-[#800000]'}`}>
                {msg.sender === 'user' ? 'You' : contact.name}:
              </div>
              <div className="pl-2 text-black whitespace-pre-wrap">
                  {renderMessageText(msg.text)}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="text-[#808080] italic text-[10px] pl-2 mt-2">* {contact.name} is typing...</div>
          )}
          <div ref={messagesEndRef} />
        </WinInsetPanel>

        {/* Bottom Split: Input Area */}
        <div className="h-[80px] flex gap-1 mt-1">
          <div className="flex-1 h-full">
            <WinTextArea 
              ref={textAreaRef}
              className="w-full h-full font-['Tahoma']"
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
