import { create } from 'zustand';

export interface GeometryState {
  rotation: number;     // 0-360
  flipX: boolean;
  flipY: boolean;
  straighten: number;   // -45 to 45
  aspectRatio: number | 'free'; 
  skewX: number;
  skewY: number;
}

export interface WebGLAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  warmth: number;
  tint: number;
  highlights: number;
  shadows: number;
  vibrance: number;
  sharpness: number;
  vignette: number;
  blur: number;
  noise: number;
}

const defaultAdjustments: WebGLAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  warmth: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  vibrance: 0,
  sharpness: 0,
  vignette: 0,
  blur: 0,
  noise: 0,
};

const defaultGeometry: GeometryState = {
  rotation: 0,
  flipX: false,
  flipY: false,
  straighten: 0,
  aspectRatio: 'free',
  skewX: 0,
  skewY: 0,
};

interface EditorStore {
  activeTool: 'adjust' | 'filters' | 'crop' | 'overlays' | 'ai';
  adjustments: WebGLAdjustments;
  geometry: GeometryState;
  
  setActiveTool: (tool: EditorStore['activeTool']) => void;
  setAdjustment: (key: keyof WebGLAdjustments, value: number) => void;
  resetAdjustments: () => void;
  
  setGeometry: (key: keyof GeometryState, value: any) => void;
  resetGeometry: () => void;
  
  pendingCrop: boolean;
  triggerCrop: () => void;
  clearCropTrigger: () => void;
  
  // Overlays
  pendingText: string | null;
  triggerAddText: (text?: string) => void;
  clearAddText: () => void;
  
  pendingShape: 'rect' | 'circle' | 'triangle' | 'star' | 'polygon' | null;
  triggerAddShape: (shape: 'rect' | 'circle' | 'triangle' | 'star' | 'polygon') => void;
  clearAddShape: () => void;
  
  // Selection State
  selectedObjectId: string | null;
  selectedObjectType: 'text' | 'shape' | 'image' | null;
  setSelectedObject: (id: string | null, type: 'text' | 'shape' | 'image' | null) => void;
  
  // Local AI
  pendingBgRemoval: boolean;
  triggerBgRemoval: () => void;
  clearBgRemoval: () => void;
  
  pendingBgBlur: boolean;
  triggerBgBlur: () => void;
  clearBgBlur: () => void;
  
  // Drawing Mode
  isDrawingMode: boolean;
  setDrawingMode: (isDrawing: boolean) => void;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushWidth: number;
  setBrushWidth: (width: number) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  activeTool: 'adjust', // Default tab
  adjustments: { ...defaultAdjustments },
  geometry: { ...defaultGeometry },
  pendingCrop: false,
  pendingText: null,
  pendingShape: null,
  
  setActiveTool: (tool) => set({ activeTool: tool }),
  setAdjustment: (key, value) => 
    set((state) => ({
      adjustments: {
        ...state.adjustments,
        [key]: value
      }
    })),
  resetAdjustments: () => set({ adjustments: { ...defaultAdjustments } }),
  
  setGeometry: (key, value) => 
    set((state) => ({
      geometry: {
        ...state.geometry,
        [key]: value
      }
    })),
  resetGeometry: () => set({ geometry: { ...defaultGeometry } }),
  
  triggerCrop: () => set({ pendingCrop: true }),
  clearCropTrigger: () => set({ pendingCrop: false }),
  
  triggerAddText: (text = 'Double click to edit') => set({ pendingText: text }),
  clearAddText: () => set({ pendingText: null }),
  
  triggerAddShape: (shape) => set({ pendingShape: shape }),
  clearAddShape: () => set({ pendingShape: null }),
  
  selectedObjectId: null,
  selectedObjectType: null,
  setSelectedObject: (id, type) => set({ selectedObjectId: id, selectedObjectType: type }),
  
  pendingBgRemoval: false,
  triggerBgRemoval: () => set({ pendingBgRemoval: true }),
  clearBgRemoval: () => set({ pendingBgRemoval: false }),
  
  pendingBgBlur: false,
  triggerBgBlur: () => set({ pendingBgBlur: true }),
  clearBgBlur: () => set({ pendingBgBlur: false }),
  
  isDrawingMode: false,
  setDrawingMode: (isDrawing) => set({ isDrawingMode: isDrawing }),
  brushColor: '#3b82f6',
  setBrushColor: (color) => set({ brushColor: color }),
  brushWidth: 5,
  setBrushWidth: (width) => set({ brushWidth: width }),
}));
