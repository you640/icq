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
