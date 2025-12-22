
import React from 'react';
import { audioService } from '../services/audioService';
import { Student } from '../types';

interface SeatSelectorProps {
  selectedSeat: string | null;
  onSelect: (seat: string) => void;
  shake: boolean;
  students: Student[];
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ selectedSeat, onSelect, shake, students }) => {
  // 提取學生的座號，並確保按座號數字排序（如果可能）
  const seatList = [...students].sort((a, b) => {
    const numA = parseInt(a.seat.replace(/[^0-9]/g, '')) || 0;
    const numB = parseInt(b.seat.replace(/[^0-9]/g, '')) || 0;
    return numA - numB;
  });

  const handleSelect = (seat: string) => {
    audioService.playSelect();
    onSelect(seat);
  };

  // 輔助函式：簡化顯示標籤 (例如 "No. 01" -> "1")
  const getDisplayLabel = (seat: string) => {
    const numeric = seat.replace(/[^0-9]/g, '').replace(/^0+/, '');
    return numeric || seat;
  };

  return (
    <div className={`w-full bg-white/90 backdrop-blur-md border-t border-indigo-100 py-3 overflow-hidden flex flex-col items-center justify-center transition-transform ${shake ? 'animate-shake' : ''}`}>
      <div className="text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-widest">
        請先點選座號 (目前共 {students.length} 位)
      </div>
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex flex-nowrap gap-3 justify-start sm:justify-center min-w-max px-6">
          {seatList.map((student) => (
            <button
              key={student.id}
              onClick={() => handleSelect(student.seat)}
              className={`
                w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shrink-0
                ${selectedSeat === student.seat 
                  ? 'bg-indigo-600 text-white scale-110 shadow-lg ring-2 ring-indigo-200' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}
              `}
              title={student.name}
            >
              {getDisplayLabel(student.seat)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
