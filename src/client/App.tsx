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

  // XP + fragment group from init
  const { username: counterUsername, loading: counterLoading, fragment: userFragment } = useCounter();
  const [username, setUsername] = useState<string>(counterUsername || 'anonymous');
  const [xp, setXp] = useState<number>(0);
  const [locationProgress, setLocationProgress] = useState<{
    [mysteryId: string]: {
      locations: { [locationName: string]: { fragment: boolean; location: boolean } };
      main?: { done: boolean; first?: boolean };
    };
  }>({});


  // ROOM STATE
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [fragmentInput, setFragmentInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [fragmentStatus, setFragmentStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [fragmentSolved, setFragmentSolved] = useState(false);
  const [locationSolved, setLocationSolved] = useState(false);
  const [solvedFragmentCode, setSolvedFragmentCode] = useState<string | null>(null);
  const [solvedLocationCode, setSolvedLocationCode] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [mainInput, setMainInput] = useState('');
  const [mainStatus, setMainStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [mainMessage, setMainMessage] = useState<string|null>(null);
  const [mainCooldown, setMainCooldown] = useState(0);


  // ---------- EFFECTS ----------
  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (mainCooldown <= 0) return;
    const timer = setInterval(() => setMainCooldown(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [mainCooldown]);


  // Fetch init data once on app load
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const res = await fetch('/api/init');
        const data = await res.json();
        setUsername(data.username);
        setXp(data.xp ?? 0);

        // Fetch all progress for all mysteries
        const progressRes = await fetch('/api/progressAll');
        const progressData = await progressRes.json();
        // Expected format: { [mysteryId: string]: { [locationIndex: number]: { fragment: boolean, location: boolean } } }
        setLocationProgress(progressData);
      } catch (e) {
        console.error('Failed to init app', e);
      }
    };
    void fetchInit();
  }, []);

  // // Fetch progress for current mystery when entering city or room
  // useEffect(() => {
  //   if (page.view !== 'city' && page.view !== 'room') return;
  //
  //   const fetchProgress = async () => {
  //     try {
  //       const res = await fetch(`/api/progress?mysteryId=${page.mystery}`);
  //       const data = await res.json();
  //       setLocationProgress(data);
  //     } catch (e) {
  //       console.error('Failed to fetch progress', e);
  //     }
  //   };
  //   void fetchProgress();
  // }, [page]);

  // Sync solved state when entering room
  useEffect(() => {
    if (page.view !== 'room') return;

    const mystery = mysteries[page.mystery];
    if (!mystery) return;

    const locationName = mystery.locations[page.location].name;
    const progress = locationProgress[page.mystery]?.locations?.[locationName] || { fragment: false, location: false };

    setFragmentSolved(progress.fragment);
    setLocationSolved(progress.location);

    if (progress.fragment) {
      setSolvedFragmentCode(mystery.locations[page.location].fragment_codes[userFragment]);
    } else {
      setSolvedFragmentCode(null);
    }

    if (progress.location) {
      setSolvedLocationCode(mystery.locations[page.location].location_code);
    } else {
      setSolvedLocationCode(null);
    }

    // Reset room-specific states
    setRoomError(null);
    setFragmentInput('');
    setLocationInput('');
    setSelectedObjects([]);
    setFragmentStatus('idle');
    setLocationStatus('idle');
  }, [page, locationProgress, userFragment]);

  // ---------- HELPER FUNCTIONS ----------
  const toggleObject = (id: string) => {
    if (fragmentSolved) return;
    setSelectedObjects((prev) => {
      if (prev.includes(id)) return prev.filter((o) => o !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const submitFragment = async () => {
    if (cooldown > 0 || selectedObjects.length !== 3) return;
    setFragmentStatus('loading');
    setCooldown(60);

    try {
      const mystery = mysteries[page.mystery];
      const locationName = mystery.locations[page.location].name;

      const res = await fetch('/api/fragment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mysteryId: page.mystery,
          location: locationName,
          selectedObjects,
          answer: fragmentInput,
        }),
      });

      const data = await res.json();

      if (data.correct) {
        setFragmentStatus('success');
        setFragmentSolved(true);
        setSolvedFragmentCode(fragmentInput.toUpperCase());
        setXp((prev) => prev + (data.xpGained ?? 0));

        setLocationProgress((prev) => ({
          ...prev,
          [page.mystery]: {
            ...(prev[page.mystery] || { locations: {} }),
            locations: {
              ...(prev[page.mystery]?.locations || {}),
              [locationName]: {
                fragment: true,
                location: prev[page.mystery]?.locations?.[locationName]?.location || false,
              },
            },
          },
        }));

        setRoomError(null);
      } else {
        setFragmentStatus('error');
        setRoomError('❌ Incorrect fragment or objects, try again.');
      }
    } catch (e) {
      setFragmentStatus('error');
      setRoomError('❌ Error checking fragment.');
    }
  };

  const submitLocation = async () => {
    if (cooldown > 0) return;
    setLocationStatus('loading');
    setCooldown(60);

    try {
      const mystery = mysteries[page.mystery];
      const locationName = mystery.locations[page.location].name;

      const res = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mysteryId: page.mystery,
          location: locationName,
          answer: locationInput,
        }),
      });

      const data = await res.json();

      if (data.correct) {
        setLocationStatus('success');
        setLocationSolved(true);
        setSolvedLocationCode(locationInput.toUpperCase());
        setXp((prev) => prev + (data.xpGained ?? 0));

        setLocationProgress((prev) => ({
          ...prev,
          [page.mystery]: {
            ...(prev[page.mystery] || { locations: {} }),
            locations: {
              ...(prev[page.mystery]?.locations || {}),
              [locationName]: {
                fragment: prev[page.mystery]?.locations?.[locationName]?.fragment || false,
                location: true,
              },
            },
          },
        }));

        setRoomError(null);
      } else {
        setLocationStatus('error');
        setRoomError('❌ Incorrect location code.');
      }
    } catch (e) {
      setLocationStatus('error');
      setRoomError('❌ Error checking location.');
    }
  };

  const submitMainClue = async () => {
    if (mainCooldown > 0 || !mainInput) return;
    setMainStatus('loading');
    setMainCooldown(60);

    try {
      const res = await fetch('/api/main', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mysteryId: page.mystery, answer: mainInput }),
      });
      const data = await res.json();

      if (data.correct) {
        setMainStatus('success');
        setMainMessage(data.message);
      } else {
        setMainStatus('error');
        setMainMessage(data.message);
      }
    } catch (e) {
      setMainStatus('error');
      setMainMessage('❌ Error submitting main clue.');
    }
  };


  // ---------- RENDER ----------
  if (page.view === 'menu') {
    const allMysteries = Object.entries(mysteries);
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center justify-center gap-8 p-6">
        <div className="absolute top-4 right-4 flex items-center gap-3 bg-[#1a1a1b] px-4 py-2 rounded-full border border-[#272729] shadow-lg">
          <span className="text-[#ff4500] font-bold">⭐ {counterLoading ? '...' : xp}</span>
          <span className="text-gray-300 text-sm">XP</span>
        </div>

        <h1 className="text-4xl font-bold text-[#ff4500]">Thread of Clues</h1>
        <p className="text-gray-300 max-w-md text-center">
          {username ? `Welcome, Officer ${username}. ` : 'Welcome, Officer. '}
          Choose your next case to investigate.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          {allMysteries.map(([id, m]) => {
            const progress = locationProgress[id];
            const mysteryCompleted = progress
              ? Object.values(progress.locations).every(p => p.location)
              : false;
            return (
              <div key={id} className="relative">
                <button
                  onClick={() => setPage({ view: 'city', mystery: id })}
                  className="bg-[#1a1a1b] rounded-xl p-6 text-left hover:bg-[#242526] shadow-lg transition border border-[#272729] w-full"
                >
                  <h2 className="text-2xl text-[#ff4500] font-semibold mb-1">{m.title}</h2>
                  <p className="text-gray-300">{m.desc}</p>
                </button>
                {mysteryCompleted && (
                  <span className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
          Completed ✅
        </span>
                )}
              </div>
            );
          })}
        </div>

        <footer className="text-gray-500 text-sm mt-8">r/Devvit Game • Made for Reddit Hackathon</footer>
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

    const allLocationsDone = mystery.locations.every(
      (loc) => locationProgress[page.mystery]?.locations?.[loc.name]?.location
    );


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
            const progress = locationProgress[page.mystery]?.locations[loc.name] || { fragment: false, location: false };

            let bgColor = '#ff0000';
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
        <div className="mt-6 flex flex-col gap-2 w-full max-w-md">
          {allLocationsDone ? (
            <div>
              <p className="text-gray-300 mb-2 font-semibold">{mystery.question}</p>
              {locationProgress[page.mystery]?.main?.done ?
              <p className="text-gray-400 mb-2">Main clue solved: {mystery.main_answer}!</p>
              :
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#ff4500] mb-2">Location Clues:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {mystery.locations.map((loc) => (
                      <div
                        key={loc.name}
                        className="bg-[#1a1a1b] border border-[#272729] rounded-lg px-3 py-2 text-center text-sm"
                      >
                        <p className="font-semibold text-gray-200">{loc.name}</p>
                        <p className="text-[#ff4500]">
                          {locationProgress[page.mystery]?.locations?.[loc.name]?.location ? loc.location_code : '❓'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  value={mainInput}
                  onChange={e => setMainInput(e.target.value.toUpperCase())}
                  placeholder="Enter main clue answer"
                  className="w-full bg-[#1a1a1b] border border-[#272729] px-4 py-2 rounded-lg text-white placeholder-gray-500"
                  disabled={mainStatus === 'loading' || mainCooldown > 0}
                />
                <button
                  onClick={submitMainClue}
                  disabled={mainStatus === 'loading' || mainCooldown > 0}
                  className="mt-2 w-full bg-[#ff4500] hover:bg-[#d93a00] text-white py-2 rounded-lg transition"
                >
                  {mainStatus === 'loading' ? 'Checking...' : mainCooldown > 0 ? `Try again in ${mainCooldown}s` : 'Submit Main Answer'}
                </button>
                {mainMessage && (
                  <p className={`mt-2 font-semibold ${mainStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {mainMessage}
                  </p>
                )}
              </>}

            </div>
          ) : (
            <p className="text-gray-400">Solve all 5 location clues to guess the main answer.</p>
          )}
        </div>
      </div>
    );
  }

  // ---------------- ROOM PAGE ----------------
  if (page.view === 'room') {
    const mystery = mysteries[page.mystery];
    const location = mystery.locations[page.location];
    const locationName = location.name;
    const currentProgress = locationProgress[page.mystery]?.locations[locationName] || { fragment: false, location: false };

    const fragmentCodeToShow = currentProgress.fragment ? location.fragment_codes[userFragment] : null;
    const locationCodeToShow = currentProgress.location ? location.location_code : null;

    const canSubmitFragment = !currentProgress.fragment && selectedObjects.length === 3 && cooldown === 0;
    const canSubmitLocation = currentProgress.fragment && !currentProgress.location && cooldown === 0;

    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex flex-col items-center p-4 md:p-6">
        {/* Back button */}
        <button
          onClick={() => setPage({ view: 'city', mystery: page.mystery })}
          className="mb-4 text-gray-300 hover:text-[#ff4500] self-start"
        >
          ← Back to city
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-[#ff4500] mb-2">{locationName}</h1>

        {/* Instructions */}
        {!locationCodeToShow && !currentProgress.fragment && (
          <p className="text-gray-400 text-sm md:text-base mb-4 text-center md:text-left">
            Three objects have clues that combine into a word. Select 3 and enter the fragment code below.
          </p>
        )}
        {!locationCodeToShow && currentProgress.fragment && (
          <p className="text-gray-400 text-sm md:text-base mb-4 text-center md:text-left">
            The location code links the fragment codes. You have one fragment code — ask others for the rest!
          </p>
        )}
        {locationCodeToShow && fragmentCodeToShow && (
          <p className="text-gray-400 text-sm md:text-base mb-4 text-center md:text-left">
            You’ve discovered this location’s code. Use all location codes to deduce the main answer.
          </p>
        )}

        {/* Objects area */}
        <div className="relative w-full max-w-4xl aspect-[16/9] bg-gradient-to-b from-[#242526] to-[#1a1a1b] rounded-2xl shadow-lg border border-[#272729] p-2 overflow-hidden">
          {location.objects.map((obj, i) => {
            const selected = selectedObjects.includes(obj.id);

            // Random-ish position within container bounds
            const top = 10 + (i * 17) % 70 + Math.random() * 10;   // 10% - 80%
            const left = 10 + ((i * 33) % 70) + Math.random() * 10; // 10% - 80%
            const rotate = Math.random() * 20 - 10; // -10deg to +10deg
            const scale = selected ? 1.3 : 1 + Math.random() * 0.1;

            return (
              <button
                key={obj.id}
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
                  zIndex: selected ? 10 : 1,
                }}
                className={`absolute text-3xl md:text-4xl transition-all duration-300 ${
                  selected ? 'drop-shadow-[0_0_15px_#ff4500]' : 'hover:scale-110 hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedClue(`${obj.name}: ${obj.messages[userFragment]}`);
                  toggleObject(obj.id);
                }}
              >
                {obj.emoji}
              </button>
            );
          })}
        </div>

        {/* Clue popup */}
        {selectedClue && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-[#1a1a1b] p-6 rounded-xl max-w-md text-center border border-[#272729] shadow-lg">
              <p className="italic mb-4">{selectedClue}</p>
              <button
                onClick={() => setSelectedClue(null)}
                className="bg-[#ff4500] px-4 py-2 rounded-full hover:bg-[#d93900] transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Inputs */}
        <div className="mt-6 flex flex-col gap-4 items-center w-full max-w-md">
          {!currentProgress.fragment && (
            <div className="w-full flex flex-col gap-2">
              <input
                type="text"
                value={fragmentInput}
                onChange={(e) => setFragmentInput(e.target.value.toUpperCase())}
                placeholder="Enter fragment code"
                disabled={!canSubmitFragment || fragmentStatus === 'loading'}
                className="w-full bg-[#1a1a1b] border border-[#272729] px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff4500]"
              />
              <button
                onClick={submitFragment}
                disabled={!canSubmitFragment || fragmentStatus === 'loading'}
                className="w-full bg-[#ff4500] hover:bg-[#d93a00] py-2 rounded-lg transition shadow-md"
              >
                {fragmentStatus === 'loading'
                  ? 'Checking...'
                  : cooldown > 0
                    ? `Try again in ${cooldown}s`
                    : 'Submit Fragment'}
              </button>
            </div>
          )}

          {currentProgress.fragment && !currentProgress.location && (
            <div className="w-full flex flex-col gap-2">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value.toUpperCase())}
                placeholder="Enter location code"
                disabled={!canSubmitLocation || locationStatus === 'loading'}
                className="w-full bg-[#1a1a1b] border border-[#272729] px-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff4500]"
              />
              <button
                onClick={submitLocation}
                disabled={!canSubmitLocation || locationStatus === 'loading'}
                className="w-full bg-[#ff4500] hover:bg-[#d93a00] py-2 rounded-lg transition shadow-md"
              >
                {locationStatus === 'loading'
                  ? 'Checking...'
                  : cooldown > 0
                    ? `Try again in ${cooldown}s`
                    : 'Submit Location'}
              </button>
            </div>
          )}

          {/* Feedback */}
          <div className="text-center mt-4 whitespace-pre-line">
            {roomError && <p className="text-red-400 font-semibold">{roomError}</p>}
            {fragmentCodeToShow && (
              <p className="text-green-400 font-semibold">🧩 Fragment solved: {fragmentCodeToShow}</p>
            )}
            {locationCodeToShow && (
              <p className="text-green-400 font-semibold">🏙️ Location solved: {locationCodeToShow}</p>
            )}
          </div>
        </div>
      </div>
    );
  }



  return null;
};
