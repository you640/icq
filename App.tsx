import React, { useState, useEffect, useCallback } from 'react';
import { ContactList } from './components/ContactList';
import { ChatWindow } from './components/ChatWindow';
import { AddContactWindow } from './components/AddContactWindow';
import { ProfileWindow } from './components/ProfileWindow';
import { Taskbar } from './components/Taskbar';
import { Contact, UserStatus, Message } from './types';
import { useSound } from './hooks/useSound';
import { ICQFlower, AddIcon } from './components/Icons';
import { getReplyFromGemini } from './services/geminiService';

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'CoolDude99', uin: '123456', status: UserStatus.ONLINE, isOnline: true },
  { id: '2', name: 'MatrixFan', uin: '765432', status: UserStatus.AWAY, isOnline: true },
  { id: '3', name: 'SkaterBoy', uin: '112233', status: UserStatus.ONLINE, isOnline: true },
  { id: '4', name: 'LaraCroft', uin: '998877', status: UserStatus.OFFLINE, isOnline: false },
  { id: '5', name: 'SystemAdmin', uin: '100001', status: UserStatus.OFFLINE, isOnline: false },
];

interface WindowState {
  id: string;
  x: number;
  y: number;
  zIndex: number;
  minimized: boolean;
}

const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.ONLINE);
  const [openChats, setOpenChats] = useState<string[]>([]);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  
  // Global Chat History State
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({});
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  
  // Window Manager State
  const [windowPositions, setWindowPositions] = useState<Record<string, WindowState>>({
    'main': { id: 'main', x: 100, y: 50, zIndex: 10, minimized: false },
    'addContact': { id: 'addContact', x: 150, y: 150, zIndex: 11, minimized: false },
    'profile': { id: 'profile', x: 200, y: 100, zIndex: 12, minimized: false }
  });
  const [activeWindowId, setActiveWindowId] = useState<string>('main');
  const [highestZ, setHighestZ] = useState(100);
  
  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedWindowId, setDraggedWindowId] = useState<string | null>(null);

  const { playUhOh, playTypewriter, playIncomingMessage } = useSound();

  // Simulate startup sound
  useEffect(() => {
    const timer = setTimeout(() => playUhOh(), 1000);
    return () => clearTimeout(timer);
  }, [playUhOh]);

  // --- Messaging Logic ---

  const handleSendMessage = async (contactId: string, text: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setChatHistory(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), userMsg]
    }));
    playTypewriter();

    // 2. Set Typing State & Get Reply
    setTypingStatus(prev => ({ ...prev, [contactId]: true }));
    
    try {
      const replyText = await getReplyFromGemini(contact.name, contact.id, text);
      
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'contact',
        text: replyText,
        timestamp: new Date()
      };

      setChatHistory(prev => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), replyMsg]
      }));
      playIncomingMessage();
    } catch (e) {
      console.error("Failed to get reply", e);
    } finally {
      setTypingStatus(prev => ({ ...prev, [contactId]: false }));
    }
  };

  const handleAddContact = (name: string, uin: string) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      uin,
      status: UserStatus.ONLINE, // New friends are always online!
      isOnline: true
    };
    setContacts(prev => [...prev, newContact]);
    playIncomingMessage(); // Notification sound on add
  };

  const handleDeleteContact = (contactId: string) => {
      setContacts(prev => prev.filter(c => c.id !== contactId));
      closeChat(contactId);
      if (viewingProfileId === contactId) {
          setViewingProfileId(null);
      }
  };

  const handleViewProfile = (contactId: string) => {
      setViewingProfileId(contactId);
      bringToFront('profile');
      if (!windowPositions['profile']) {
         setWindowPositions(prev => ({
             ...prev,
             'profile': { id: 'profile', x: 200, y: 100, zIndex: highestZ + 1, minimized: false }
         }));
         setHighestZ(h => h + 1);
      }
  };

  // --- Window Manager Logic ---

  const bringToFront = (id: string) => {
    setActiveWindowId(id);
    setWindowPositions(prev => {
      // If window is minimized, restore it
      const wasMinimized = prev[id]?.minimized;
      if (prev[id]?.zIndex === highestZ && !wasMinimized) return prev;
      
      return {
        ...prev,
        [id]: { ...prev[id], zIndex: highestZ + 1, minimized: false }
      };
    });
    setHighestZ(prev => prev + 1);
  };

  const toggleMinimize = (id: string) => {
    if (id === 'addContact' && !isAddContactOpen) return;
    if (id === 'profile' && !viewingProfileId) return;

    setWindowPositions(prev => {
      const isCurrentlyMinimized = prev[id].minimized;
      const isCurrentlyActive = activeWindowId === id;

      // If active and not minimized, minimize it.
      if (isCurrentlyActive && !isCurrentlyMinimized) {
        return {
          ...prev,
          [id]: { ...prev[id], minimized: true }
        };
      }
      
      // If minimized, restore it.
      // If not active (but visible), bring to front.
      setActiveWindowId(id);
      setHighestZ(h => h + 1);
      return {
        ...prev,
        [id]: { ...prev[id], minimized: false, zIndex: highestZ + 1 }
      };
    });
  };

  const startDrag = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    bringToFront(id);
    const win = windowPositions[id] || { x: 0, y: 0 };
    setDraggedWindowId(id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && draggedWindowId) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      setWindowPositions(prev => ({
        ...prev,
        [draggedWindowId]: {
          ...prev[draggedWindowId],
          x: newX,
          y: newY
        }
      }));
    }
  }, [isDragging, draggedWindowId, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedWindowId(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // --- Chat Logic ---

  const handleContactClick = (contactId: string) => {
    if (!openChats.includes(contactId)) {
      setOpenChats(prev => [...prev, contactId]);
      // Initialize window position staggered
      setWindowPositions(prev => ({
        ...prev,
        [contactId]: { 
          id: contactId, 
          x: 300 + (openChats.length * 20), 
          y: 50 + (openChats.length * 20), 
          zIndex: highestZ + 1,
          minimized: false
        }
      }));
      setHighestZ(h => h + 1);
      setActiveWindowId(contactId);
    } else {
      bringToFront(contactId);
    }
  };

  const closeChat = (contactId: string) => {
    setOpenChats(prev => prev.filter(id => id !== contactId));
    setWindowPositions(prev => {
      const newState = { ...prev };
      delete newState[contactId];
      return newState;
    });
  };

  const openAddContact = () => {
    setIsAddContactOpen(true);
    bringToFront('addContact');
    if (!windowPositions['addContact']) {
       setWindowPositions(prev => ({
          ...prev,
          'addContact': { id: 'addContact', x: 150, y: 150, zIndex: highestZ + 1, minimized: false }
       }));
       setHighestZ(h => h + 1);
    }
  };

  // --- Taskbar Data ---
  const tasks = [
    { 
      id: 'main', 
      title: '2431901 - ICQ', 
      icon: <div className="text-[9px] font-bold bg-[#00ff00] text-black px-[2px] rounded-sm scale-75">ICQ</div>,
      isActive: activeWindowId === 'main',
      isMinimized: windowPositions['main']?.minimized
    },
    ...(isAddContactOpen ? [{
        id: 'addContact',
        title: 'Add / Find User',
        icon: <div className="scale-75"><AddIcon /></div>, // Needs import
        isActive: activeWindowId === 'addContact',
        isMinimized: windowPositions['addContact']?.minimized
    }] : []),
    ...(viewingProfileId ? [{
        id: 'profile',
        title: 'User Details',
        icon: <div className="scale-75"><ICQFlower status='online'/></div>,
        isActive: activeWindowId === 'profile',
        isMinimized: windowPositions['profile']?.minimized
    }] : []),
    ...openChats.map(id => {
       const contact = contacts.find(c => c.id === id);
       return {
         id,
         title: contact ? `Message: ${contact.name}` : 'Chat',
         icon: <div className="scale-75"><ICQFlower status={contact?.isOnline ? 'online' : 'offline'} /></div>,
         isActive: activeWindowId === id,
         isMinimized: windowPositions[id]?.minimized
       };
    })
  ];

  const mainWin = windowPositions['main'];
  const addWin = windowPositions['addContact'];
  const profileWin = windowPositions['profile'];
  const profileContact = viewingProfileId ? contacts.find(c => c.id === viewingProfileId) : null;

  return (
    <div 
      className="w-full h-screen flex items-start justify-center overflow-hidden relative selection:bg-[#000080] selection:text-white pb-[28px]"
      onClick={() => isStartOpen && setIsStartOpen(false)}
    >
      {/* Desktop Icons Mock (Background) */}
      <div className="absolute top-5 left-5 flex flex-col items-center gap-1 w-16 group cursor-pointer-retro z-0">
          <div className="w-8 h-8 bg-blue-900 border-2 border-white opacity-80"></div>
          <span className="text-white text-[11px] drop-shadow-md bg-[#008080] group-hover:bg-[#000080]">My Computer</span>
      </div>
      <div className="absolute top-24 left-5 flex flex-col items-center gap-1 w-16 group cursor-pointer-retro z-0">
          <div className="w-8 h-8 bg-blue-900 border-2 border-white opacity-80"></div>
          <span className="text-white text-[11px] drop-shadow-md bg-[#008080] group-hover:bg-[#000080]">Network</span>
      </div>

      {/* Main ICQ Window */}
      {!mainWin.minimized && (
        <div 
          style={{ 
            position: 'absolute', 
            left: mainWin.x, 
            top: mainWin.y, 
            zIndex: mainWin.zIndex 
          }}
        >
          <ContactList 
            userStatus={userStatus} 
            contacts={contacts} 
            onContactClick={handleContactClick} 
            onStatusChange={setUserStatus}
            onAddClick={openAddContact}
            onViewProfile={handleViewProfile}
            onDeleteContact={handleDeleteContact}
            isActive={activeWindowId === 'main'}
            onMouseDown={() => bringToFront('main')}
            onDragStart={(e) => startDrag(e, 'main')}
            onMinimize={() => toggleMinimize('main')}
          />
        </div>
      )}

      {/* Add Contact Window */}
      {isAddContactOpen && addWin && !addWin.minimized && (
        <div
          style={{
            position: 'absolute',
            left: addWin.x,
            top: addWin.y,
            zIndex: addWin.zIndex
          }}
        >
          <AddContactWindow 
            onClose={() => setIsAddContactOpen(false)}
            onAdd={handleAddContact}
            isActive={activeWindowId === 'addContact'}
            onMouseDown={() => bringToFront('addContact')}
            onDragStart={(e) => startDrag(e, 'addContact')}
          />
        </div>
      )}

      {/* Profile Window */}
      {viewingProfileId && profileContact && profileWin && !profileWin.minimized && (
        <div
          style={{
            position: 'absolute',
            left: profileWin.x,
            top: profileWin.y,
            zIndex: profileWin.zIndex
          }}
        >
          <ProfileWindow
             contact={profileContact}
             onClose={() => setViewingProfileId(null)}
             isActive={activeWindowId === 'profile'}
             onMouseDown={() => bringToFront('profile')}
             onDragStart={(e) => startDrag(e, 'profile')}
          />
        </div>
      )}

      {/* Render Open Chat Windows */}
      {openChats.map((contactId) => {
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return null;
        
        const winPos = windowPositions[contactId] || { x: 0, y: 0, zIndex: 0, minimized: false };
        if (winPos.minimized) return null;

        return (
          <div 
            key={contactId} 
            style={{ 
              position: 'absolute', 
              left: winPos.x, 
              top: winPos.y, 
              zIndex: winPos.zIndex 
            }}
          >
            <ChatWindow 
              contact={contact} 
              messages={chatHistory[contactId] || []}
              onClose={() => closeChat(contactId)}
              onSendMessage={handleSendMessage}
              isActive={activeWindowId === contactId}
              isTyping={!!typingStatus[contactId]}
              onMouseDown={() => bringToFront(contactId)}
              onDragStart={(e) => startDrag(e, contactId)}
              onMinimize={() => toggleMinimize(contactId)}
            />
          </div>
        );
      })}

      {/* Taskbar */}
      <Taskbar 
        tasks={tasks}
        onTaskClick={toggleMinimize}
        onStartClick={() => setIsStartOpen(!isStartOpen)}
        isStartOpen={isStartOpen}
        userStatus={userStatus}
        onStatusChange={setUserStatus}
      />
    </div>
  );
};

export default App;
