import { useState } from 'react';
import { useCounter } from './hooks/useCounter';

type Page =
  | { view: 'menu' }
  | { view: 'city'; mystery: string }
  | { view: 'room'; mystery: string; location: number };

export const App = () => {
  const [page, setPage] = useState<Page>({ view: 'menu' });
  const [selectedClue, setSelectedClue] = useState<string | null>(null);
  const { xp, username, loading, increment, decrement } = useCounter();

  const MYSTERIES = [
    {
      id: 'london',
      title: '🕵️ London Theft',
      desc: 'Solve the daring museum robbery that shocked the city.',
      locations: ['Museum', 'Bank', 'Underground', 'Docks', 'Mansion'],
      pins: ['🏛️', '🏦', '🚇', '⚓', '🏠'],
      objects: ['🎨', '🖥️', '🪑', '☕', '📦', '🔑', '💡', '🛗', '🖼️', '🪴'],
    },
    {
      id: 'vienna',
      title: '🎭 Vienna Heist',
      desc: 'Unravel the elegant criminal ring behind the royal jewel theft.',
      locations: ['Opera House', 'Café', 'Palace', 'Park', 'Train Station'],
      pins: ['🏛️','☕','🏰','🌳','🚉'],
      objects: ['🎨','🖥️','🪑','☕','📦','🔑','💡','🛗','🖼️','🪴'],
    },
  ];

  // ---------------- MENU PAGE ----------------
  if (page.view === 'menu') {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center justify-center gap-8 p-6">
        {/* Header with XP */}
        <div className="absolute top-4 right-4 flex items-center gap-3 bg-[#1a1a1b] px-4 py-2 rounded-full border border-[#272729] shadow-lg">
          <span className="text-[#ff4500] font-bold">⭐ {loading ? '...' : xp}</span>
          <span className="text-gray-300 text-sm">XP</span>
        </div>

        <h1 className="text-4xl font-bold text-[#ff4500]">Thread of Clues</h1>
        <p className="text-gray-300 max-w-md text-center">
          {username ? `Welcome, Officer ${username}.` : 'Welcome, Officer.'}
          Choose your next case to investigate.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          {MYSTERIES.map((m) => (
            <button
              key={m.id}
              onClick={() => setPage({ view: 'city', mystery: m.id })}
              className="bg-[#1a1a1b] rounded-xl p-6 text-left hover:bg-[#242526] shadow-lg transition border border-[#272729]"
            >
              <h2 className="text-2xl text-[#ff4500] font-semibold mb-1">{m.title}</h2>
              <p className="text-gray-300">{m.desc}</p>
            </button>
          ))}
        </div>

        <footer className="text-gray-500 text-sm mt-8">r/Devvit Game • Made for Reddit Hackathon</footer>
      </div>
    );
  }

  // ---------------- CITY PAGE ----------------
  if (page.view === 'city') {
    const mystery = MYSTERIES.find((m) => m.id === page.mystery)!;
    const pinPositions = ['20%','50%','70%','35%','80%'].map((top,i)=>({top, left:`${20+i*15}%`}));

    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center p-6">
        <button onClick={() => setPage({view:'menu'})} className="mb-4 text-gray-300 hover:text-[#ff4500]">← Back</button>
        <h1 className="text-3xl font-bold text-[#ff4500] mb-2">{mystery.title}</h1>
        <p className="text-gray-400 mb-6 text-center max-w-md">{mystery.desc}</p>

        <div className="relative w-full max-w-3xl aspect-[16/9] bg-[#1a1a1b] rounded-2xl shadow-lg overflow-hidden border border-[#272729]">
          {mystery.locations.map((loc,i)=>(
            <button
              key={i}
              onClick={()=>setPage({view:'room', mystery: mystery.id, location:i})}
              style={{top:pinPositions[i].top, left:pinPositions[i].left}}
              className="
                absolute transform -translate-x-1/2 -translate-y-1/2
                bg-[#ff4500] text-white
                text-xl
                px-5 py-4 rounded-full
                shadow-md hover:scale-125 hover:shadow-[0_0_20px_rgba(255,69,0,0.7)]
                transition-all duration-300
              "
            >
              {mystery.pins[i]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------------- ROOM PAGE ----------------
  if (page.view === 'room') {
    const mystery = MYSTERIES.find((m)=>m.id===page.mystery)!;
    const locationName = mystery.locations[page.location];

    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center p-6 relative">
        <button onClick={()=>setPage({view:'city', mystery:mystery.id})} className="mb-4 text-gray-300 hover:text-[#ff4500]">← Back to city</button>
        <h1 className="text-2xl font-bold text-[#ff4500]">{locationName}</h1>
        <p className="text-gray-400 mb-4">Investigate by clicking the objects.</p>

        <div className="relative w-full max-w-4xl aspect-[16/9] bg-gradient-to-b from-[#242526] to-[#1a1a1b] rounded-2xl shadow-lg border border-[#272729]">
          {mystery.objects.map((obj,i)=>(
            <button
              key={i}
              style={{top:`${10+i*7}%`, left:`${10+i*8}%`}}
              className="
                absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl
                hover:scale-125 hover:shadow-[0_0_15px_rgba(255,87,34,0.7)]
                transition-all duration-300
              "
              onClick={()=>setSelectedClue(`You found a clue at ${obj} in ${locationName}!`)}
            >
              {obj}
            </button>
          ))}
        </div>

        {selectedClue && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-[#1a1a1b] p-6 rounded-xl max-w-md text-center border border-[#272729]">
              <p className="italic mb-4">{selectedClue}</p>
              <button onClick={()=>setSelectedClue(null)} className="bg-[#ff4500] px-4 py-2 rounded-full hover:bg-[#d93900]">Close</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
