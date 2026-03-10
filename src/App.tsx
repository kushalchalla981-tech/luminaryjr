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

  const handleExport = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.exportImage();
    }
  }, []);

  return (
    <Layout 
      hasImage={!!activeImage} 
      onNewImage={handleCloseImage}
      onExport={handleExport}
    >
      {!activeImage ? (
        <WelcomeScreen onImageSelect={handleImageSelect} />
      ) : (
        <div className="flex w-full h-full bg-[#0a0f18] overflow-hidden">
            {/* 
              Main Editor workspace layout
            */}
            
            {/* Left Toolbar */}
            <div className="relative h-full flex flex-col z-20">
              <div className="absolute inset-y-0 right-0 w-[0.75px] bg-white/10" />
              <GlowingEffect
                spread={20}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={1}
                className="rounded-none border-r border-transparent"
              />
              <div className="w-16 h-full flex flex-col items-center py-4 gap-4 bg-slate-900/80 backdrop-blur-xl border-r border-white/5 relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-all">
                <button 
                  onClick={() => setActiveTool('adjust')}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${activeTool === 'adjust' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`} 
                  title="Adjust"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
                <button 
                  onClick={() => setActiveTool('filters')}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${activeTool === 'filters' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`} 
                  title="Filters"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 5 3 3-5 5-3-3 5-5z"/><path d="M12 2A10 10 0 0 0 2 12c0 4.4 2.9 8.1 6.8 9.5.4.1.6-.2.6-.4v-1.6c-2.8.6-3.4-1.4-3.4-1.4-.4-1-.9-1.3-.9-1.3-.7-.5.1-.5.1-.5.7.1 1.1.8 1.1.8.6 1.1 1.7.8 2.1.6.1-.5.2-.8.4-1-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.8 1.1.8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c2-1.4 2.8-1.1 2.8-1.1.6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.3.2.5.7.5 1.4v2.1c0 .3.2.5.6.4A10 10 0 0 0 22 12a10 10 0 0 0-10-10z"/></svg>
                </button>
                <button 
                  onClick={() => setActiveTool('crop')}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${activeTool === 'crop' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`} 
                  title="Crop & Geometry"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>
                </button>
                
                {/* Future Expansion Links */}
                <div className="w-8 h-px bg-white/10 my-2" />
                
                <button 
                  onClick={() => setActiveTool('overlays')}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${activeTool === 'overlays' ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`} 
                  title="Overlays (Text/Shapes)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>
                </button>
                <button 
                  onClick={() => setActiveTool('ai')}
                  className={`w-10 h-10 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${activeTool === 'ai' ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-purple-400'}`} 
                  title="Local AI Tools"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                </button>
              </div>
            </div>

            {/* Center Canvas Workspace */}
            <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-slate-900" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(30,30,40,1) 0%, rgba(10,15,24,1) 100%)' }} />
                <div className="relative z-10 w-full h-full flex items-center justify-center border border-white/5 bg-black/40 overflow-hidden">
                  {imageUrl && <EditorWorkspace ref={editorRef} imageUrl={imageUrl} />}
                </div>
            </div>

            {/* Right Properties Panel */}
            <div className="relative h-full hidden md:flex flex-col z-20 shrink-0">
                <div className="absolute inset-y-0 left-0 w-[0.75px] bg-white/10" />
                <GlowingEffect
                  spread={20}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={1}
                  className="rounded-none border-l border-transparent"
                />
                <div className="w-80 h-full bg-slate-900/90 backdrop-blur-2xl border-l border-white/5 p-6 relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.3)] overflow-hidden">
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
