
import React from 'react';
import { CardData } from '../types';
import { Trophy, Check } from 'lucide-react';

interface ResultModalProps {
  seat: number | null;
  card: CardData | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ seat, card, onClose }) => {
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-yellow-600 shadow-inner">
          <Trophy size={48} />
        </div>
        
        <h2 className="text-3xl font-black text-gray-800 mb-6">
          恭喜 {seat} 號！
        </h2>

        <div className="w-full bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 mb-8">
            <span className="text-4xl font-black text-indigo-600 block">
                {card.prize.name}
            </span>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg active:scale-95"
        >
          <Check size={20} />
          確認領取
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
