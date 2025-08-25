import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// A standalone roast generator page (based on the RoastGenerator in Home.js)
const Roast = () => {
  const [input, setInput] = useState('');
  const [roast, setRoast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Roast mode dropdown state
  const roastModes = [
    { id: 'roast2', label: '🔥 Roast 2.0' },
    { id: 'badchick', label: '💅 Bad Chick' },
    { id: 'unhinged', label: '🔞 Unhinged' },
    { id: 'smartass', label: '🧠 Smartass' },
    { id: 'clown', label: '🤡 Clown Mode' }
  ];
  const [selectedMode, setSelectedMode] = useState(roastModes[0].id);
  const [modeOpen, setModeOpen] = useState(false);

  const generateRoast = async () => {
    if (!input.trim()) {
      setError('Please tell us something about yourself first!');
      return;
    }
    setIsLoading(true);
    setError('');
    setRoast('');
    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
  // include selected roast mode so backend can adjust tone
  body: JSON.stringify({ input: input.trim(), mode: selectedMode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate roast');
      setRoast(data.roast || 'No roast returned.');
    } catch (err) {
      console.error('Roast generation error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 bg-white text-slate-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Get Roasted</h1>
          <p className="text-lg text-slate-600">Tell us a few facts and we&apos;ll return a short, savage roast.</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-6 shadow-lg mb-6 border border-slate-700">
          {/* Roast mode selector */}
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-sm text-slate-300">Choose roast mode</div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setModeOpen(!modeOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-sm font-medium border transition"
                style={{ borderColor: modeOpen ? '#3b82f6' : 'transparent' }}
                aria-haspopup="listbox"
                aria-expanded={modeOpen}
              >
                <span className="whitespace-nowrap">
                  {roastModes.find(m => m.id === selectedMode)?.label}
                </span>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {modeOpen && (
                <ul role="listbox" tabIndex={-1} className="absolute right-0 mt-2 w-56 bg-slate-800 border rounded-lg shadow-lg overflow-hidden z-40" style={{ borderColor: 'var(--border)' }}>
                  {roastModes.map((m) => (
                    <li
                      key={m.id}
                      role="option"
                      aria-selected={m.id === selectedMode}
                      onClick={() => { setSelectedMode(m.id); setModeOpen(false); }}
                      className={`px-3 py-2 cursor-pointer text-sm ${m.id === selectedMode ? 'bg-blue-50 text-slate-900' : 'text-slate-300 hover:bg-slate-700'}`}
                      style={m.id === selectedMode ? { borderLeft: '3px solid #3b82f6' } : {}}
                    >
                      {m.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell us about yourself — habits, dreams, or anything we can roast you for (be specific for better burns)."
            className="w-full p-4 bg-transparent border border-slate-700 rounded-lg resize-none focus:ring-0 text-white placeholder-gray-400"
            rows="4"
            maxLength="300"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-400">{input.length}/300</span>
            <div className="flex items-center gap-3">
              <Link to="/" className="text-sm text-slate-300 hover:underline">Back</Link>
              <button
                onClick={generateRoast}
                disabled={isLoading || !input.trim()}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 shadow-md"
              >
                {isLoading ? 'Roasting...' : 'Roast Me!'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-center">{error}</p>
          </div>
        )}

        {roast && (
          <div className="bg-gradient-to-r from-orange-50 to-rose-50 border-l-4 border-rose-400 rounded-lg p-6 shadow-lg mb-6">
            <h4 className="font-semibold text-rose-600 mb-2">Your Roast</h4>
            <p className="text-slate-800 whitespace-pre-line">{roast}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roast;
