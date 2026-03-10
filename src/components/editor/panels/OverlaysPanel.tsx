import React from 'react';
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
        
        {/* Text Section */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-400">Typography</span>
            <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => triggerAddText('Title Text')}
                  className="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 transition-all flex flex-col items-center justify-center gap-1 group"
                >
                    <span className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">T</span>
                    <span className="text-[10px] text-slate-400 font-medium">Add Head</span>
                </button>
                <button 
                  onClick={() => triggerAddText('Body text goes here...')}
                  className="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 transition-all flex flex-col items-center justify-center gap-1 group"
                >
                    <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Aa</span>
                    <span className="text-[10px] text-slate-400 font-medium">Add Body</span>
                </button>
            </div>
            {/* Future expansion: Fonts, colors, bold, italic controls will appear when text is selected on canvas */}
        </div>

        {/* Basic Shapes */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-400">Shapes & Elements</span>
            <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => triggerAddShape('rect')}
                  className="aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-transparent hover:border-white/10" 
                  title="Rectangle"
                >
                    <div className="w-6 h-6 border-2 border-current rounded-sm" />
                </button>
                <button 
                  onClick={() => triggerAddShape('circle')}
                  className="aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-transparent hover:border-white/10" 
                  title="Circle"
                >
                    <div className="w-6 h-6 border-2 border-current rounded-full" />
                </button>
                <button 
                  onClick={() => triggerAddShape('triangle')}
                  className="aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-transparent hover:border-white/10" 
                  title="Triangle"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>
                </button>
                <button 
                  onClick={() => triggerAddShape('star')}
                  className="aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-transparent hover:border-white/10" 
                  title="Star"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
                <button 
                  onClick={() => triggerAddShape('polygon')}
                  className="aspect-square rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-transparent hover:border-white/10" 
                  title="Hexagon"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </button>
            </div>
            
            <p className="text-[10px] text-slate-500 mt-2 text-center leading-relaxed">
              Click elements to add them to the canvas.<br/>
              You can drag, resize, and rotate objects directly.
              Select an object to reveal style properties.
            </p>
        </div>

        {/* Freehand Drawing */}
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Freehand Drawing</span>
                <button 
                  onClick={() => setDrawingMode(!isDrawingMode)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                      isDrawingMode ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
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
                            className="w-full h-1.5 appearance-none rounded-full bg-white/10 cursor-pointer accent-blue-500 focus:outline-none"
                        />
                    </div>
                    <p className="text-[10px] text-blue-300/70 leading-relaxed text-center mt-2">
                        Draw directly on the image canvas.
                    </p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
