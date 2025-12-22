
import React from 'react';
import { Student } from '../types';
import { getRewardDefinition } from '../constants';
import { X, Play } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
  onUpdate: (type: string, delta: number) => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose, onUpdate }) => {
  const heldKeys = Object.keys(student.inventory).filter(key => student.inventory[key] > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-inner">
              <img src={student.avatar} alt={student.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-indigo-200 text-xs font-bold">{student.seat}</p>
              <h2 className="text-2xl font-black">{student.name}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">目前持有獎勵</h3>
          
          {heldKeys.length === 0 ? (
            <div className="py-12 text-center text-gray-300 italic">尚未獲得任何獎勵卡</div>
          ) : (
            <div className="space-y-3">
              {heldKeys.map(key => {
                const def = getRewardDefinition(key);
                return (
                  <div key={key} className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:shadow-sm ${def.bgClass}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{def.icon.split(' ')[0]}</span>
                      <div>
                        <p className="font-black leading-none">{def.name}</p>
                        <p className="text-sm font-bold opacity-70">數量：{student.inventory[key]}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onUpdate(key, -1)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-md transition-all active:scale-95 flex items-center gap-2"
                      >
                        <Play size={14} fill="currentColor" /> 使用獎勵
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
