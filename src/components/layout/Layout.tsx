import { Download, Undo, Redo, ZoomIn, ZoomOut, Image as ImageIcon } from 'lucide-react';
import { ThemeSwitcher } from '../ui/apple-liquid-glass-switcher';
import { BackgroundPaths } from "@/components/ui/background-paths";
import { InteractiveButton } from "@/components/ui/interactive-button";

interface LayoutProps {
  children: React.ReactNode;
  hasImage: boolean;
  onExport: () => void;
  onNewImage: () => void;
}

export function Layout({ children, hasImage, onExport, onNewImage }: LayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-neutral-950 text-slate-100 transition-colors duration-500">
      
      {!hasImage && (
        <div className="absolute inset-0 z-0 opacity-40">
           <BackgroundPaths showContent={false} />
        </div>
      )}

      
      {/* Top Bar - Command Center */}
      <header className="relative z-50 flex h-14 items-center justify-between border-b border-white/10 bg-slate-900/50 px-4 py-2 backdrop-blur-xl transition-all">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
            <ImageIcon size={18} />
          </div>
          <h1 className="text-sm font-semibold tracking-wide">LuminaryJr</h1>
        </div>

        {/* Center: Controls (Only show if image loaded) */}
        {hasImage && (
          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/5 bg-white/5 p-1 backdrop-blur-md">
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 hover:text-white text-slate-400 transition-colors" title="Undo">
              <Undo size={16} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 hover:text-white text-slate-400 transition-colors" title="Redo">
              <Redo size={16} />
            </button>
            <div className="mx-2 h-4 w-px bg-white/10" />
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 hover:text-white text-slate-400 transition-colors" title="Zoom Out">
              <ZoomOut size={16} />
            </button>
            <span className="w-12 text-center text-xs font-medium text-slate-300">100%</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10 hover:text-white text-slate-400 transition-colors" title="Zoom In">
              <ZoomIn size={16} />
            </button>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ThemeSwitcher defaultValue="dark" />
          
          {hasImage && (
            <>
              <button 
                onClick={onNewImage}
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Close Image
              </button>
              <InteractiveButton 
                onClick={onExport}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2 h-9 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)]"
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
