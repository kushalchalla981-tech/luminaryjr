import {  } from 'react';
import { useEditorStore } from '../../../store/editorStore';

const adjustmentConfig = [
  { id: 'exposure', label: 'Exposure', min: -100, max: 100 },
  { id: 'brightness', label: 'Brightness', min: -100, max: 100 },
  { id: 'contrast', label: 'Contrast', min: -100, max: 100 },
  { id: 'highlights', label: 'Highlights', min: -100, max: 100 },
  { id: 'shadows', label: 'Shadows', min: -100, max: 100 },
  { id: 'vibrance', label: 'Vibrance', min: -100, max: 100 },
  { id: 'saturation', label: 'Saturation', min: -100, max: 100 },
  { id: 'warmth', label: 'Warmth', min: -100, max: 100 },
  { id: 'tint', label: 'Tint', min: -100, max: 100 },
  { id: 'sharpness', label: 'Sharpness', min: 0, max: 100 },
  { id: 'vignette', label: 'Vignette', min: 0, max: 100 },
];

export function AdjustmentsPanel() {
  const { adjustments, setAdjustment, resetAdjustments } = useEditorStore();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-900 dark:text-white/90 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Adjustments
        </h3>
        
        <button 
          onClick={resetAdjustments}
          className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-900 dark:text-white transition-colors cursor-pointer"
        >
          Reset All
        </button>
      </div>
      
      <div className="flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar pr-2">
      {adjustmentConfig.map((ctrl) => {
        const val = adjustments[ctrl.id as keyof typeof adjustments];
        // Calculate percentage for CSS gradient track
        const percentage = ((val - ctrl.min) / (ctrl.max - ctrl.min)) * 100;
        
        return (
          <div key={ctrl.id} className="group flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label 
                htmlFor={ctrl.id} 
                className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:text-slate-900 dark:text-white transition-colors"
              >
                {ctrl.label}
              </label>
              <span className="text-xs font-mono text-slate-500 group-hover:text-yellow-400 w-8 text-right transition-colors">
                {val > 0 ? `+${val}` : val}
              </span>
            </div>
            
            <div className="relative w-full h-1.5 flex items-center">
              {/* Zero center tick (only if range crosses 0) */}
              {ctrl.min < 0 && (
                <div className="absolute left-1/2 top-1/2 h-2.5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-slate-300 dark:bg-white/20 z-0 rounded-full" />
              )}
              
              <input
                id={ctrl.id}
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                value={val}
                onChange={(e) => setAdjustment(ctrl.id as any, parseInt(e.target.value))}
                className="
                  w-full h-1.5 appearance-none rounded-full bg-slate-200 dark:bg-white/10
                  cursor-pointer z-10 transition-all
                  focus:outline-none focus:ring-2 focus:ring-yellow-500/50
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:h-4 
                  [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:bg-slate-700 dark:[&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.5)]
                  [&::-webkit-slider-thumb]:hover:scale-125
                  [&::-webkit-slider-thumb]:transition-transform
                "
                style={{
                  background: `linear-gradient(to right, 
                    rgba(255,255,255,0.1) 0%, 
                    rgba(255,255,255,0.1) ${ctrl.min < 0 ? 50 : 0}%, 
                    #FFD700 ${Math.min(percentage, ctrl.min < 0 ? 50 : 0)}%,
                    #FFD700 ${Math.max(percentage, ctrl.min < 0 ? 50 : 0)}%,
                    rgba(255,255,255,0.1) ${Math.max(percentage, ctrl.min < 0 ? 50 : 0)}%, 
                    rgba(255,255,255,0.1) 100%)`
                }}
              />
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
