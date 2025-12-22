
import React from 'react';
import { CardData, Student } from '../types';
import { Trophy, Check } from 'lucide-react';

interface ResultModalProps {
  student: Student | null;
  card: CardData | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ student, card, onClose }) => {
  if (!card || !student) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-950/60 backdrop-blur-md p-4">
      <div className="bg-white rounded-[40px] shadow-2xl max-w-sm w-full p-10 flex flex-col items-center text-center transform transition-all animate-in fade-in zoom-in duration-300 border-8 border-indigo-50">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-yellow-600 shadow-inner ring-8 ring-yellow-50">
          <Trophy size={56} className="animate-bounce" />
        </div>
        
        <div className="mb-4">
            <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2 inline-block">恭喜中獎</span>
            <h2 className="text-4xl font-black text-gray-800 mb-1">
              {student.seat} 號
            </h2>
            <p className="text-indigo-600 font-bold text-2xl">{student.name}</p>
        </div>

        <div className="w-full bg-gradient-to-b from-indigo-50 to-white border-2 border-dashed border-indigo-200 rounded-3xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-indigo-100 rounded-full opacity-50"></div>
            <p className="text-[10px] font-black text-indigo-300 mb-2 uppercase tracking-tighter">獲得獎勵卡</p>
            <span className="text-3xl font-black text-indigo-700 block drop-shadow-sm">
                {card.prize.name}
            </span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-200 active:scale-95 text-lg"
        >
          <Check size={24} strokeWidth={3} />
          領取獎勵
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
