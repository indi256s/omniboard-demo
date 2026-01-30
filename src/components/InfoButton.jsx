import { useState, useRef, useEffect } from 'react';

export default function InfoButton({ text }) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="ml-2 w-5 h-5 rounded-full bg-zinc-700/50 hover:bg-zinc-600/70 
                   flex items-center justify-center text-zinc-400 hover:text-zinc-200 
                   transition-all duration-200 text-xs font-medium
                   border border-zinc-600/30 hover:border-zinc-500/50"
        aria-label="Информация о метрике"
      >
        i
      </button>
      
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 left-0 top-full mt-2 w-64 p-3 
                     glass rounded-lg border border-zinc-700/50
                     text-xs text-zinc-300 leading-relaxed
                     shadow-xl shadow-black/20
                     animate-in fade-in duration-150"
        >
          {/* Arrow */}
          <div className="absolute -top-1.5 left-3 w-3 h-3 rotate-45 
                          bg-zinc-800/90 border-l border-t border-zinc-700/50" />
          <span className="relative">{text}</span>
        </div>
      )}
    </div>
  );
}
