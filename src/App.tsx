import { useState, useCallback, useRef } from 'react';
import { Layout } from './components/layout/Layout';
import { WelcomeScreen } from './components/layout/WelcomeScreen';
import { EditorWorkspace, EditorWorkspaceRef } from './components/editor/EditorWorkspace';
import { AdjustmentsPanel } from './components/editor/panels/AdjustmentsPanel';
import { FiltersPanel } from './components/editor/panels/FiltersPanel';
import { CropPanel } from './components/editor/panels/CropPanel';
import { OverlaysPanel } from './components/editor/panels/OverlaysPanel';
import { ObjectPropertiesPanel } from './components/editor/panels/ObjectPropertiesPanel';
import { AiPanel } from './components/editor/panels/AiPanel';
import { useEditorStore } from './store/editorStore';
import { GlowingEffect } from "@/components/ui/glowing-effect";

function App() {
  const [activeImage, setActiveImage] = useState<File | null>(null);
  
  // This state will hold the data URL for the canvas to consume
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Ref to trigger canvas methods like export
  const editorRef = useRef<EditorWorkspaceRef>(null);
  
  const { activeTool, setActiveTool, selectedObjectType } = useEditorStore();

  const handleImageSelect = useCallback((file: File) => {
    setActiveImage(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const handleCloseImage = useCallback(() => {
    setActiveImage(null);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
  }, [imageUrl]);

  const [zoomLevel, setZoomLevel] = useState(100);

  const handleExport = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.exportImage();
    }
  }, []);

  const handleUndo = useCallback(() => editorRef.current?.undo(), []);
  const handleRedo = useCallback(() => editorRef.current?.redo(), []);
  const handleZoomIn = useCallback(() => {
      editorRef.current?.zoomIn();
      if (editorRef.current) setZoomLevel(editorRef.current.getZoom());
  }, []);
  const handleZoomOut = useCallback(() => {
      editorRef.current?.zoomOut();
      if (editorRef.current) setZoomLevel(editorRef.current.getZoom());
  }, []);

  return (
    <Layout 
      hasImage={!!activeImage} 
      onNewImage={handleCloseImage}
      onExport={handleExport}
      onUndo={handleUndo}
      onRedo={handleRedo}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      zoomLevel={zoomLevel}
    >
      {!activeImage ? (
        <WelcomeScreen onImageSelect={handleImageSelect} />
      ) : (
        <div className="flex w-full h-full bg-transparent overflow-hidden">
            {/* 
              Main Editor workspace layout
            */}
            
            {/* Left Toolbar */}
            <div className="relative h-full flex flex-col z-20 pointer-events-none">
              {/* Only the buttons should have pointer events, not the container */}
              <div
                className="w-16 h-full flex flex-col items-center py-4 gap-4 relative z-10 transition-all pointer-events-auto"
              >
                <button 
                  onClick={() => setActiveTool('adjust')}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${activeTool === 'adjust' ? 'bg-yellow-50 dark:bg-black text-yellow-600 dark:text-yellow-400 border border-yellow-400 dark:border-yellow-500 shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'bg-white dark:bg-black text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'}`}
                  title="Adjust"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
                <button 
                  onClick={() => setActiveTool('filters')}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${activeTool === 'filters' ? 'bg-yellow-50 dark:bg-black text-yellow-600 dark:text-yellow-400 border border-yellow-400 dark:border-yellow-500 shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'bg-white dark:bg-black text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'}`}
                  title="Filters"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 5 3 3-5 5-3-3 5-5z"/><path d="M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.1 6.8 9.5.4.1.6-.2.6-.4v-1.6c-2.8.6-3.4-1.4-3.4-1.4-.4-1-.9-1.3-.9-1.3-.7-.5.1-.5.1-.5.7.1 1.1.8 1.1.8.6 1.1 1.7.8 2.1.6.1-.5.2-.8.4-1-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.8 1.1.8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c2-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.3.2.5.7.5 1.4v2.1c0 .3.2.5.6.4A10 10 0 0 0 22 12a10 10 0 0 0-10-10z"/></svg>
                </button>
                <button 
                  onClick={() => setActiveTool('crop')}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${activeTool === 'crop' ? 'bg-yellow-50 dark:bg-black text-yellow-600 dark:text-yellow-400 border border-yellow-400 dark:border-yellow-500 shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'bg-white dark:bg-black text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'}`}
                  title="Crop & Geometry"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
                </button>
                
                {/* Future Expansion Links */}
                <div className="w-8 h-px bg-slate-200 dark:bg-white/10 my-2" />
                
                <button 
                  onClick={() => setActiveTool('overlays')}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${activeTool === 'overlays' ? 'bg-yellow-50 dark:bg-black text-yellow-600 dark:text-yellow-400 border border-yellow-400 dark:border-yellow-500 shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'bg-white dark:bg-black text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'}`}
                  title="Overlays (Text/Shapes)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
                </button>
                <button 
                  onClick={() => setActiveTool('ai')}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${activeTool === 'ai' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 'bg-white dark:bg-black text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:text-purple-400'}`}
                  title="Local AI Tools"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                </button>
              </div>
            </div>

            {/* Center Canvas Workspace */}
            <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-slate-100/50 dark:bg-black/50" />
                {/*
                  Make the center workspace visually extend under the "floating" panels.
                  We removed the white borders and background.
                */}
                <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
                  {imageUrl && <EditorWorkspace ref={editorRef} imageUrl={imageUrl} />}
                </div>
            </div>

            {/* Right Properties Panel */}
            <div className="relative h-full hidden md:flex flex-col z-20 shrink-0 pointer-events-none">
                <div
                  className="w-80 h-full p-6 relative z-10 overflow-hidden pointer-events-auto"
                >
                    {selectedObjectType ? (
                      <ObjectPropertiesPanel canvas={editorRef.current?.getCanvas() || null} />
                    ) : (
                      <>
                        {activeTool === 'adjust' && <AdjustmentsPanel />}
                        {activeTool === 'filters' && <FiltersPanel />}
                        {activeTool === 'crop' && <CropPanel />}
                        {activeTool === 'overlays' && <OverlaysPanel />}
                        {activeTool === 'ai' && <AiPanel />}
                      </>
                    )}
                </div>
            </div>

        </div>
      )}
    </Layout>
  );
}

export default App;
