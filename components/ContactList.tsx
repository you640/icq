import React, { useState, useEffect } from 'react';
import { Contact, UserStatus } from '../types';
import { WinWindow, WinTitleBar, WinButton, WinInsetPanel } from './RetroUI';
import { ICQFlower, SystemIcon, AddIcon, SearchIcon } from './Icons';
import { useSound } from '../hooks/useSound';

interface Props {
  userStatus: UserStatus;
  contacts: Contact[];
  onContactClick: (contactId: string) => void;
  onStatusChange: (status: UserStatus) => void;
  onAddClick: () => void;
  onViewProfile: (contactId: string) => void;
  onDeleteContact: (contactId: string) => void;
  isActive: boolean;
  onMouseDown: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onMinimize: () => void;
}

export const ContactList: React.FC<Props> = ({ 
  userStatus, contacts, onContactClick, onStatusChange, onAddClick, onViewProfile, onDeleteContact, isActive, onMouseDown, onDragStart, onMinimize 
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const { playIncomingMessage } = useSound();
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, contactId: string } | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  const handleContextMenu = (e: React.MouseEvent, contactId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, contactId });
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const handleStatusSelect = (status: UserStatus) => {
    onStatusChange(status);
    setIsStatusMenuOpen(false);
  };

  const onlineContacts = contacts.filter(c => c.isOnline);
  const offlineContacts = contacts.filter(c => !c.isOnline);

  const getFlowerStatus = (status: UserStatus) => {
    if (status === UserStatus.OFFLINE) return 'offline';
    if (status === UserStatus.AWAY || status === UserStatus.NA) return 'away';
    return 'online';
  };

  const getStatusColorClass = (status: UserStatus) => {
      if (status === UserStatus.ONLINE) return 'text-[#008000]'; // Green
      if (status === UserStatus.AWAY || status === UserStatus.NA) return 'text-[#0000ff]';   // Blue
      return 'text-[#ff0000]'; // Red
  };

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
                onClick={() => {
                  playIncomingMessage();
                  onContactClick(contact.id);
                }}
                onContextMenu={(e) => handleContextMenu(e, contact.id)}
                onDoubleClick={() => {
                  playIncomingMessage();
                  onContactClick(contact.id);
                }}
              >
                <div className="w-3 h-3 flex-shrink-0">
                  <ICQFlower status={getFlowerStatus(contact.status)} />
                </div>
                <span className="text-[11px] truncate flex-1 flex items-baseline gap-1">
                  <span>{contact.name}</span>
                  <span className={`text-[9px] ${getStatusColorClass(contact.status)} group-hover:text-white opacity-80`}>
                      ({contact.status})
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
    <WinWindow 
      className="w-[220px] h-[500px] flex flex-col"
      onMouseDown={onMouseDown}
    >
      <WinTitleBar 
        title="2431901 - ICQ" 
        icon={<div className="text-[9px] font-bold bg-[#00ff00] text-black px-[2px] rounded-sm">ICQ</div>} 
        onClose={() => alert('Cannot exit ICQ!')}
        onMinimize={onMinimize}
        isActive={isActive}
        onMouseDown={onDragStart}
        className="cursor-default"
      />

      <div className="flex-1 flex flex-col p-1 gap-1 overflow-hidden relative">
        {/* Status Dropdown */}
        <div className="relative z-10">
             <WinButton 
               className="w-full text-left flex items-center gap-1 h-[22px]"
               onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
               isActive={isStatusMenuOpen}
             >
                <ICQFlower status={userStatus === UserStatus.ONLINE ? 'online' : userStatus === UserStatus.OFFLINE ? 'offline' : 'away'} />
                <span className="flex-1 font-bold">Status: {userStatus}</span>
                <span className="text-[8px]">▼</span>
             </WinButton>

             {isStatusMenuOpen && (
               <div className="absolute top-[24px] left-0 w-full bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#000000] border-b-[#000000] shadow-lg flex flex-col p-1 gap-[1px]">
                 {Object.values(UserStatus).map(status => (
                   <div 
                     key={status}
                     className="flex items-center gap-2 px-2 py-1 hover:bg-[#000080] hover:text-white cursor-pointer text-[11px]"
                     onClick={() => handleStatusSelect(status)}
                   >
                     <ICQFlower status={status === UserStatus.ONLINE ? 'online' : status === UserStatus.OFFLINE ? 'offline' : 'away'} />
                     <span>{status}</span>
                   </div>
                 ))}
               </div>
             )}
        </div>

        {/* Contact List Panel */}
        <WinInsetPanel 
          className="flex-1 bg-white overflow-y-auto p-1 scrollbar-retro mt-1"
          onClick={() => setIsStatusMenuOpen(false)} // Close menu if clicking elsewhere
        >
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
          <WinButton 
              className="flex flex-col items-center justify-center w-12 h-10 gap-0"
              onClick={onAddClick}
          >
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

    {/* Context Menu Render */}
    {contextMenu && (
      <div 
        style={{ top: contextMenu.y, left: contextMenu.x }}
        className="fixed z-50 w-[140px] bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#000000] border-b-[#000000] shadow-xl flex flex-col p-[2px]"
      >
         <div 
           className="hover:bg-[#000080] hover:text-white px-3 py-[2px] cursor-pointer text-[11px]"
           onClick={() => {
             onContactClick(contextMenu.contactId);
             setContextMenu(null);
           }}
         >
           Send Message
         </div>
         <div 
           className="hover:bg-[#000080] hover:text-white px-3 py-[2px] cursor-pointer text-[11px]"
           onClick={() => {
             onViewProfile(contextMenu.contactId);
             setContextMenu(null);
           }}
         >
           View Profile
         </div>
         <div className="h-[1px] bg-gray-500 my-1 mx-1 shadow-white shadow-[0_1px_0]"></div>
         <div 
           className="hover:bg-[#000080] hover:text-white px-3 py-[2px] cursor-pointer text-[11px]"
           onClick={() => {
             onDeleteContact(contextMenu.contactId);
             setContextMenu(null);
           }}
         >
           Delete Contact
         </div>
      </div>
    )}
    </>
  );
};
