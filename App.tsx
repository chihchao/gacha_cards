
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SeriesType, CardData, Student, Prize } from './types';
import { INITIAL_STUDENTS } from './constants';
import { audioService } from './services/audioService';
import { sheetsService } from './services/googleSheetsService';
import Card from './components/Card';
import StudentCard from './components/StudentCard';
import SeatSelector from './components/SeatSelector';
import StudentDetailModal from './components/StudentDetailModal';
import ResultModal from './components/ResultModal';
import { LayoutDashboard, Ticket, RotateCcw, FileSpreadsheet, RefreshCw, AlertCircle, Settings, Save, X, HardDrive, UserPlus, SlidersHorizontal, Database } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'gacha'>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  
  const [activeStudentId, setActiveStudentId] = useState<string | number | null>(null);
  
  const [syncStatus, setSyncStatus] = useState<'loading' | 'synced' | 'error' | 'local'>('loading');
  const [gasUrl, setGasUrl] = useState<string>(localStorage.getItem('gas_url') || '');
  
  const [showSyncSettings, setShowSyncSettings] = useState(false);
  const [showGachaSettings, setShowGachaSettings] = useState(false);
  
  const [tempUrl, setTempUrl] = useState(gasUrl);
  
  const [rewardCounts, setRewardCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('gacha_reward_counts');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());
  const [currentResult, setCurrentResult] = useState<CardData | null>(null);
  const [resultStudent, setResultStudent] = useState<Student | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [shakeSelector, setShakeSelector] = useState(false);

  const activeStudent = useMemo(() => 
    students.find(s => s.id === activeStudentId) || null, 
    [students, activeStudentId]
  );

  const rewardTypes = useMemo(() => {
    if (students.length === 0) return [];
    return Object.keys(students[0].inventory);
  }, [students]);

  useEffect(() => {
    if (rewardTypes.length > 0) {
      setRewardCounts(prev => {
        const next = { ...prev };
        let hasChange = false;
        rewardTypes.forEach(type => {
          if (next[type] === undefined) {
            next[type] = 2; 
            hasChange = true;
          }
        });
        if (hasChange) {
          localStorage.setItem('gacha_reward_counts', JSON.stringify(next));
          return next;
        }
        return prev;
      });
    }
  }, [rewardTypes]);

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setSyncStatus('loading');
    
    if (!sheetsService.isValidUrl(gasUrl)) {
      const localData = localStorage.getItem('local_students');
      if (localData) setStudents(JSON.parse(localData));
      else setStudents(INITIAL_STUDENTS);
      setSyncStatus('local');
      return;
    }

    try {
      const data = await sheetsService.fetchStudents(gasUrl);
      if (data && data.length > 0) {
        setStudents(data);
        localStorage.setItem('local_students', JSON.stringify(data));
        setSyncStatus('synced');
      } else throw new Error('No data');
    } catch (err) {
      console.error(err);
      const lastLocal = localStorage.getItem('local_students');
      if (lastLocal) setStudents(JSON.parse(lastLocal));
      setSyncStatus('error');
    }
  }, [gasUrl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const initGacha = useCallback(() => {
    if (rewardTypes.length === 0) {
      setCards([]);
      return;
    }

    const pool: Prize[] = [];
    rewardTypes.forEach((type, index) => {
      const count = rewardCounts[type] ?? 2;
      for (let i = 0; i < count; i++) {
        pool.push({ id: `prize-${type}-${index}-${i}`, name: type, category: 'dynamic' });
      }
    });

    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const seriesList = [SeriesType.POKEMON, SeriesType.CHIIKAWA, SeriesType.SANRIO, SeriesType.CAPYBARA];
    const finalPool = shuffledPool.slice(0, 30);
    
    // 每次初始化都隨機分配圖案索引 (0-29)
    const newCards: CardData[] = finalPool.map((prize, index) => ({
      id: index,
      prize,
      series: seriesList[index % seriesList.length],
      isFlipped: false,
      spriteIndex: Math.floor(Math.random() * 30) 
    }));

    setCards(newCards);
    setFlippedIds(new Set());
  }, [rewardTypes, rewardCounts]);

  useEffect(() => {
    if (view === 'gacha' && cards.length === 0) initGacha();
  }, [view, cards.length, initGacha]);

  const handleUpdateReward = useCallback(async (studentId: string | number, type: string, delta: number) => {
    setStudents(prevStudents => {
      const updatedStudents = prevStudents.map(s => {
        if (s.id === studentId) {
          return { 
            ...s, 
            inventory: { ...s.inventory, [type]: Math.max(0, (s.inventory[type] || 0) + delta) } 
          };
        }
        return s;
      });

      localStorage.setItem('local_students', JSON.stringify(updatedStudents));
      
      if (sheetsService.isValidUrl(gasUrl)) {
        setSyncStatus('loading');
        sheetsService.saveStudents(gasUrl, updatedStudents)
          .then(success => setSyncStatus(success ? 'synced' : 'error'))
          .catch(() => setSyncStatus('error'));
      }

      return updatedStudents;
    });
  }, [gasUrl]);

  const handleFlipCard = (id: number) => {
    if (flippedIds.has(id)) return;
    if (selectedSeat === null) {
      setShakeSelector(true);
      setTimeout(() => setShakeSelector(false), 500);
      audioService.playSelect();
      return;
    }
    
    audioService.playFlip();
    const card = cards.find(c => c.id === id);
    if (!card) return;

    const targetStudent = students.find(s => s.seat === selectedSeat);
    if (targetStudent) {
      setResultStudent(targetStudent);
      handleUpdateReward(targetStudent.id, card.prize.name, 1);
    }
    
    setFlippedIds(prev => new Set(prev).add(id));
    setCurrentResult(card);
    setSelectedSeat(null);
  };

  const updateRewardCountSetting = (type: string, val: string) => {
    const num = parseInt(val) || 0;
    const next = { ...rewardCounts, [type]: num };
    setRewardCounts(next);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F9FC] select-none overflow-hidden font-sans">
      <div className="fixed inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#4F46E5_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <header className="px-6 py-4 flex items-center justify-between bg-white border-b-2 border-indigo-50 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2 rounded-2xl shadow-lg shadow-indigo-200 cursor-pointer" onClick={() => setView('dashboard')}>
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">學生獎勵管理</h1>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                syncStatus === 'synced' ? 'bg-green-50 text-green-600 border-green-200' :
                syncStatus === 'loading' ? 'bg-yellow-50 text-yellow-600 border-yellow-200 animate-pulse' :
                syncStatus === 'local' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                'bg-red-50 text-red-600 border-red-200'
              }`}>
                {syncStatus === 'synced' ? <><FileSpreadsheet size={12} /> Online</> :
                 syncStatus === 'loading' ? <><RefreshCw size={12} className="animate-spin" /> Syncing...</> :
                 syncStatus === 'local' ? <><HardDrive size={12} /> Local</> :
                 <><AlertCircle size={12} /> Error</>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {view === 'gacha' && (
            <button 
              onClick={() => { if(confirm('確定要重置卡池嗎？')) initGacha(); }}
              className="p-2.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
              title="重置卡池"
            >
              <RotateCcw size={20} />
            </button>
          )}
          
          <button 
            disabled={students.length === 0}
            onClick={() => { setView(view === 'dashboard' ? 'gacha' : 'dashboard'); setSelectedSeat(null); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              view === 'dashboard' 
                ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white hover:shadow-indigo-200 shadow-indigo-100 hover:-translate-y-0.5' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {view === 'dashboard' ? <><Ticket size={18} /> 抽卡樂園</> : <><LayoutDashboard size={18} /> 學生列表</>}
          </button>

          <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>

          <button onClick={() => setShowGachaSettings(true)} className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all" title="卡池設定">
            <SlidersHorizontal size={20} />
          </button>
          
          <button onClick={() => setShowSyncSettings(true)} className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all" title="同步設定">
            <Database size={20} />
          </button>

          <button onClick={() => loadData()} className="p-2.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all" title="重新整理">
            <RefreshCw size={20} className={syncStatus === 'loading' ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 z-10 custom-scrollbar">
        {syncStatus === 'loading' && students.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-indigo-300">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="font-bold tracking-widest">資料同步中...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
            <div className="bg-white p-8 rounded-[40px] shadow-xl border-4 border-dashed border-indigo-100 flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mb-6">
                <UserPlus size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-700 mb-2">尚未串接雲端資料</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                請點擊右上角的資料庫圖示，貼上您的 Google Apps Script 網址以同步資料。
              </p>
              <button 
                onClick={() => setShowSyncSettings(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                串接 Google Sheets
              </button>
            </div>
          </div>
        ) : view === 'dashboard' ? (
          <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-4 max-w-[1600px] mx-auto pb-8">
            {students.map(student => (
              <StudentCard 
                key={student.id} 
                student={student} 
                onClick={() => setActiveStudentId(student.id)} 
                onReceiveReward={() => {}} 
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-between gap-4">
            <div className="grid grid-cols-6 grid-rows-5 gap-3 w-full max-w-6xl flex-1 max-h-[72vh]">
              {cards.map(card => (
                <Card key={card.id} card={card} isFlipped={flippedIds.has(card.id)} onFlip={handleFlipCard} />
              ))}
            </div>
            <SeatSelector selectedSeat={selectedSeat} onSelect={setSelectedSeat} shake={shakeSelector} students={students} />
          </div>
        )}
      </main>

      {/* 雲端同步設定彈窗 */}
      {showSyncSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-indigo-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-6 text-white flex items-center justify-between">
              <h2 className="text-xl font-black flex items-center gap-2"><Database size={20} /> 雲端同步設定</h2>
              <button onClick={() => setShowSyncSettings(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileSpreadsheet size={14} /> Google Apps Script Web App URL
                </label>
                <input 
                  type="text" 
                  value={tempUrl} 
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/..."
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <button 
                onClick={() => { 
                  localStorage.setItem('gas_url', tempUrl); 
                  setGasUrl(tempUrl); 
                  setShowSyncSettings(false); 
                  loadData(); 
                }} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 active:scale-95"
              >
                <Save size={20} /> 儲存同步設定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 抽卡卡池設定彈窗 */}
      {showGachaSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-rose-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-rose-500 p-6 text-white flex items-center justify-between">
              <h2 className="text-xl font-black flex items-center gap-2"><SlidersHorizontal size={20} /> 抽卡卡池設定</h2>
              <button onClick={() => setShowGachaSettings(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-100 text-xs font-bold text-rose-600 leading-relaxed">
                提示：卡池上限為 30 張卡片。請設定各獎勵卡在卡池中出現的數量。
              </div>
              <div className="grid grid-cols-2 gap-4">
                {rewardTypes.map(type => (
                  <div key={type} className="flex items-center justify-between bg-white p-3 rounded-xl border border-rose-100 shadow-sm">
                    <span className="text-sm font-bold text-gray-600 truncate mr-2">{type}</span>
                    <div className="flex items-center gap-2">
                       <input 
                        type="number" 
                        min="0"
                        max="30"
                        value={rewardCounts[type] || 0}
                        onChange={(e) => updateRewardCountSetting(type, e.target.value)}
                        className="w-16 bg-rose-50 border-none rounded-lg px-2 py-1 text-center font-bold text-rose-600 focus:ring-2 focus:ring-rose-400 outline-none"
                       />
                       <span className="text-[10px] text-gray-400">張</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-2 py-4 border-t border-gray-100">
                <span className="text-xs font-black text-gray-400 uppercase">目前卡池總計</span>
                <span className={`text-xl font-black ${Object.values(rewardCounts).reduce((a,b)=>a+b, 0) > 30 ? 'text-red-500' : 'text-rose-600'}`}>
                  {Object.values(rewardCounts).reduce((a,b)=>a+b, 0)} / 30
                </span>
              </div>
              <button 
                onClick={() => { 
                  localStorage.setItem('gacha_reward_counts', JSON.stringify(rewardCounts));
                  setShowGachaSettings(false); 
                  initGacha(); // 儲存後立即重新初始化卡池內容
                }} 
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-rose-100 active:scale-95"
              >
                <Save size={20} /> 儲存卡池配置
              </button>
            </div>
          </div>
        </div>
      )}

      {activeStudent && (
        <StudentDetailModal 
          student={activeStudent}
          onClose={() => setActiveStudentId(null)}
          onUpdate={(type, delta) => handleUpdateReward(activeStudent.id, type, delta)}
        />
      )}
      
      {currentResult && resultStudent && (
        <ResultModal 
          student={resultStudent} 
          card={currentResult} 
          onClose={() => { setCurrentResult(null); setResultStudent(null); }}
        />
      )}
    </div>
  );
};

export default App;
