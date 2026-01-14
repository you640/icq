import React, { useState, useEffect } from 'react';
import { WinButton, WinInsetPanel } from './RetroUI';
import { WindowsLogo, ShutdownIcon, ICQFlower } from './Icons';
import { UserStatus } from '../types';

interface Task {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isActive: boolean;
  isMinimized: boolean;
}

interface Props {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onStartClick: () => void;
  isStartOpen: boolean;
  userStatus: UserStatus;
  onStatusChange: (status: UserStatus) => void;
}

export const Taskbar: React.FC<Props> = ({ tasks, onTaskClick, onStartClick, isStartOpen, userStatus, onStatusChange }) => {
  const [time, setTime] = useState(new Date());
  const [isTrayMenuOpen, setIsTrayMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFlowerStatus = (status: UserStatus) => {
    if (status === UserStatus.OFFLINE || status === UserStatus.INVISIBLE) return 'offline';
    if (status === UserStatus.ONLINE) return 'online';
    return 'away';
  };

  return (
    <>
      {/* Start Menu Popup */}
      {isStartOpen && (
        <div className="absolute bottom-[30px] left-[2px] w-[180px] bg-[#c0c0c0] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-r-[#000000] border-b-[#000000] shadow-xl z-50 flex flex-col">
          <div className="flex bg-[#000080] text-white p-1 items-end h-[160px] w-[24px] absolute left-[2px] top-[2px] bottom-[2px]">
             <span className="transform -rotate-90 origin-bottom-left text-lg font-bold translate-x-[4px] -translate-y-[10px]">Windows95</span>
          </div>
          <div className="pl-[30px] pr-1 py-1 flex flex-col gap-1">
             <div className="hover:bg-[#000080] hover:text-white px-2 py-1 flex items-center gap-2 cursor-pointer">
                <div className="w-4 h-4 bg-gray-500"></div>
                <span>Programs</span>
             </div>
             <div className="hover:bg-[#000080] hover:text-white px-2 py-1 flex items-center gap-2 cursor-pointer">
                <div className="w-4 h-4 bg-gray-500"></div>
                <span>Documents</span>
             </div>
             <div className="hover:bg-[#000080] hover:text-white px-2 py-1 flex items-center gap-2 cursor-pointer">
                <div className="w-4 h-4 bg-gray-500"></div>
                <span>Settings</span>
             </div>
             <div className="h-[1px] bg-gray-500 my-1 mx-1 shadow-white shadow-[0_1px_0]"></div>
             <div className="hover:bg-[#000080] hover:text-white px-2 py-1 flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                <div className="scale-75"><ShutdownIcon /></div>
                <span>Shut Down...</span>
             </div>
          </div>
        </div>
      )}

      {/* Tray Menu */}
      {isTrayMenuOpen && (
        <div className="absolute bottom-[28px] right-0 w-[140px] bg-[#c0c0c0] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-r-[#000000] border-b-[#000000] shadow-xl z-[60] flex flex-col p-[2px]">
             <div className="text-[11px] text-gray-500 px-2 pb-1 border-b border-gray-400 mb-1">My Status</div>
             {Object.values(UserStatus).map(status => (
                <div 
                  key={status}
                  className="hover:bg-[#000080] hover:text-white px-2 py-[2px] flex items-center gap-2 cursor-pointer text-[11px] group"
                  onClick={() => {
                    onStatusChange(status);
                    setIsTrayMenuOpen(false);
                  }}
                >
                  <div className="scale-75"><ICQFlower status={getFlowerStatus(status)} /></div>
                  <span className="group-hover:text-white">{status}</span>
                </div>
             ))}
             <div className="h-[1px] bg-gray-500 my-1 mx-1 shadow-white shadow-[0_1px_0]"></div>
             <div className="hover:bg-[#000080] hover:text-white px-2 py-[2px] cursor-pointer text-[11px] pl-8" onClick={() => setIsTrayMenuOpen(false)}>
                Cancel
             </div>
        </div>
      )}

      {/* Main Taskbar */}
      <div className="absolute bottom-0 left-0 w-full h-[28px] bg-[#c0c0c0] border-t-2 border-white flex items-center px-[2px] z-50 select-none">
        
        {/* Start Button */}
        <WinButton 
          className="flex items-center gap-1 font-bold italic px-2 mr-2 h-[22px]" 
          onClick={onStartClick}
          isActive={isStartOpen}
        >
          <WindowsLogo />
          Start
        </WinButton>

        {/* Task List */}
        <div className="flex-1 flex gap-1 overflow-hidden px-1">
          {tasks.map(task => (
            <WinButton
              key={task.id}
              className={`flex-1 max-w-[150px] flex items-center gap-1 h-[22px] truncate px-1 text-left ${task.isActive && !task.isMinimized ? 'bg-[#dfdfdf] border-t-[#000000] border-l-[#000000] border-r-[#ffffff] border-b-[#ffffff]' : ''}`}
              isActive={task.isActive && !task.isMinimized}
              onClick={() => onTaskClick(task.id)}
            >
              {task.icon}
              <span className="truncate">{task.title}</span>
            </WinButton>
          ))}
        </div>

        {/* System Tray */}
        <WinInsetPanel className="w-[80px] h-[22px] flex items-center justify-center px-2 relative gap-2">
            <div 
              className="cursor-pointer hover:brightness-110 active:brightness-90 flex items-center justify-center"
              onClick={() => setIsTrayMenuOpen(!isTrayMenuOpen)}
              title="Change Status"
            >
              <ICQFlower status={getFlowerStatus(userStatus)} />
            </div>
            <span className="text-[11px]">{formatTime(time)}</span>
        </WinInsetPanel>
      </div>
    </>
  );
};
