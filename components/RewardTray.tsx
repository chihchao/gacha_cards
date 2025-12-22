
import React from 'react';
import { RewardType } from '../types';
// Fix: Corrected import to use REWARD_STYLES and getRewardDefinition instead of non-existent REWARD_DEFINITIONS
import { REWARD_STYLES, getRewardDefinition } from '../constants';

const RewardTray: React.FC = () => {
  const handleDragStart = (e: React.DragEvent, type: RewardType) => {
    e.dataTransfer.setData('rewardType', type);
    // 增加拖曳視覺效果 (透明度)
    const dragImg = new Image();
    dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; 
    e.dataTransfer.setDragImage(dragImg, 0, 0);
  };

  // 根據 PRD，展示 15 個圖示以便點擊，這裡使用 REWARD_STYLES 的鍵值作為獎勵類型來源
  const trayItems = [...Object.keys(REWARD_STYLES), ...Object.keys(REWARD_STYLES), ...Object.keys(REWARD_STYLES)];

  return (
    <div className="bg-white/90 backdrop-blur-md border-t-4 border-indigo-200 p-4 pb-8 flex flex-col items-center shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-black text-indigo-600 tracking-wider">拖曳獎勵卡發放 ✨</span>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar w-full justify-center px-4">
        {trayItems.map((type, idx) => {
          // 使用 getRewardDefinition 獲取視覺樣式與圖標
          const def = getRewardDefinition(type);
          return (
            <div
              key={`${type}-${idx}`}
              draggable
              onDragStart={(e) => handleDragStart(e, type as RewardType)}
              className={`w-14 h-20 shrink-0 rounded-xl shadow-lg flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transform transition-transform hover:scale-110 border-2 border-white ${def.bgClass}`}
              style={{ backgroundColor: def.color }}
            >
              <div className="bg-white/20 w-full h-full rounded-lg flex flex-col items-center justify-center p-1 text-white">
                <span className="text-xl mb-1">{def.icon.split(' ')[0]}</span>
                <span className="text-[10px] font-black uppercase">{def.name.replace('卡', '')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardTray;
