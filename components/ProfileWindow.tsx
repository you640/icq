import React from 'react';
import { Contact } from '../types';
import { WinWindow, WinTitleBar, WinButton, WinInsetPanel } from './RetroUI';
import { ICQFlower } from './Icons';

interface Props {
  contact: Contact;
  onClose: () => void;
  isActive: boolean;
  onMouseDown: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

export const ProfileWindow: React.FC<Props> = ({ contact, onClose, isActive, onMouseDown, onDragStart }) => {
  return (
    <WinWindow className="w-[280px] h-[320px] flex flex-col" onMouseDown={onMouseDown}>
      <WinTitleBar 
        title="User Details" 
        onClose={onClose} 
        isActive={isActive}
        onMouseDown={onDragStart}
        icon={<div className="scale-75"><ICQFlower status={contact.isOnline ? 'online' : 'offline'} /></div>}
      />
      
      <div className="p-2 flex-1 flex flex-col gap-3 font-['Tahoma'] text-[11px]">
        
        {/* Header Info */}
        <div className="flex gap-3 items-start">
             <div className="w-[60px] h-[60px] bg-white border-2 border-inset border-[#808080] flex items-center justify-center">
                <ICQFlower status={contact.isOnline ? 'online' : 'offline'} />
             </div>
             <div className="flex-1 flex flex-col gap-1">
                 <div className="font-bold">{contact.name}</div>
                 <div className="text-[#808080]">{contact.isOnline ? 'Online' : 'Offline'}</div>
             </div>
        </div>

        {/* Tab-like separator */}
        <div className="border-t border-white border-b border-[#808080] h-[2px] my-1"></div>

        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-0">
                <label className="text-[10px] text-[#808080]">Nickname:</label>
                <WinInsetPanel className="px-1 py-[2px] bg-[#dfdfdf]">{contact.name}</WinInsetPanel>
            </div>
            
            <div className="flex flex-col gap-0">
                <label className="text-[10px] text-[#808080]">ICQ #:</label>
                <WinInsetPanel className="px-1 py-[2px] bg-[#dfdfdf]">{contact.uin}</WinInsetPanel>
            </div>

            <div className="flex flex-col gap-0">
                <label className="text-[10px] text-[#808080]">Current Status:</label>
                <WinInsetPanel className="px-1 py-[2px] bg-[#dfdfdf]">{contact.status}</WinInsetPanel>
            </div>
             
             <div className="flex flex-col gap-0">
                <label className="text-[10px] text-[#808080]">Email:</label>
                <WinInsetPanel className="px-1 py-[2px] bg-[#dfdfdf] text-[#808080]">N/A (Private)</WinInsetPanel>
            </div>
        </div>

        <div className="mt-auto flex justify-center">
            <WinButton className="w-[80px]" onClick={onClose}>Close</WinButton>
        </div>
      </div>
    </WinWindow>
  );
};
