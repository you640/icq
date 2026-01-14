import React from 'react';

export const ICQFlower: React.FC<{ status: 'online' | 'offline' | 'away' }> = ({ status }) => {
  const color = status === 'online' ? '#008000' : status === 'offline' ? '#ff0000' : '#0000ff';
  const petal = status === 'offline' ? '#800000' : color;
  
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
       {/* Simple Flower Pixel Art Approximation */}
       <rect x="6" y="2" width="2" height="4" fill={petal}/>
       <rect x="6" y="8" width="2" height="4" fill={petal}/>
       <rect x="2" y="6" width="4" height="2" fill={petal}/>
       <rect x="8" y="6" width="4" height="2" fill={petal}/>
       {/* Center */}
       <rect x="5" y="5" width="4" height="4" fill="#ffff00"/> 
       {/* Stem */}
       {status === 'online' && <rect x="9" y="9" width="3" height="3" rx="1" fill="#00ff00" opacity="0.5"/>}
    </svg>
  );
};

export const SystemIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16">
        <rect x="2" y="4" width="12" height="8" fill="#c0c0c0" stroke="black" />
        <rect x="4" y="6" width="8" height="4" fill="blue" />
    </svg>
);

export const AddIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 2v12M2 8h12" stroke="black" strokeWidth="2" />
    </svg>
);

export const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="6" cy="6" r="4" stroke="black" fill="none" strokeWidth="2"/>
        <line x1="10" y1="10" x2="14" y2="14" stroke="black" strokeWidth="2"/>
    </svg>
);

export const SendIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="black">
        <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
    </svg>
);

export const WindowsLogo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <path d="M1 2H7V7H1V2Z" fill="#e05030"/> 
    <path d="M8 2H14V7H8V2Z" fill="#80c050"/>
    <path d="M1 8H7V13H1V8Z" fill="#4080e0"/>
    <path d="M8 8H14V13H8V8Z" fill="#f0c030"/>
    <path d="M0 0H16V16H0V0ZM1 1V15H15V1H1Z" fill="black" opacity="0.1"/> 
  </svg>
);

export const ShutdownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" fill="#c0c0c0" stroke="black"/>
    <rect x="4" y="4" width="4" height="12" fill="red" />
    <rect x="10" y="4" width="10" height="4" fill="black" />
    <rect x="10" y="12" width="10" height="4" fill="black" />
  </svg>
);

// Added helper function to export all icons if needed for convenient importing in new files
export default { ICQFlower, SystemIcon, AddIcon, SearchIcon, SendIcon, WindowsLogo, ShutdownIcon };
