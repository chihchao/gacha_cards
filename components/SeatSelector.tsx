
import React from 'react';
import { audioService } from '../services/audioService';

interface SeatSelectorProps {
  selectedSeat: number | null;
  onSelect: (seat: number) => void;
  shake: boolean;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ selectedSeat, onSelect, shake }) => {
  const seats = Array.from({ length: 28 }, (_, i) => i + 1);

  const handleSelect = (seat: number) => {
    audioService.playSelect();
    onSelect(seat);
  };

  return (
    <div className={`w-full bg-white/90 backdrop-blur-md border-t border-indigo-100 py-3 overflow-hidden flex flex-col items-center justify-center transition-transform ${shake ? 'animate-shake' : ''}`}>
      <div className="text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-widest">
        請先選擇座號
      </div>
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex flex-nowrap gap-3 justify-start sm:justify-center min-w-max px-6">
          {seats.map((seat) => (
            <button
              key={seat}
              onClick={() => handleSelect(seat)}
              className={`
                w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0
                ${selectedSeat === seat 
                  ? 'bg-indigo-600 text-white scale-110 shadow-lg ring-2 ring-indigo-200' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}
              `}
            >
              {seat}
            </button>
          ))}
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SeatSelector;
