import {  useState  } from 'react';
import { useEditorStore } from '../../../store/editorStore';
import { filterCategories, FilterPreset } from '../../../store/filterPresets';

export function FiltersPanel() {
  const { setAdjustment, resetAdjustments } = useEditorStore();
  const [activeCategory, setActiveCategory] = useState(filterCategories[0].name);

  const handleApplyFilter = (preset: FilterPreset) => {
    resetAdjustments(); // Clear previous
    // Apply new
    Object.entries(preset.adjustments).forEach(([key, value]) => {
      setAdjustment(key as any, value as number);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 5 3 3-5 5-3-3 5-5z"/><path d="M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.1 6.8 9.5.4.1.6-.2.6-.4v-1.6c-2.8.6-3.4-1.4-3.4-1.4-.4-1-.9-1.3-.9-1.3-.7-.5.1-.5.1-.5.7.1 1.1.8 1.1.8.6 1.1 1.7.8 2.1.6.1-.5.2-.8.4-1-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.8 1.1.8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c2-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.3.2.5.7.5 1.4v2.1c0 .3.2.5.6.4A10 10 0 0 0 22 12a10 10 0 0 0-10-10z"/></svg>
          Filters
        </h3>
        <button 
          onClick={resetAdjustments}
          className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto custom-scrollbar pb-2">
        {filterCategories.map((cat: { name: string, filters: any[] }) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.name 
                ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-10 custom-scrollbar pr-2">
        {filterCategories.find((c) => c.name === activeCategory)?.filters.map((filter) => (
          <div 
            key={filter.name}
            onClick={() => handleApplyFilter(filter)}
            className="group relative cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-full aspect-square rounded-xl bg-slate-800 border border-white/10 overflow-hidden relative transition-all group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
               {/* A generic thumbnail placeholder to represent the filter vibe */}
               <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-500/10 transition-opacity" />
               <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
               </div>
            </div>
            <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors text-center">
              {filter.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
