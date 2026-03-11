import { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { BackgroundPaths } from "@/components/ui/background-paths";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WelcomeScreenProps {
  onImageSelect: (file: File) => void;
}

export function WelcomeScreen({ onImageSelect }: WelcomeScreenProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Handle Drag Events
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  }, [onImageSelect]);

  // Handle Input Change
  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelect(e.target.files[0]);
    }
  }, [onImageSelect]);

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">

      {/* Floating Upload Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className={cn(
          "relative h-full w-full transition-all duration-500",
          isDragging ? "scale-[1.02]" : "scale-100"
        )}>
          
          <div 
            className={`relative flex h-[60vh] w-full flex-col items-center justify-center transition-all duration-500 ${
              isDragging ? 'bg-white dark:bg-black/5 dark:bg-white/5 rounded-[2rem]' : 'bg-transparent'
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="text-center flex flex-col items-center px-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
                className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] group relative"
              >
                {/* Give the icon container a subtle glowing effect to make it stand out since it's floating */}
                <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.15)] pointer-events-none" />
                <UploadCloud size={48} className="text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              </motion.div>
              
              <h2 className="mb-4 text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 dark:text-white">
                Luminary<span className="text-yellow-400">Jr</span>
              </h2>
              <p className="mb-10 text-slate-500 dark:text-slate-400 max-w-md text-lg leading-relaxed">
                Drag and drop your image here, or browse your files. 
                All processing happens <span className="text-slate-900 dark:text-white font-medium italic">locally</span> on your device.
              </p>

              <InteractiveButton
                onClick={() => document.getElementById('file-upload')?.click()}
                className="group relative"
              >
                <ImageIcon size={20} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
                <span className="text-lg font-semibold text-slate-900 dark:text-white tracking-wide">Browse Files</span>
                <input 
                  id="file-upload"
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={onFileInput}
                />
              </InteractiveButton>
            </div>
          </div>
        </div>

        {/* Subtle drop indication border */}
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-6 rounded-2xl border-2 border-dashed border-yellow-500/50 pointer-events-none z-20"
          />
        )}
      </motion.div>
    </div>
  );
}
