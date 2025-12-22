
import React, { useState, useEffect, useCallback } from 'react';
import { SeriesType, CardData, Prize } from './types';
import { PRIZE_POOL } from './constants';
import { audioService } from './services/audioService';
import Card from './components/Card';
import SeatSelector from './components/SeatSelector';
import ResultModal from './components/ResultModal';
import { RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());
  const [currentResult, setCurrentResult] = useState<CardData | null>(null);
  const [shakeSeatSelector, setShakeSeatSelector] = useState(false);

  const initGame = useCallback(() => {
    const shuffledPrizes = [...PRIZE_POOL].sort(() => Math.random() - 0.5);
    const seriesList = [SeriesType.POKEMON, SeriesType.CHIIKAWA, SeriesType.SANRIO, SeriesType.CAPYBARA];
    
    const newCards: CardData[] = shuffledPrizes.map((prize, index) => ({
      id: index,
      prize,
      series: seriesList[index % seriesList.length],
      isFlipped: false,
    })).sort(() => Math.random() - 0.5);

    setCards(newCards);
    setFlippedIds(new Set());
    setSelectedSeat(null);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleFlip = (id: number) => {
    if (flippedIds.has(id)) return;

    if (selectedSeat === null) {
      setShakeSeatSelector(true);
      setTimeout(() => setShakeSeatSelector(false), 500);
      return;
    }

    audioService.playFlip();
    const card = cards.find(c => c.id === id);
    if (!card) return;

    setFlippedIds(prev => new Set(prev).add(id));
    setCurrentResult(card);
  };

  const closeResult = () => {
    setCurrentResult(null);
    setSelectedSeat(null); // Deselect seat after a card is drawn and closed
  };

  return (
    <div className="h-screen flex flex-col bg-indigo-50 select-none overflow-hidden">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between bg-white border-b border-indigo-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
             <RefreshCw className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-black text-indigo-900 tracking-tight">互動式抽卡系統</h1>
        </div>
        <button 
          onClick={initGame}
          className="px-3 py-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-1"
        >
          重新洗牌
        </button>
      </header>

      {/* Main Content (Grid) */}
      <main className="flex-1 p-3 overflow-hidden flex items-center justify-center">
        <div className="grid grid-cols-6 grid-rows-5 gap-2 w-full h-full max-w-6xl max-h-[80vh]">
          {cards.map((card) => (
            <Card 
              key={card.id}
              card={card}
              isFlipped={flippedIds.has(card.id)}
              onFlip={handleFlip}
            />
          ))}
        </div>
      </main>

      {/* Footer (Seat Selection) */}
      <SeatSelector 
        selectedSeat={selectedSeat}
        onSelect={setSelectedSeat}
        shake={shakeSeatSelector}
      />

      {/* Modal */}
      <ResultModal 
        seat={selectedSeat}
        card={currentResult}
        onClose={closeResult}
      />
    </div>
  );
};

export default App;
