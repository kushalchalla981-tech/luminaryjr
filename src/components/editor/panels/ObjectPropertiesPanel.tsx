import {  useEffect, useState  } from 'react';
import { useEditorStore } from '../../../store/editorStore';
import * as fabric from 'fabric';

interface ObjectPropertiesPanelProps {
  canvas: fabric.Canvas | null;
}

export function ObjectPropertiesPanel({ canvas }: ObjectPropertiesPanelProps) {
  const { selectedObjectId, selectedObjectType, setSelectedObject } = useEditorStore();
  
  const [fillColor, setFillColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(100);
  const [fontFamily, setFontFamily] = useState('system-ui, sans-serif');
  const [fontSize, setFontSize] = useState(40);

  // Sync state with selected object properties
  useEffect(() => {
    if (!canvas || !selectedObjectId) return;
    
    // Find object in canvas
    const obj = canvas.getObjects().find((o: fabric.Object & { id?: string }) => o.id === selectedObjectId);
    if (!obj) return;

    if (obj.fill && typeof obj.fill === 'string') {
        setFillColor(obj.fill);
    }
    if (obj.opacity !== undefined) {
        setOpacity(Math.round(obj.opacity * 100));
    }
    
    if (obj.type === 'text' || obj.type === 'i-text') {
        const textObj = obj as fabric.IText;
        setFontFamily(textObj.fontFamily || 'system-ui, sans-serif');
        setFontSize(textObj.fontSize || 40);
    }

  }, [canvas, selectedObjectId]);

  const updateObject = (updates: Record<string, any>) => {
    if (!canvas || !selectedObjectId) return;
    const obj = canvas.getObjects().find((o: fabric.Object & { id?: string }) => o.id === selectedObjectId);
    if (!obj) return;

    obj.set(updates);
    canvas.requestRenderAll();
  };

  const handleDelete = () => {
    if (!canvas || !selectedObjectId) return;
    const obj = canvas.getObjects().find((o: fabric.Object & { id?: string }) => o.id === selectedObjectId);
    if (obj) {
      canvas.remove(obj);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      setSelectedObject(null, null);
    }
  };

  if (!selectedObjectType) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-900 dark:text-white/90 uppercase tracking-wider flex items-center gap-2">
          {selectedObjectType === 'text' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
          )}
          {selectedObjectType} Properties
        </h3>
        
        <button 
          onClick={handleDelete}
          className="w-7 h-7 rounded bg-red-500/10 hover:bg-red-500 hover:text-slate-900 dark:text-slate-900 dark:text-white text-red-500 transition-colors flex items-center justify-center cursor-pointer"
          title="Delete Object"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>
      
      <div className="flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar pr-2">
        
        {/* Color Picker */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 dark:text-slate-400">Color</span>
            <div className="flex items-center gap-3">
                <input 
                    type="color" 
                    value={fillColor}
                    onChange={(e) => {
                        setFillColor(e.target.value);
                        updateObject({ fill: e.target.value });
                    }}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-none p-0"
                />
                <span className="text-sm font-mono text-slate-900 dark:text-slate-900 dark:text-white/80 uppercase">{fillColor}</span>
            </div>
        </div>

        {/* Opacity Slider */}
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 dark:text-slate-400">Opacity</span>
                <span className="text-xs font-mono text-slate-500 w-8 text-right bg-slate-100 dark:bg-white/5 rounded px-1 py-0.5">{opacity}%</span>
            </div>
            <input
                type="range"
                min={0}
                max={100}
                value={opacity}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setOpacity(val);
                    updateObject({ opacity: val / 100 });
                }}
                className="w-full h-1.5 appearance-none rounded-full bg-slate-200 dark:bg-white/10 cursor-pointer accent-yellow-500 focus:outline-none"
            />
        </div>

        {/* Text Specific Properties */}
        {selectedObjectType === 'text' && (
            <>
                <div className="flex flex-col gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 dark:text-slate-400">Typography</span>
                    
                    {/* Font Family */}
                    <select 
                        value={fontFamily}
                        onChange={(e) => {
                            setFontFamily(e.target.value);
                            updateObject({ fontFamily: e.target.value });
                        }}
                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-900 dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-500"
                    >
                        <option value="system-ui, sans-serif">System Sans</option>
                        <option value="Georgia, serif">Georgia Serif</option>
                        <option value="'Courier New', Courier, monospace">Courier Mono</option>
                        <option value="'Impact', sans-serif">Impact Bold</option>
                        <option value="'Comic Sans MS', cursive, sans-serif">Comic Sans</option>
                        <option value="'Trebuchet MS', sans-serif">Trebuchet</option>
                    </select>
                </div>
                
                <div className="flex flex-col gap-3">
                     <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 dark:text-slate-400">Size Tracking</span>
                     <input
                        type="range"
                        min={10}
                        max={200}
                        value={fontSize}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setFontSize(val);
                            updateObject({ fontSize: val });
                        }}
                        className="w-full h-1.5 appearance-none rounded-full bg-slate-200 dark:bg-white/10 cursor-pointer accent-yellow-500 focus:outline-none"
                    />
                </div>
            </>
        )}

      </div>
    </div>
  );
}
