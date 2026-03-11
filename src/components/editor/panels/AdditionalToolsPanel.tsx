import {  } from 'react';
import { useEditorStore } from '../../../store/editorStore';

export function AdditionalToolsPanel() {
  const isProcessingRemoval = useEditorStore((state) => state.pendingBgRemoval);
  const triggerBgRemoval = useEditorStore((state) => state.triggerBgRemoval);
  const bgRemovalTarget = useEditorStore((state) => state.bgRemovalTarget);
  const setBgRemovalTarget = useEditorStore((state) => state.setBgRemovalTarget);
  const bgRemovalOpacity = useEditorStore((state) => state.bgRemovalOpacity);
  const setBgRemovalOpacity = useEditorStore((state) => state.setBgRemovalOpacity);

  const isProcessingBlur = useEditorStore((state) => state.pendingBgBlur);
  const triggerBgBlur = useEditorStore((state) => state.triggerBgBlur);
  const bgBlurTarget = useEditorStore((state) => state.bgBlurTarget);
  const setBgBlurTarget = useEditorStore((state) => state.setBgBlurTarget);
  const bgBlurIntensity = useEditorStore((state) => state.bgBlurIntensity);
  const setBgBlurIntensity = useEditorStore((state) => state.setBgBlurIntensity);

  const handleBackgroundRemoval = () => {
    if (!isProcessingRemoval && !isProcessingBlur) {
        triggerBgRemoval();
    }
  };

  const handleBackgroundBlur = () => {
      if (!isProcessingRemoval && !isProcessingBlur) {
          triggerBgBlur();
      }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
          Additional Tools
        </h3>
      </div>

      <div className="flex flex-col gap-8 overflow-y-auto pb-10 custom-scrollbar pr-2">

        {/* Magic Cutout / Remove */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Magic Cutout</span>

            <div className="bg-purple-500/10 border-purple-500/20 border rounded-xl p-4 flex flex-col gap-4">
                <p className="text-xs text-purple-600 dark:text-purple-200/80 leading-relaxed">
                    Automatically detect the main subject and remove the background or person. Runs entirely in your browser.
                </p>

                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setBgRemovalTarget('background')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      bgRemovalTarget === 'background'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Background
                  </button>
                  <button
                    onClick={() => setBgRemovalTarget('person')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      bgRemovalTarget === 'person'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Person
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Target Opacity</span>
                    <span className="text-xs text-slate-500">{bgRemovalOpacity}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bgRemovalOpacity}
                    onChange={(e) => setBgRemovalOpacity(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <button
                  onClick={handleBackgroundRemoval}
                  disabled={isProcessingRemoval || isProcessingBlur}
                  className={`w-full py-2.5 rounded font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    isProcessingRemoval
                        ? 'bg-purple-600/50 text-slate-900 dark:text-white/50 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)]'
                  }`}
                >
                    {isProcessingRemoval ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing Image...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 2v6h6M21.5 22v-6h-6"/><path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"/></svg>
                            Remove {bgRemovalTarget === 'background' ? 'Background' : 'Person'}
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Depth Blur */}
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Depth Blur</span>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex flex-col gap-4">
                <p className="text-xs text-yellow-700 dark:text-yellow-200/80 leading-relaxed">
                    Create a deep depth-of-field effect by intelligently blurring the background or subject.
                </p>

                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setBgBlurTarget('background')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      bgBlurTarget === 'background'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Background
                  </button>
                  <button
                    onClick={() => setBgBlurTarget('person')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      bgBlurTarget === 'person'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Person
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Blur Intensity</span>
                    <span className="text-xs text-slate-500">{bgBlurIntensity}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={bgBlurIntensity}
                    onChange={(e) => setBgBlurIntensity(parseInt(e.target.value))}
                    className="w-full accent-yellow-500"
                  />
                </div>

                <button
                  onClick={handleBackgroundBlur}
                  disabled={isProcessingRemoval || isProcessingBlur}
                  className={`w-full py-2.5 rounded font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    isProcessingBlur
                        ? 'bg-yellow-600/50 text-slate-900 dark:text-white/50 cursor-not-allowed'
                        : 'bg-yellow-600 hover:bg-yellow-500 text-slate-900 dark:text-white shadow-[0_4px_15px_rgba(255,215,0,0.3)]'
                  }`}
                >
                    {isProcessingBlur ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Blurring...
                        </>
                    ) : (
                        <>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m22 2-2 2"/><path d="m2 22 2-2"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M22 12h-2"/><path d="M4 12H2"/></svg>
                           Blur {bgBlurTarget === 'background' ? 'Background' : 'Person'}
                        </>
                    )}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}
