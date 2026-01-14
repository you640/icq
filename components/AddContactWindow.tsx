import React, { useState } from 'react';
import { WinWindow, WinTitleBar, WinButton, WinInput, WinInsetPanel } from './RetroUI';
import { SearchIcon, AddIcon } from './Icons';

interface Props {
  onClose: () => void;
  onAdd: (name: string, uin: string) => void;
  isActive: boolean;
  onMouseDown: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

export const AddContactWindow: React.FC<Props> = ({ onClose, onAdd, isActive, onMouseDown, onDragStart }) => {
  const [nick, setNick] = useState('');
  const [uin, setUin] = useState('');

  const handleAdd = () => {
    if (nick && uin) {
      onAdd(nick, uin);
      onClose();
    }
  };

  return (
    <WinWindow className="w-[300px] h-[280px] flex flex-col" onMouseDown={onMouseDown}>
      <WinTitleBar 
        title="Add / Find User" 
        onClose={onClose} 
        isActive={isActive}
        onMouseDown={onDragStart}
        icon={<div className="scale-75"><AddIcon /></div>}
      />
      
      <div className="p-2 flex-1 flex flex-col gap-2">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-white -mb-[2px] z-10 relative">
          <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-r-2 border-white border-b-0 px-2 py-1 text-[11px] font-bold pb-2 -mb-[2px] z-20">
            Add
          </div>
          <div className="bg-[#c0c0c0] border-t-2 border-l-2 border-r-2 border-[#808080] border-b border-[#808080] px-2 py-1 text-[11px] text-[#808080]">
            Search
          </div>
        </div>

        {/* Tab Content */}
        <div className="border-2 border-white border-r-[#808080] border-b-[#808080] p-3 flex-1 flex flex-col gap-3">
          
          <div className="flex flex-col gap-1">
            <label className="text-[11px]">Nickname:</label>
            <WinInput 
              value={nick} 
              onChange={(e) => setNick(e.target.value)} 
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px]">UIN (User ID):</label>
            <WinInput 
              value={uin} 
              onChange={(e) => setUin(e.target.value)} 
              placeholder="e.g. 123456"
            />
          </div>

          <fieldset className="border border-[#808080] border-l-white border-t-white p-2 mt-2">
            <legend className="px-1 text-[11px]">Authorization</legend>
            <div className="flex gap-2 items-center">
              <input type="radio" name="auth" defaultChecked id="auth_req" />
              <label htmlFor="auth_req" className="text-[11px]">Request Auth</label>
            </div>
          </fieldset>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-auto">
          <WinButton className="w-[70px] font-bold" onClick={handleAdd}>Add</WinButton>
          <WinButton className="w-[70px]" onClick={onClose}>Cancel</WinButton>
        </div>
      </div>
    </WinWindow>
  );
};
