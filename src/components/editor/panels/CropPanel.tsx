import {  } from 'react';
import { useEditorStore } from '../../../store/editorStore';

const aspectRatios = [
  { label: 'Free', value: 'free' },
  { label: 'Original', value: 'original' },
  { label: '1:1', value: 1 / 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
  { label: '3:2', value: 3 / 2 },
  { label: '2:3', value: 2 / 3 },
  { label: '5:4', value: 5 / 4 },
  { label: '7:5', value: 7 / 5 },
];

export function CropPanel() {
  const { geometry, setGeometry, triggerCrop } = useEditorStore();

  const handleRotate = (deg: number) => {
    setGeometry('rotation', (geometry.rotation + deg) % 360);
  };

  const handleFlip = (axis: 'X' | 'Y') => {
    if (axis === 'X') setGeometry('flipX', !geometry.flipX);
    if (axis === 'Y') setGeometry('flipY', !geometry.flipY);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
          Crop & Rotate
        </h3>
        
        <button 
          onClick={() => {
            setGeometry('rotation', 0);
            setGeometry('flipX', false);
            setGeometry('flipY', false);
          }}
          className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>
      
      <div className="flex flex-col gap-8 overflow-y-auto pb-10 custom-scrollbar pr-2">
        
        {/* Rotate & Flip */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-400">Transform</span>
            <div className="grid grid-cols-4 gap-2">
                <button onClick={() => handleRotate(-90)} className="h-10 rounded-lg bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white transition-colors" title="Rotate Left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
                <button onClick={() => handleRotate(90)} className="h-10 rounded-lg bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white transition-colors" title="Rotate Right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </button>
                <button onClick={() => handleFlip('X')} className={`h-10 rounded-lg flex items-center justify-center transition-colors ${geometry.flipX ? 'bg-yellow-500 text-white' : 'bg-black hover:bg-zinc-900 border border-white/10 text-white'}`} title="Flip Horizontal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v2"/><path d="M12 14v2"/><path d="M12 8v2"/><path d="M12 2v2"/><path d="M17 12c0-3.3-2.2-6-5-6v12c2.8 0 5-2.7 5-6Z"/><path d="M7 12c0-3.3 2.2-6 5-6v12c-2.8 0-5-2.7-5-6Z"/></svg>
                </button>
                <button onClick={() => handleFlip('Y')} className={`h-10 rounded-lg flex items-center justify-center transition-colors ${geometry.flipY ? 'bg-yellow-500 text-white' : 'bg-black hover:bg-zinc-900 border border-white/10 text-white'}`} title="Flip Vertical">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h2"/><path d="M9 12h2"/><path d="M15 12h2"/><path d="M21 12h2"/><path d="M12 17c3.3 0 6-2.2 6-5H6c0 2.8 2.7 5 6 5Z"/><path d="M12 7c3.3 0 6 2.2 6 5H6c0-2.8 2.7-5 6-5Z"/></svg>
                </button>
            </div>
        </div>

        {/* Straighten */}
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-400">Straighten</span>
                <span className="text-xs font-mono text-slate-500 w-8 text-right bg-white/5 rounded px-1 py-0.5">{geometry.straighten}°</span>
            </div>
            <input
                type="range"
                min={-45}
                max={45}
                value={geometry.straighten}
                onChange={(e) => setGeometry('straighten', parseFloat(e.target.value))}
                className="w-full h-1.5 appearance-none rounded-full bg-white/10 cursor-pointer accent-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            />
        </div>

        {/* Skew X */}
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-400">Perspective X</span>
                <span className="text-xs font-mono text-slate-500 w-8 text-right bg-white/5 rounded px-1 py-0.5">{geometry.skewX}°</span>
            </div>
            <input
                type="range"
                min={-45}
                max={45}
                value={geometry.skewX}
                onChange={(e) => setGeometry('skewX', parseFloat(e.target.value))}
                onDoubleClick={() => setGeometry('skewX', 0)}
                className="w-full h-1.5 appearance-none rounded-full bg-white/10 cursor-pointer accent-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            />
        </div>

        {/* Skew Y */}
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-400">Perspective Y</span>
                <span className="text-xs font-mono text-slate-500 w-8 text-right bg-white/5 rounded px-1 py-0.5">{geometry.skewY}°</span>
            </div>
            <input
                type="range"
                min={-45}
                max={45}
                value={geometry.skewY}
                onChange={(e) => setGeometry('skewY', parseFloat(e.target.value))}
                onDoubleClick={() => setGeometry('skewY', 0)}
                className="w-full h-1.5 appearance-none rounded-full bg-white/10 cursor-pointer accent-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            />
        </div>

        {/* Aspect Ratios */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-400">Aspect Ratio</span>
            <div className="grid grid-cols-4 gap-2">
                {aspectRatios.map(ratio => (
                    <button
                        key={ratio.label}
                        onClick={() => setGeometry('aspectRatio', ratio.value as any)}
                        className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                            geometry.aspectRatio === ratio.value
                                ? 'bg-yellow-500 text-white shadow-[0_0_10px_rgba(255,215,0,0.3)]'
                                : 'bg-black text-slate-400 hover:bg-zinc-900 border border-white/10 hover:text-white'
                        }`}
                    >
                        {ratio.label}
                    </button>
                ))}
            </div>
            <button 
                onClick={triggerCrop}
                className="w-full py-2.5 mt-2 rounded bg-yellow-600 hover:bg-yellow-500 text-white font-semibold text-sm shadow-[0_4px_15px_rgba(218,165,32,0.4)] transition-all"
            >
                Apply Crop
            </button>
        </div>

      </div>
    </div>
  );
}
