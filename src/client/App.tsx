import { useState, useEffect } from 'react';
import { useCounter } from './hooks/useCounter';
import { mysteries } from '../shared/mysteries';

type Page =
  | { view: 'menu' }
  | { view: 'city'; mystery: string }
  | { view: 'room'; mystery: string; location: number };

export const App = () => {
  // ---------- STATE ----------
  const [page, setPage] = useState<Page>({ view: 'menu' });
  const [selectedClue, setSelectedClue] = useState<string | null>(null);
  const { xp, username, loading, fragment } = useCounter();
  console.log("fragment: ", fragment)
  console.log("xp: ", xp)

  const [locationProgress, setLocationProgress] = useState<
    Record<number, { fragment: boolean; location: boolean }>
  >({});

  // ROOM STATE
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [fragmentInput, setFragmentInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [fragmentStatus, setFragmentStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [locationStatus, setLocationStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [fragmentSolved, setFragmentSolved] = useState(false);
  const [locationSolved, setLocationSolved] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [fragmentMessage, setFragmentMessage] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Fetch progress when page.mystery exists
  useEffect(() => {
    if (page.view !== 'city' && page.view !== 'room') return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress?mysteryId=${page.mystery}`);
        const data = await res.json();
        setLocationProgress(data);
      } catch (e) {
        console.error('Failed to fetch progress', e);
      }
    };

    void fetchProgress();
  }, [page]);

  // Sync fragmentSolved / locationSolved when entering a room
  useEffect(() => {
    if (page.view !== 'room') return;

    const progress = locationProgress[page.location] || { fragment: false, location: false };
    setFragmentSolved(progress.fragment);
    setLocationSolved(progress.location);
  }, [page, locationProgress]);


  // ---------- RENDER ----------
  // ---------------- MENU PAGE ----------------
  if (page.view === 'menu') {
    const allMysteries = Object.entries(mysteries);

    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center justify-center gap-8 p-6">
        {/* XP Header */}
        <div className="absolute top-4 right-4 flex items-center gap-3 bg-[#1a1a1b] px-4 py-2 rounded-full border border-[#272729] shadow-lg">
          <span className="text-[#ff4500] font-bold">⭐ {loading ? '...' : xp}</span>
          <span className="text-gray-300 text-sm">XP</span>
        </div>

        <h1 className="text-4xl font-bold text-[#ff4500]">Thread of Clues</h1>
        <p className="text-gray-300 max-w-md text-center">
          {username ? `Welcome, Officer ${username}.` : 'Welcome, Officer.'}
          Choose your next case to investigate.
        </p>

        {/* Mystery selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          {allMysteries.map(([id, m]) => (
            <button
              key={id}
              onClick={() => setPage({ view: 'city', mystery: id })}
              className="bg-[#1a1a1b] rounded-xl p-6 text-left hover:bg-[#242526] shadow-lg transition border border-[#272729]"
            >
              <h2 className="text-2xl text-[#ff4500] font-semibold mb-1">{m.title}</h2>
              <p className="text-gray-300">{m.desc}</p>
            </button>
          ))}
        </div>

        <footer className="text-gray-500 text-sm mt-8">
          r/Devvit Game • Made for Reddit Hackathon
        </footer>
      </div>
    );
  }

  // ---------------- CITY PAGE ----------------
  if (page.view === 'city') {
    const mystery = mysteries[page.mystery];

    const pinPositions = ['20%', '50%', '70%', '35%', '80%'].map((top, i) => ({
      top,
      left: `${20 + i * 15}%`,
    }));

    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center p-6">
        <button
          onClick={() => setPage({ view: 'menu' })}
          className="mb-4 text-gray-300 hover:text-[#ff4500]"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-[#ff4500] mb-2">{mystery.title}</h1>
        <p className="text-gray-400 mb-6 text-center max-w-md">{mystery.desc}</p>

        <div className="relative w-full max-w-3xl aspect-[16/9] bg-[#1a1a1b] rounded-2xl shadow-lg overflow-hidden border border-[#272729]">
          {mystery.locations.map((loc, i) => {
            const progress = locationProgress[i] || { fragment: false, location: false };
            let bgColor = '#ff0000'; // red = untouched
            if (progress.fragment && !progress.location) bgColor = 'orange';
            if (progress.fragment && progress.location) bgColor = 'green';

            return (
              <button
                key={i}
                onClick={() => setPage({ view: 'room', mystery: page.mystery, location: i })}
                style={{ top: pinPositions[i].top, left: pinPositions[i].left, backgroundColor: bgColor }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-white text-xl px-5 py-4 rounded-full shadow-md hover:scale-125 transition-all duration-300"
              >
                {loc.emoji}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------------- ROOM PAGE ----------------
  if (page.view === 'room') {
    const mystery = mysteries[page.mystery];
    const location = mystery.locations[page.location];

    // Toggle object selection for fragment submission
    const toggleObject = (id: string) => {
      if (fragmentSolved) return; // don't allow changing after solved
      setSelectedObjects((prev) => {
        if (prev.includes(id)) return prev.filter((o) => o !== id);
        if (prev.length >= 3) return prev;
        return [...prev, id];
      });
    };

    // Submit fragment
    const submitFragment = async () => {
      if (cooldown > 0) return;
      if (selectedObjects.length !== 3) {
        setFragmentStatus('error');
        setFragmentMessage('❌ Select exactly 3 objects first.');
        console.log("Selected objects: ", selectedObjects)
        return;
      }
      setFragmentStatus('loading');
      setCooldown(60);

      console.log("Selected objects: ", selectedObjects)

      try {
        const res = await fetch('/api/fragment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mysteryId: page.mystery,
            location: location.name,
            selectedObjects,
            answer: fragmentInput,
          }),
        });

        const data = await res.json();
        console.log(data);

        if (data.correct) {
          setFragmentStatus('success');
          setFragmentSolved(true);
          setFragmentMessage(
            `✅ Fragment cracked! +${data.xpGained} XP${data.first ? ' (First to solve!)' : ''}`
          );
        } else {
          setFragmentStatus('error');
          setFragmentMessage('❌ Incorrect fragment or objects, try again.');
        }
      } catch (e) {
        setFragmentStatus('error');
        setFragmentMessage('❌ Error checking fragment. Try again.');
      }
    };

    // Submit location
    const submitLocation = async () => {
      if (cooldown > 0) return;
      setLocationStatus('loading');
      setCooldown(60);

      try {
        const res = await fetch('/api/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mysteryId: page.mystery,
            location: location.name,
            answer: locationInput,
          }),
        });

        const data = await res.json();
        if (data.correct) {
          setLocationStatus('success');
          setLocationSolved(true);
        } else {
          setLocationStatus('error');
        }
      } catch (e) {
        setLocationStatus('error');
      }
    };

    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center p-6">
        {/* Back button */}
        <button
          onClick={() => setPage({ view: 'city', mystery: page.mystery })}
          className="mb-4 text-gray-300 hover:text-[#ff4500]"
        >
          ← Back to city
        </button>

        <h1 className="text-2xl font-bold text-[#ff4500]">{location.name}</h1>
        <p className="text-gray-400 mb-4">
          Select 3 objects that connect — then enter your fragment code.
        </p>

        {/* OBJECT GRID */}
        <div className="relative w-full max-w-4xl aspect-[16/9] bg-gradient-to-b from-[#242526] to-[#1a1a1b] rounded-2xl shadow-lg border border-[#272729]">
          {location.objects.map((obj, i) => {
            const selected = selectedObjects.includes(obj.id);
            return (
              <button
                key={obj.id}
                style={{
                  top: `${10 + (i % 5) * 15}%`,
                  left: `${15 + Math.floor(i / 5) * 35}%`,
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl transition-all duration-300 ${
                  selected ? 'scale-125 drop-shadow-[0_0_15px_#ff4500]' : 'hover:scale-110'
                }`}
                onClick={() => {
                  setSelectedClue(`${obj.name}: ${obj.messages[fragment]}`); // show clue
                  toggleObject(obj.id); // also toggle selection
                }}
              >
                {obj.emoji}
              </button>
            );
          })}
        </div>

        {/* CLUE MODAL */}
        {selectedClue && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-[#1a1a1b] p-6 rounded-xl max-w-md text-center border border-[#272729]">
              <p className="italic mb-4">{selectedClue}</p>
              <button
                onClick={() => setSelectedClue(null)}
                className="bg-[#ff4500] px-4 py-2 rounded-full hover:bg-[#d93900]"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* INPUTS */}
        <div className="mt-6 flex flex-col gap-4 items-center w-full max-w-md">
          {/* Fragment input */}
          {!fragmentSolved && (
            <div className="w-full">
              <input
                type="text"
                value={fragmentInput}
                onChange={(e) => setFragmentInput(e.target.value.toUpperCase())}
                placeholder="Enter fragment code"
                disabled={
                  selectedObjects.length !== 3 || cooldown > 0 || fragmentStatus === 'loading'
                }
                className="w-full bg-[#1a1a1b] border border-[#272729] px-4 py-2 rounded-lg text-white placeholder-gray-500"
              />
              <button
                onClick={submitFragment}
                disabled={
                  selectedObjects.length !== 3 || cooldown > 0 || fragmentStatus === 'loading'
                }
                className="mt-2 w-full bg-[#ff4500] hover:bg-[#d93a00] text-white py-2 rounded-lg transition"
              >
                {fragmentStatus === 'loading'
                  ? 'Checking...'
                  : cooldown > 0
                    ? `Try again in ${cooldown}s`
                    : 'Submit Fragment'}
              </button>
              {fragmentMessage && (
                <div
                  className={`mt-2 text-center font-semibold ${
                    fragmentStatus === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {fragmentMessage}
                </div>
              )}
            </div>
          )}

          {/* Location input */}
          {fragmentSolved && !locationSolved && (
            <div className="w-full">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value.toUpperCase())}
                placeholder="Enter location code"
                disabled={cooldown > 0 || locationStatus === 'loading'}
                className="w-full bg-[#1a1a1b] border border-[#272729] px-4 py-2 rounded-lg text-white placeholder-gray-500"
              />
              <button
                onClick={submitLocation}
                disabled={cooldown > 0 || locationStatus === 'loading'}
                className="mt-2 w-full bg-[#ff4500] hover:bg-[#d93a00] text-white py-2 rounded-lg transition"
              >
                {locationStatus === 'loading'
                  ? 'Checking...'
                  : cooldown > 0
                    ? `Try again in ${cooldown}s`
                    : 'Submit Location'}
              </button>
            </div>
          )}

          {/* Success messages */}
          {fragmentSolved && locationSolved && (
            <div className="text-center mt-4">
              <p className="text-green-400 font-semibold">🧩 Fragment cracked: {fragmentInput}</p>
              <p className="text-blue-400 font-semibold">🏙️ Location solved: {locationInput}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
