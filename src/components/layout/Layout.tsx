import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Download, Undo, Redo, ZoomIn, ZoomOut, Image as ImageIcon } from 'lucide-react';
import { ThemeSwitcher } from '../ui/apple-liquid-glass-switcher';
import { BackgroundPaths } from "@/components/ui/background-paths";
import { InteractiveButton } from "@/components/ui/interactive-button";

interface LayoutProps {
  children: React.ReactNode;
  hasImage: boolean;
  onExport: () => void;
  onNewImage: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  zoomLevel?: number;
}

export function Layout({
  children, hasImage, onExport, onNewImage,
  onUndo, onRedo, onZoomIn, onZoomOut, zoomLevel = 100
}: LayoutProps) {
  const { theme, setTheme } = useEditorStore();
  React.useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-black text-slate-100 transition-colors duration-500">
      
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
         <BackgroundPaths showContent={false} />
      </div>

      
      {/* Top Bar - Command Center */}
      <header className="relative z-50 flex h-14 items-center justify-between border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black/50 px-4 py-2 backdrop-blur-xl transition-all">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-400">
            <ImageIcon size={18} />
          </div>
          <h1 className="text-sm font-semibold tracking-wide">LuminaryJr</h1>
        </div>

        {/* Center: Controls (Only show if image loaded) */}
        {hasImage && (
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/5 bg-white/5 p-1 backdrop-blur-md">
            <button onClick={onUndo} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white text-slate-500 dark:text-slate-400 transition-colors" title="Undo">
              <Undo size={16} />
            </button>
            <button onClick={onRedo} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white text-slate-500 dark:text-slate-400 transition-colors" title="Redo">
              <Redo size={16} />
            </button>
            <div className="mx-2 h-4 w-px bg-white/10" />
            <button onClick={onZoomOut} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white text-slate-500 dark:text-slate-400 transition-colors" title="Zoom Out">
              <ZoomOut size={16} />
            </button>
            <span className="w-12 text-center text-xs font-medium text-slate-300">{zoomLevel}%</span>
            <button onClick={onZoomIn} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white text-slate-500 dark:text-slate-400 transition-colors" title="Zoom In">
              <ZoomIn size={16} />
            </button>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher defaultValue={theme} value={theme} onValueChange={setTheme} />
          
          {hasImage && (
            <>
              <button 
                onClick={onNewImage}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
              >
                Close Image
              </button>
              <InteractiveButton 
                onClick={onExport}
                className="bg-yellow-600 hover:bg-yellow-500 px-6 py-2 h-9 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(218,165,32,0.4)]"
                containerClassName="h-9"
              >
                <Download size={14} />
                <span>Export High-Res</span>
              </InteractiveButton>
            </>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex flex-1 overflow-hidden">
        {children}
      </main>

    </div>
  );
}
