
import React from 'react';
import { Student } from '../types';
import { getRewardDefinition } from '../constants';

interface StudentCardProps {
  student: Student;
  onClick: () => void;
  onReceiveReward: (type: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  // 過濾出目前持有的獎勵
  const heldRewardKeys = Object.keys(student.inventory).filter(key => student.inventory[key] > 0);

  return (
    <div 
      onClick={onClick}
      className="relative bg-white rounded-xl shadow-sm border-2 border-indigo-100 p-2 transition-all cursor-pointer hover:shadow-md hover:border-indigo-300 active:scale-95 flex flex-col items-center min-h-[140px]"
    >
      <div className="flex flex-col items-center gap-1 w-full">
        <span className="text-[10px] font-bold text-indigo-400 leading-none">{student.seat}</span>
        <div className="w-12 h-12 bg-indigo-50 rounded-full overflow-hidden border border-indigo-100 mb-1">
          <img src={student.avatar} alt={student.name} className="w-full h-full object-contain p-1" />
        </div>
        <span className="text-sm font-black text-gray-700 truncate w-full text-center px-1 mb-2">{student.name}</span>
        
        <div className="flex flex-wrap justify-center gap-1 w-full min-h-[32px]">
          {heldRewardKeys.length > 0 ? (
            heldRewardKeys.map(key => {
              const def = getRewardDefinition(key);
              const count = student.inventory[key];
              return (
                <div 
                  key={key} 
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full shadow-sm border border-white/50 ${def.bgClass}`}
                >
                  <span className="text-[10px] leading-tight">{def.icon.split(' ')[0]}</span>
                  <span className="text-[10px] font-bold">{count}</span>
                </div>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-[9px] text-gray-300 font-medium">尚無獎勵</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
