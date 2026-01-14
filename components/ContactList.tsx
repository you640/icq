import React, { useState } from 'react';
import { Contact, UserStatus } from '../types';
import { WinWindow, WinTitleBar, WinButton, WinInsetPanel } from './RetroUI';
import { ICQFlower, SystemIcon, AddIcon, SearchIcon } from './Icons';

interface Props {
  userStatus: UserStatus;
  contacts: Contact[];
  onContactClick: (contactId: string) => void;
  onStatusChange: (status: UserStatus) => void;
}

export const ContactList: React.FC<Props> = ({ userStatus, contacts, onContactClick, onStatusChange }) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const onlineContacts = contacts.filter(c => c.isOnline);
  const offlineContacts = contacts.filter(c => !c.isOnline);

  const renderGroup = (title: string, groupContacts: Contact[]) => {
    const isCollapsed = collapsedGroups[title];
    return (
      <div className="mb-1">
        <div 
          className="flex items-center gap-1 cursor-pointer select-none mb-[2px]" 
          onClick={() => toggleGroup(title)}
        >
          {/* Simple Triangle Icon for collapse */}
          <div className="w-2 h-2 flex items-center justify-center">
             <svg width="6" height="6" viewBox="0 0 6 6">
                 {isCollapsed 
                   ? <path d="M0 0 L0 6 L6 3 Z" fill="black" /> 
                   : <path d="M0 0 L6 0 L3 6 Z" fill="black" />
                 }
             </svg>
          </div>
          <span className="font-bold text-[#000000] text-[11px]">{title}</span>
        </div>
        
        {!isCollapsed && (
          <div className="pl-1 flex flex-col gap-[1px]">
            {groupContacts.map(contact => (
              <div 
                key={contact.id} 
                className="flex items-center gap-1 px-1 py-[1px] hover:bg-[#000080] hover:text-white cursor-pointer group"
                onClick={() => onContactClick(contact.id)}
                onDoubleClick={() => onContactClick(contact.id)}
              >
                <div className="w-3 h-3 flex-shrink-0">
                  <ICQFlower status={contact.isOnline ? 'online' : 'offline'} />
                </div>
                <span className="text-[11px] truncate flex-1">{contact.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <WinWindow className="w-[220px] h-[500px] flex flex-col relative z-0">
      <WinTitleBar 
        title="2431901 - ICQ" 
        icon={<div className="text-[9px] font-bold bg-[#00ff00] text-black px-[2px] rounded-sm">ICQ</div>} 
        onClose={() => alert('Cannot exit ICQ!')}
      />

      <div className="flex-1 flex flex-col p-1 gap-1 overflow-hidden">
        {/* Status Dropdown Mock */}
        <div className="relative">
             <WinButton className="w-full text-left flex items-center gap-1 h-[22px]">
                <ICQFlower status={userStatus === UserStatus.ONLINE ? 'online' : 'away'} />
                <span className="flex-1 font-bold">Status: {userStatus}</span>
                <span className="text-[8px]">▼</span>
             </WinButton>
        </div>

        {/* Contact List Panel */}
        <WinInsetPanel className="flex-1 bg-white overflow-y-auto p-1 scrollbar-retro">
          {renderGroup('Online', onlineContacts)}
          {renderGroup('Offline', offlineContacts)}
        </WinInsetPanel>
      </div>

      {/* Footer / Toolbar */}
      <div className="h-[40px] border-t border-[#808080] pt-1 mt-1 flex items-center justify-between px-1">
          <WinButton className="flex flex-col items-center justify-center w-12 h-10 gap-0">
              <div className="scale-75"><SystemIcon /></div>
              <span className="text-[9px]">System</span>
          </WinButton>
          <WinButton className="flex flex-col items-center justify-center w-12 h-10 gap-0">
              <div className="scale-75"><AddIcon /></div>
              <span className="text-[9px]">Add</span>
          </WinButton>
           <WinButton className="flex flex-col items-center justify-center w-12 h-10 gap-0">
              <div className="scale-75"><SystemIcon /></div>
              <span className="text-[9px]">Group</span>
          </WinButton>
          <WinButton className="flex flex-col items-center justify-center w-12 h-10 gap-0">
              <div className="scale-75"><SearchIcon /></div>
              <span className="text-[9px]">Search</span>
          </WinButton>
      </div>
      
      {/* Banner Ad Area (Classic ICQ) */}
      <div className="h-[30px] bg-[#000000] text-[#00ff00] text-[10px] flex items-center justify-center font-mono mt-1 border-2 border-inset border-[#808080]">
           * ICQ 99 Power *
      </div>
    </WinWindow>
  );
};
