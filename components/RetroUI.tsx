import React from 'react';

// Common Windows 95 Colors
// Gray: #c0c0c0
// Dark Shadow: #808080
// Black: #000000
// Light: #dfdfdf
// Highlight: #ffffff

interface Props {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export const WinWindow: React.FC<Props> = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`bg-[#c0c0c0] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-r-[#000000] border-b-[#000000] p-[2px] shadow-md select-none ${className}`}
      {...props}
    >
      <div className="border border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] h-full flex flex-col relative">
        {children}
      </div>
    </div>
  );
};

interface TitleBarProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  onClose?: () => void;
  onMinimize?: () => void;
  isActive?: boolean;
}

export const WinTitleBar: React.FC<TitleBarProps> = ({ 
  icon, title, onClose, onMinimize, isActive = true, className = '', ...props 
}) => {
  return (
    <div 
      className={`flex items-center justify-between p-1 h-[18px] mb-[2px] ${isActive ? 'bg-[#000080]' : 'bg-[#808080]'} text-white ${className}`}
      {...props}
    >
      <div className="flex items-center gap-1 overflow-hidden pointer-events-none">
        {icon && <div className="w-3 h-3">{icon}</div>}
        <span className="font-bold text-[11px] truncate leading-none pt-[1px]">{title}</span>
      </div>
      <div className="flex gap-[2px]" onMouseDown={(e) => e.stopPropagation()}>
        {/* Minimize Button */}
        <button 
          onClick={onMinimize}
          className="w-[14px] h-[14px] bg-[#c0c0c0] border border-t-[#ffffff] border-l-[#ffffff] border-r-[#000000] border-b-[#000000] flex items-center justify-center active:border-t-[#000000] active:border-l-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff]"
        >
          <div className="w-[6px] h-[2px] bg-black translate-y-[3px]"></div>
        </button>
        {/* Maximize Button Mock */}
        <button className="w-[14px] h-[14px] bg-[#c0c0c0] border border-t-[#ffffff] border-l-[#ffffff] border-r-[#000000] border-b-[#000000] flex items-center justify-center active:border-t-[#000000] active:border-l-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff]">
             <div className="w-[8px] h-[7px] border border-black border-t-2"></div>
        </button>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="w-[14px] h-[14px] bg-[#c0c0c0] border border-t-[#ffffff] border-l-[#ffffff] border-r-[#000000] border-b-[#000000] flex items-center justify-center active:border-t-[#000000] active:border-l-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff] ml-[2px]"
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor" className="text-black">
             <path d="M1 1 L9 9 M9 1 L1 9" stroke="black" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const WinButton: React.FC<Props & { isActive?: boolean }> = ({ className = '', children, isActive = false, ...props }) => {
  // If isActive is true, simulated pressed state permanently
  const borderClass = isActive 
    ? 'border-t-[#000000] border-l-[#000000] border-r-[#ffffff] border-b-[#ffffff] bg-[#dfdfdf] ' // Sunken
    : 'border-t-[#ffffff] border-l-[#ffffff] border-r-[#000000] border-b-[#000000] active:border-t-[#000000] active:border-l-[#000000] active:border-r-[#ffffff] active:border-b-[#ffffff]'; // Raised

  return (
    <button 
      className={`bg-[#c0c0c0] border-[1.5px] outline-none focus:outline-none px-2 py-[1px] text-[11px] text-black ${borderClass} ${className}`}
      {...props}
    >
      <div className={`${isActive ? 'translate-x-[1px] translate-y-[1px]' : 'active:translate-x-[1px] active:translate-y-[1px]'}`}>
        {children}
      </div>
    </button>
  );
};

export const WinInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input 
      className={`bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] px-1 py-[2px] outline-none text-[11px] ${className}`}
      {...props}
    />
  );
};

export const WinTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => {
  return (
    <textarea 
      className={`bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] px-1 py-[2px] outline-none text-[11px] resize-none ${className}`}
      {...props}
    />
  );
};

export const WinInsetPanel: React.FC<Props> = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
