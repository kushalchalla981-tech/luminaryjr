import {  } from 'react';
import { useEditorStore } from '../../../store/editorStore';

export function OverlaysPanel() {
  const { 
      triggerAddText, triggerAddShape,
      isDrawingMode, setDrawingMode,
      brushColor, setBrushColor,
      brushWidth, setBrushWidth
  } = useEditorStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
          Overlays
        </h3>
      </div>
      
      <div className="flex flex-col gap-8 overflow-y-auto pb-10 custom-scrollbar pr-2">
        
        {/* Typography */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-400">Typography</span>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => triggerAddText('TITLE TEXT', 'title')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-lg font-black text-white transition-colors">Title</button>
                <button onClick={() => triggerAddText('Subtitle Text', 'subtitle')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-base font-semibold text-white transition-colors">Subtitle</button>
                <button onClick={() => triggerAddText('Body text goes here...', 'body')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-sm font-normal text-white transition-colors">Body</button>
                <button onClick={() => triggerAddText('Caption text', 'caption')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-xs font-light text-slate-300 transition-colors">Caption</button>
            </div>

            <span className="text-xs font-semibold text-slate-400 mt-2">Special Text</span>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => triggerAddText('Neon Text', 'neon')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-sm font-bold text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)] transition-colors">Neon</button>
                <button onClick={() => triggerAddText('OUTLINE', 'outline')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-sm font-black text-transparent stroke-white stroke-2" style={{ WebkitTextStroke: '1px white' }}>Outline</button>
                <button onClick={() => triggerAddText('Shadow Text', 'shadow')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-sm font-bold text-white drop-shadow-[3px_3px_2px_rgba(0,0,0,0.8)] transition-colors">Shadow</button>
                <button onClick={() => triggerAddText('Text Box', 'textbox')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-sm font-bold text-black bg-white/90 mx-2 my-1 transition-colors">Text Box</button>
                <button onClick={() => triggerAddText('Transparent Box', 'transparent-textbox')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-sm font-bold text-white bg-black/40 mx-2 my-1 transition-colors">Transp. Box</button>
                <button onClick={() => triggerAddText('Gradient', 'gradient')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 transition-colors">Gradient</button>
                <button onClick={() => triggerAddText('Watermark', 'watermark')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-sm font-black text-white/30 tracking-widest transition-colors">Watermark</button>
                <button onClick={() => triggerAddText('Handwriting', 'handwriting')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-sm font-medium italic font-serif text-white transition-colors">Handwriting</button>
                <button onClick={() => triggerAddText('✨ Sticker ✨', 'sticker')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-sm font-bold text-yellow-300 transition-colors">Sticker</button>
                <button onClick={() => triggerAddText('🔥🚀', 'emoji')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-lg transition-colors">Emoji</button>
                <button onClick={() => triggerAddText(new Date().toLocaleDateString(), 'date')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-xs font-mono text-white transition-colors">Date Stamp</button>
                <button onClick={() => triggerAddText('📍 Location', 'location')} className="py-2 rounded bg-black hover:bg-zinc-900 border border-white/10 text-xs font-semibold text-white transition-colors">Location</button>
            </div>
        </div>

        {/* Basic Shapes */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-400">Shapes</span>
            <div className="grid grid-cols-4 gap-2">
                <button onClick={() => triggerAddShape('rect')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Rectangle"><div className="w-5 h-4 border border-current" /></button>
                <button onClick={() => triggerAddShape('square')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Square"><div className="w-5 h-5 border border-current" /></button>
                <button onClick={() => triggerAddShape('rounded-rect')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Rounded Rectangle"><div className="w-6 h-4 border border-current rounded-sm" /></button>
                <button onClick={() => triggerAddShape('circle')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Circle"><div className="w-5 h-5 border border-current rounded-full" /></button>
                <button onClick={() => triggerAddShape('oval')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Oval"><div className="w-6 h-4 border border-current rounded-[50%]" /></button>
                <button onClick={() => triggerAddShape('triangle')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Triangle"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg></button>
                <button onClick={() => triggerAddShape('diamond')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Diamond"><div className="w-4 h-4 border border-current rotate-45" /></button>
                <button onClick={() => triggerAddShape('polygon')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Hexagon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></button>
                <button onClick={() => triggerAddShape('star')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Star"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></button>
                <button onClick={() => triggerAddShape('heart')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Heart"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button>
                <button onClick={() => triggerAddShape('callout')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Speech Bubble"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
            </div>
        </div>

        {/* Lines & Marks */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-400">Lines & Marks</span>
            <div className="grid grid-cols-4 gap-2">
                <button onClick={() => triggerAddShape('line')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Line"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="19" x2="19" y2="5"/></svg></button>
                <button onClick={() => triggerAddShape('dashed-line')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Dashed Line"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"><line x1="5" y1="19" x2="19" y2="5"/></svg></button>
                <button onClick={() => triggerAddShape('arrow')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
                <button onClick={() => triggerAddShape('double-arrow')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Double Arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/><polyline points="12 19 5 12 12 5"/></svg></button>
                <button onClick={() => triggerAddShape('frame')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Frame"><div className="w-5 h-5 border-4 border-current" /></button>
                <button onClick={() => triggerAddShape('highlight')} className="aspect-square rounded bg-black hover:bg-zinc-900 border border-white/10 flex items-center justify-center text-white" title="Highlight"><div className="w-6 h-3 bg-yellow-400/50 rounded-sm" /></button>
            </div>
        </div>

        {/* Freehand Drawing */}
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Freehand Drawing</span>
                <button 
                  onClick={() => setDrawingMode(!isDrawingMode)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      isDrawingMode ? 'bg-yellow-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                    {isDrawingMode ? 'Drawing On' : 'Drawing Off'}
                </button>
            </div>
            
            {isDrawingMode && (
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-slate-400">Brush Color</span>
                        <div className="flex items-center gap-3">
                            <input 
                                type="color" 
                                value={brushColor}
                                onChange={(e) => setBrushColor(e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                            />
                            <span className="text-xs font-mono text-white/50 uppercase">{brushColor}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                         <div className="flex justify-between items-end">
                            <span className="text-xs text-slate-400">Brush Size</span>
                            <span className="text-[10px] font-mono text-slate-500 bg-white/5 rounded px-1">{brushWidth}px</span>
                        </div>
                         <input
                            type="range"
                            min={1}
                            max={50}
                            value={brushWidth}
                            onChange={(e) => setBrushWidth(parseInt(e.target.value))}
                            className="w-full h-1.5 appearance-none rounded-full bg-white/10 cursor-pointer accent-yellow-500 focus:outline-none"
                        />
                    </div>
                    <p className="text-[10px] text-yellow-300/70 leading-relaxed text-center mt-2">
                        Draw directly on the image canvas.
                    </p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
