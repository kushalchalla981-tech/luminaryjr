import {  useState  } from 'react';
import { useEditorStore } from '../../../store/editorStore';
import { filterCategories, FilterPreset } from '../../../store/filterPresets';

export function FiltersPanel() {
  const { setAdjustment, resetAdjustments, activeFilter, setActiveFilter } = useEditorStore();
  const [activeCategory, setActiveCategory] = useState(filterCategories[0].name);

  const handleApplyFilter = (preset: FilterPreset) => {
    resetAdjustments(); // Clear previous
    // Apply new
    Object.entries(preset.adjustments).forEach(([key, value]) => {
      setAdjustment(key as any, value as number);
    });
    setActiveFilter(preset.name);
  };

  const handleClearFilter = () => {
    resetAdjustments();
    setActiveFilter(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white/90 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 5 3 3-5 5-3-3 5-5z"/><path d="M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.1 6.8 9.5.4.1.6-.2.6-.4v-1.6c-2.8.6-3.4-1.4-3.4-1.4-.4-1-.9-1.3-.9-1.3-.7-.5.1-.5.1-.5.7.1 1.1.8 1.1.8.6 1.1 1.7.8 2.1.6.1-.5.2-.8.4-1-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.8 1.1.8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c2-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.3.2.5.7.5 1.4v2.1c0 .3.2.5.6.4A10 10 0 0 0 22 12a10 10 0 0 0-10-10z"/></svg>
          Filters
        </h3>
        <button 
          onClick={handleClearFilter}
          className="text-xs text-slate-500 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Filter List */}
      <div className="flex flex-col gap-2 overflow-y-auto pb-10 custom-scrollbar pr-2">
        {filterCategories[0].filters.map((filter) => {
          const isActive = activeFilter === filter.name;
          return (
          <button
            key={filter.name}
            onClick={() => handleApplyFilter(filter)}
            className={`group relative flex items-center justify-between w-full p-4 rounded-xl border transition-all cursor-pointer ${isActive ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-400 dark:border-yellow-500/50 shadow-[0_0_15px_rgba(255,215,0,0.1)]' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}
          >
            <span className={`text-sm font-medium transition-colors ${isActive ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
              {filter.name}
            </span>

            {isActive && (
              <div className="w-5 h-5 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            )}
          </button>
        )})}
      </div>
    </div>
  );
}
