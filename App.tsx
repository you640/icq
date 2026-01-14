import React, { useState, useEffect } from 'react';
import { ContactList } from './components/ContactList';
import { ChatWindow } from './components/ChatWindow';
import { Contact, UserStatus, Message } from './types';
import { useSound } from './hooks/useSound';

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'CoolDude99', uin: '123456', status: UserStatus.ONLINE, isOnline: true },
  { id: '2', name: 'MatrixFan', uin: '765432', status: UserStatus.AWAY, isOnline: true },
  { id: '3', name: 'SkaterBoy', uin: '112233', status: UserStatus.ONLINE, isOnline: true },
  { id: '4', name: 'LaraCroft', uin: '998877', status: UserStatus.OFFLINE, isOnline: false },
  { id: '5', name: 'SystemAdmin', uin: '100001', status: UserStatus.OFFLINE, isOnline: false },
];

const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.ONLINE);
  const [openChats, setOpenChats] = useState<string[]>([]);
  const { playUhOh } = useSound();

  // Simulate random incoming events
  useEffect(() => {
    // Play Uh-Oh on mount for nostalgia
    const timer = setTimeout(() => playUhOh(), 1000);
    return () => clearTimeout(timer);
  }, [playUhOh]);

  const handleContactClick = (contactId: string) => {
    if (!openChats.includes(contactId)) {
      setOpenChats(prev => [...prev, contactId]);
    }
  };

  const closeChat = (contactId: string) => {
    setOpenChats(prev => prev.filter(id => id !== contactId));
  };

  return (
    <div className="w-full h-screen flex items-start justify-center pt-10 gap-4 overflow-hidden relative selection:bg-[#000080] selection:text-white">
      {/* Desktop Icons Mock (Background) */}
      <div className="absolute top-5 left-5 flex flex-col items-center gap-1 w-16 group cursor-pointer-retro">
          <div className="w-8 h-8 bg-blue-900 border-2 border-white opacity-80"></div>
          <span className="text-white text-[11px] drop-shadow-md bg-[#008080] group-hover:bg-[#000080]">My Computer</span>
      </div>
      <div className="absolute top-24 left-5 flex flex-col items-center gap-1 w-16 group cursor-pointer-retro">
          <div className="w-8 h-8 bg-blue-900 border-2 border-white opacity-80"></div>
          <span className="text-white text-[11px] drop-shadow-md bg-[#008080] group-hover:bg-[#000080]">Network</span>
      </div>

      {/* Main ICQ Window - Positioned relatively static in center for demo */}
      <div className="relative z-10 shadow-xl">
        <ContactList 
          userStatus={userStatus} 
          contacts={contacts} 
          onContactClick={handleContactClick} 
          onStatusChange={setUserStatus}
        />
      </div>

      {/* Render Open Chat Windows */}
      {openChats.map((contactId, index) => {
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return null;
        
        // Stagger windows slightly
        const style = {
          position: 'absolute' as const,
          top: `${50 + (index * 30)}px`,
          left: `${300 + (index * 30)}px`,
          zIndex: 20 + index
        };

        return (
          <div key={contactId} style={style}>
            <ChatWindow 
              contact={contact} 
              initialMessages={[]} 
              onClose={() => closeChat(contactId)}
              onSendMessage={(id, text) => console.log(id, text)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default App;
