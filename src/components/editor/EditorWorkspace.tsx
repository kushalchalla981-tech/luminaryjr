import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as fabric from 'fabric';
import { ImageSegmenter, FilesetResolver } from '@mediapipe/tasks-vision';
import { useEditorStore } from '../../store/editorStore';

interface EditorWorkspaceProps {
  imageUrl: string;
}

export interface EditorWorkspaceRef {
  exportImage: () => void;
  getCanvas: () => fabric.Canvas | null;
}

export const EditorWorkspace = forwardRef<EditorWorkspaceRef, EditorWorkspaceProps>(({ imageUrl }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [mainImage, setMainImage] = useState<fabric.Image | null>(null);
  
  const adjustments = useEditorStore((state) => state.adjustments);
  const geometry = useEditorStore((state) => state.geometry);
  const activeTool = useEditorStore((state) => state.activeTool);
  
  const pendingCrop = useEditorStore((state) => state.pendingCrop);
  const clearCropTrigger = useEditorStore((state) => state.clearCropTrigger);
  
  const pendingText = useEditorStore((state) => state.pendingText);
  const clearAddText = useEditorStore((state) => state.clearAddText);
  
  const pendingShape = useEditorStore((state) => state.pendingShape);
  const clearAddShape = useEditorStore((state) => state.clearAddShape);
  
  const setSelectedObject = useEditorStore((state) => state.setSelectedObject);

  const pendingBgRemoval = useEditorStore((state) => state.pendingBgRemoval);
  const clearBgRemoval = useEditorStore((state) => state.clearBgRemoval);
  
  const pendingBgBlur = useEditorStore((state) => state.pendingBgBlur);
  const clearBgBlur = useEditorStore((state) => state.clearBgBlur);
  
  const isDrawingMode = useEditorStore((state) => state.isDrawingMode);
  const brushColor = useEditorStore((state) => state.brushColor);
  const brushWidth = useEditorStore((state) => state.brushWidth);

  const [cropRect, setCropRect] = useState<fabric.Rect | null>(null);
  const [segmenter, setSegmenter] = useState<ImageSegmenter | null>(null);

  // Initialize MediaPipe AI Model on load
  useEffect(() => {
    const initModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
            delegate: "GPU"
          },
          runningMode: "IMAGE",
          outputCategoryMask: true,
          outputConfidenceMasks: false
        });
        setSegmenter(imageSegmenter);
        console.log("MediaPipe Selfie Segmenter loaded.");
      } catch (err) {
        console.error("Failed to load MediaPipe model:", err);
      }
    };
    initModel();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const { clientWidth, clientHeight } = containerRef.current;

    // Initialize Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: clientWidth,
      height: clientHeight,
      selection: true, // Allow selecting multiple objects later
      preserveObjectStacking: true, // Don't bring selected objects to front automatically
      backgroundColor: 'transparent'
    });

    setFabricCanvas(canvas);

    // Initial Image Load
    fabric.Image.fromURL(imageUrl, { crossOrigin: 'anonymous' }).then((img) => {
      // Scale image to fit within canvas bounds with 40px padding
      const padding = 80;
      const scaleX = (clientWidth - padding) / img.width!;
      const scaleY = (clientHeight - padding) / img.height!;
      const scale = Math.min(scaleX, scaleY);

      img.set({
        scaleX: scale,
        scaleY: scale,
        left: clientWidth / 2,
        top: clientHeight / 2,
        originX: 'center',
        originY: 'center',
        selectable: false, // The base image shouldn't be movable yet
        hoverCursor: 'default'
      });

      // We add it to the canvas
      canvas.add(img);
      canvas.centerObject(img);
      canvas.renderAll();
      
      setMainImage(img);

      // --- Selection Event Handling ---
      const handleSelection = (e: { selected?: fabric.Object[] }) => {
        const activeObj = e.selected?.[0];
        if (!activeObj) {
           setSelectedObject(null, null);
           return;
        }
        
        // Don't treat the main image or the crop rect as a selectable "Overlay" property panel 
        if (activeObj === img || (activeObj as any).strokeDashArray?.length) {
            setSelectedObject(null, null);
            return;
        }

        const type = activeObj.type;
        const id = (activeObj as any).id || Math.random().toString(36).substring(7);
        (activeObj as any).id = id; // ensure it has an ID

        if (type === 'i-text' || type === 'text') {
            setSelectedObject(id, 'text');
        } else {
            setSelectedObject(id, 'shape');
        }
      };

      const handleDeselect = () => {
         setSelectedObject(null, null);
      };

      canvas.on('selection:created', handleSelection);
      canvas.on('selection:updated', handleSelection);
      canvas.on('selection:cleared', handleDeselect);

    });

    // Handle Window Resize
    const handleResize = () => {
      if (containerRef.current && canvas) {
        // Just resize the viewport, don't change object scales
        canvas.setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);

    // Pan & Zoom Controls logic
    canvas.on('mouse:wheel', function(opt) {
      const e = opt.e as WheelEvent;
      if (e.altKey) {
        const delta = e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.05) zoom = 0.05;
        
        // Zoom to pointer
        canvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), zoom);
        e.preventDefault();
        e.stopPropagation();
      }
    });

    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    canvas.on('mouse:down', function(opt) {
      const evt = opt.e as MouseEvent;
      // Spacebar or Middle Click to pan
      if (evt.button === 1 || evt.altKey) {
        isDragging = true;
        canvas.selection = false;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
      }
    });

    canvas.on('mouse:move', function(opt) {
      if (isDragging) {
        const e = opt.e as MouseEvent;
        const vpt = canvas.viewportTransform;
        vpt![4] += e.clientX - lastPosX;
        vpt![5] += e.clientY - lastPosY;
        canvas.requestRenderAll();
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      }
    });

    canvas.on('mouse:up', function() {
      canvas.setViewportTransform(canvas.viewportTransform!);
      isDragging = false;
      canvas.selection = true;
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [imageUrl]);

  // Apply Filters when adjustments change
  useEffect(() => {
    if (!mainImage || !fabricCanvas) return;

    // Reset filters
    mainImage.filters = [];

    // 1. Brightness (-100 to 100 maps to -1 to 1)
    if (adjustments.brightness !== 0) {
      mainImage.filters.push(new fabric.filters.Brightness({ brightness: adjustments.brightness / 100 }));
    }

    // 2. Contrast (-100 to 100 maps to -1 to 1)
    if (adjustments.contrast !== 0) {
      mainImage.filters.push(new fabric.filters.Contrast({ contrast: adjustments.contrast / 100 }));
    }

    // 3. Saturation (-100 to 100 maps to -1 to 1)
    if (adjustments.saturation !== 0) {
      mainImage.filters.push(new fabric.filters.Saturation({ saturation: adjustments.saturation / 100 }));
    }
    
    // 4. Vibrance (-100 to 100 maps to -1 to 1)
    if (adjustments.vibrance !== 0) {
      mainImage.filters.push(new fabric.filters.Vibrance({ vibrance: adjustments.vibrance / 100 }));
    }
    
    // 5. Blur (0 to 100)
    if (adjustments.blur > 0) {
      mainImage.filters.push(new fabric.filters.Blur({ blur: adjustments.blur / 50 }));
    }
    
    // 6. Noise (0 to 100)
    if (adjustments.noise > 0) {
      mainImage.filters.push(new fabric.filters.Noise({ noise: adjustments.noise * 5 }));
    }

    // 7. Exposure (Simulated via ColorMatrix multiplier)
    if (adjustments.exposure !== 0) {
      // Exposure roughly multiplies the pixel values.
      // 0 to 100 maps to 1x to 2x. -100 to 0 maps to 0x to 1x.
      const exp = Math.pow(2, adjustments.exposure / 100);
      mainImage.filters.push(new fabric.filters.ColorMatrix({
        matrix: [
          exp, 0, 0, 0, 0,
          0, exp, 0, 0, 0,
          0, 0, exp, 0, 0,
          0, 0, 0, 1, 0,
        ]
      }));
    }

    // 8. Warmth and Tint
    if (adjustments.warmth !== 0 || adjustments.tint !== 0) {
      const w = adjustments.warmth / 300; // red up, blue down
      const t = adjustments.tint / 300;   // green up
      
      mainImage.filters.push(new fabric.filters.ColorMatrix({
        matrix: [
          1 + w, 0, 0, 0, 0,
          0, 1 + t, 0, 0, 0,
          0, 0, 1 - w, 0, 0,
          0, 0, 0, 1, 0,
        ]
      }));
    }

    // 9. Highlights & Shadows (Simplified gamma approximations)
    if (adjustments.highlights !== 0 || adjustments.shadows !== 0) {
      // Since precise non-linear curves require custom WebGL shaders, 
      // we use Gamma as a rough approximation for highlights/shadows.
      // Shadows -> lower gamma (lightens darks), Highlights -> high gamma (darkens brights)
      const gammaY = 1 - (adjustments.shadows / 200) + (adjustments.highlights / 200);
      mainImage.filters.push(new fabric.filters.Gamma({
        gamma: [gammaY, gammaY, gammaY]
      }));
    }
    
    // Apply the filters to the pixel data
    mainImage.applyFilters();
    fabricCanvas.requestRenderAll();

  }, [adjustments, mainImage, fabricCanvas]);

  // Apply Geometry Transforms when geometry changes
  useEffect(() => {
    if (!mainImage || !fabricCanvas) return;
    
    // Combine Rotation and Straighten for final angle
    const finalAngle = geometry.rotation + geometry.straighten;
    
    mainImage.set({
      angle: finalAngle,
      flipX: geometry.flipX,
      flipY: geometry.flipY,
      skewX: geometry.skewX,
      skewY: geometry.skewY
    });
    
    // Changing dimensions means we also need to center it or re-scale
    // But for a simple rotate, set angle is enough for Fabric.
    fabricCanvas.requestRenderAll();
  }, [geometry, mainImage, fabricCanvas]);

  // Crop Box UI Overlay
  useEffect(() => {
    if (!fabricCanvas || !mainImage) return;

    if (activeTool === 'crop') {
      if (!cropRect) {
        // Create an initial crop box taking up 50% of the image
        const imgWidth = mainImage.getScaledWidth();
        const imgHeight = mainImage.getScaledHeight();
        
        const rect = new fabric.Rect({
          left: mainImage.left! - (imgWidth / 4),
          top: mainImage.top! - (imgHeight / 4),
          width: imgWidth / 2,
          height: imgHeight / 2,
          fill: 'rgba(0,0,0,0)',
          stroke: '#FFD700',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          borderColor: '#FFD700',
          cornerColor: '#FFD700',
          cornerSize: 12,
          transparentCorners: false,
          hasBorders: true,
          hasControls: true,
        });

        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
        setCropRect(rect);
      } else {
        // Handle Aspect Ratio enforcement if picking from sidebar
        if (geometry.aspectRatio !== 'free') {
           let ratio = 1;
           if (geometry.aspectRatio === 'original') {
             // Calculate original ratio
             ratio = mainImage.getScaledWidth() / mainImage.getScaledHeight();
           } else {
             ratio = geometry.aspectRatio as number;
           }

           const currentW = cropRect.getScaledWidth();
           cropRect.set({ height: currentW / ratio });
           fabricCanvas.requestRenderAll();
        }
      }
    } else {
      if (cropRect) {
        fabricCanvas.remove(cropRect);
        setCropRect(null);
      }
    }
  }, [activeTool, fabricCanvas, mainImage, geometry.aspectRatio]); 

  // Execute the Crop Action
  useEffect(() => {
    if (pendingCrop && fabricCanvas && mainImage && cropRect) {
      const scaleX = mainImage.scaleX || 1;
      const scaleY = mainImage.scaleY || 1;

      // Coordinates of the crop box relative to the top-left of the scaled image
      const leftOffset = cropRect.left! - (mainImage.left! - (mainImage.getScaledWidth() / 2));
      const topOffset = cropRect.top! - (mainImage.top! - (mainImage.getScaledHeight() / 2));
      
      const currentCropX = mainImage.cropX || 0;
      const currentCropY = mainImage.cropY || 0;
      
      mainImage.set({
        cropX: currentCropX + (leftOffset / scaleX),
        cropY: currentCropY + (topOffset / scaleY),
        width: cropRect.getScaledWidth() / scaleX,
        height: cropRect.getScaledHeight() / scaleY,
      });

      // Recenter the image after cropping
      fabricCanvas.centerObject(mainImage);
      
      // Cleanup the crop box 
      fabricCanvas.remove(cropRect);
      setCropRect(null);
      fabricCanvas.requestRenderAll();

      clearCropTrigger();
    }
  }, [pendingCrop, fabricCanvas, mainImage, cropRect, clearCropTrigger]);

  // Execute Add Text Action
  useEffect(() => {
    if (pendingText && fabricCanvas && mainImage) {
      const { text, type } = pendingText;
      
      let textProps: fabric.ITextOptions = {
        left: mainImage.left!,
        top: mainImage.top!,
        originX: 'center',
        originY: 'center',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 40,
        fill: '#ffffff',
        transparentCorners: false,
        cornerColor: '#FFD700',
        cornerSize: 12,
      };

      // Apply styles based on type
      if (type === 'title') {
        textProps.fontSize = 80;
        textProps.fontWeight = 'bold';
      } else if (type === 'subtitle') {
        textProps.fontSize = 50;
        textProps.fontWeight = '600';
      } else if (type === 'caption' || type === 'date' || type === 'location') {
        textProps.fontSize = 24;
        textProps.fontWeight = '300';
      } else if (type === 'neon') {
        textProps.fill = '#f472b6'; // Pink
        textProps.fontWeight = 'bold';
        textProps.shadow = new fabric.Shadow({ color: '#f472b6', blur: 20, offsetX: 0, offsetY: 0 });
      } else if (type === 'outline') {
        textProps.fill = 'transparent';
        textProps.stroke = '#ffffff';
        textProps.strokeWidth = 2;
        textProps.fontWeight = 'bold';
        textProps.fontSize = 60;
      } else if (type === 'shadow') {
        textProps.fontWeight = 'bold';
        textProps.shadow = new fabric.Shadow({ color: 'rgba(0,0,0,0.8)', blur: 5, offsetX: 5, offsetY: 5 });
      } else if (type === 'textbox') {
        textProps.backgroundColor = '#ffffff';
        textProps.fill = '#000000';
        textProps.padding = 10;
        textProps.fontWeight = 'bold';
      } else if (type === 'transparent-textbox') {
        textProps.backgroundColor = 'rgba(0,0,0,0.5)';
        textProps.padding = 10;
      } else if (type === 'watermark') {
        textProps.opacity = 0.3;
        textProps.fontWeight = 'bold';
        textProps.fontSize = 100;
        textProps.angle = -45;
      } else if (type === 'handwriting') {
        textProps.fontFamily = 'cursive'; // Or a specific web font if loaded
        textProps.fontStyle = 'italic';
        textProps.fontSize = 60;
      } else if (type === 'gradient') {
        // Simple fallback for gradient text if gradient object fails
        textProps.fontWeight = 'bold';
        textProps.fontSize = 60;
      } else if (type === 'sticker' || type === 'emoji') {
         textProps.fontSize = 80;
      }

      const textObj = new fabric.IText(text, textProps);

      // Apply proper gradient object if gradient type
      if (type === 'gradient') {
          const grad = new fabric.Gradient({
             type: 'linear',
             coords: { x1: 0, y1: 0, x2: textObj.width!, y2: 0 },
             colorStops: [
                 { offset: 0, color: '#c084fc' }, // purple-400
                 { offset: 1, color: '#db2777' }  // pink-600
             ]
          });
          textObj.set('fill', grad);
      }

      fabricCanvas.add(textObj);
      fabricCanvas.setActiveObject(textObj);
      fabricCanvas.requestRenderAll();
      
      clearAddText();
    }
  }, [pendingText, fabricCanvas, mainImage, clearAddText]);

  // Execute Add Shape Action
  useEffect(() => {
    if (pendingShape && fabricCanvas && mainImage) {
      
      const commonProps = {
        left: mainImage.left!,
        top: mainImage.top!,
        originX: 'center',
        originY: 'center',
        fill: '#FFD700', // Default brand blue
        transparentCorners: false,
        cornerColor: '#ffffff',
        cornerStrokeColor: '#FFD700',
        borderColor: '#ffffff',
        cornerSize: 12,
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.3)',
          blur: 15,
          offsetX: 0,
          offsetY: 10
        })
      } as const;

      let shapeObj: fabric.Object | null = null;
      const size = 150;

      switch (pendingShape) {
        case 'rect':
          shapeObj = new fabric.Rect({ ...commonProps, width: size * 1.5, height: size });
          break;
        case 'square':
          shapeObj = new fabric.Rect({ ...commonProps, width: size, height: size });
          break;
        case 'rounded-rect':
          shapeObj = new fabric.Rect({ ...commonProps, width: size * 1.5, height: size, rx: 20, ry: 20 });
          break;
        case 'circle':
          shapeObj = new fabric.Circle({ ...commonProps, radius: size / 2 });
          break;
        case 'oval':
          shapeObj = new fabric.Ellipse({ ...commonProps, rx: size, ry: size / 2 });
          break;
        case 'triangle':
          shapeObj = new fabric.Triangle({ ...commonProps, width: size, height: size });
          break;
        case 'diamond':
          shapeObj = new fabric.Rect({ ...commonProps, width: size, height: size, angle: 45 });
          break;
        case 'star':
          shapeObj = new fabric.Polygon([
            {x: 75, y: 0}, {x: 98, y: 46}, {x: 150, y: 53}, 
            {x: 112, y: 90}, {x: 121, y: 142}, {x: 75, y: 118}, 
            {x: 28, y: 142}, {x: 37, y: 90}, {x: 0, y: 53}, 
            {x: 51, y: 46}
          ], { ...commonProps });
          break;
        case 'polygon': // Hexagon
          shapeObj = new fabric.Polygon([
            {x: 37.5, y: 0}, {x: 112.5, y: 0}, {x: 150, y: 65}, 
            {x: 112.5, y: 130}, {x: 37.5, y: 130}, {x: 0, y: 65}
          ], { ...commonProps });
          break;
        case 'line':
          shapeObj = new fabric.Line([-size, 0, size, 0], { ...commonProps, fill: 'transparent', stroke: '#FFD700', strokeWidth: 10 });
          break;
        case 'dashed-line':
          shapeObj = new fabric.Line([-size, 0, size, 0], { ...commonProps, fill: 'transparent', stroke: '#FFD700', strokeWidth: 10, strokeDashArray: [20, 10] });
          break;
        case 'arrow':
          shapeObj = new fabric.Path('M 0 0 L 100 0 M 100 0 L 80 -20 M 100 0 L 80 20', { ...commonProps, fill: 'transparent', stroke: '#FFD700', strokeWidth: 10 });
          break;
        case 'double-arrow':
          shapeObj = new fabric.Path('M 0 0 L 100 0 M 100 0 L 80 -20 M 100 0 L 80 20 M 0 0 L 20 -20 M 0 0 L 20 20', { ...commonProps, fill: 'transparent', stroke: '#FFD700', strokeWidth: 10 });
          break;
        case 'frame':
          shapeObj = new fabric.Rect({ ...commonProps, width: size * 1.5, height: size * 1.5, fill: 'transparent', stroke: '#ffffff', strokeWidth: 15 });
          break;
        case 'highlight':
          shapeObj = new fabric.Rect({ ...commonProps, width: size * 2, height: size / 2, fill: 'rgba(250, 204, 21, 0.5)', shadow: undefined });
          break;
        case 'heart':
          shapeObj = new fabric.Path('M 272.70141,238.71731 C 206.46141,238.71731 152.70146,292.4773 152.70146,358.71731 C 152.70146,493.47282 288.63461,528.80451 381.26391,662.02535 C 468.83815,529.62199 609.82641,489.17075 609.82641,358.71731 C 609.82641,292.47731 556.06651,238.7173 489.82641,238.71731 C 441.77851,238.71731 400.42481,267.08774 381.26391,307.90481 C 362.10311,267.08773 320.74931,238.7173 272.70141,238.71731 z ', { ...commonProps, scaleX: 0.3, scaleY: 0.3 });
          break;
        case 'callout':
          shapeObj = new fabric.Path('M 0 0 L 100 0 L 100 80 L 60 80 L 40 120 L 40 80 L 0 80 Z', { ...commonProps });
          break;
      }

      if (shapeObj) {
        fabricCanvas.add(shapeObj);
        fabricCanvas.setActiveObject(shapeObj);
        fabricCanvas.requestRenderAll();
      }
      
      clearAddShape();
    }
  }, [pendingShape, fabricCanvas, mainImage, clearAddShape]);

  // Execute Background Removal Action (Local AI via MediaPipe)
  useEffect(() => {
    if (pendingBgRemoval && fabricCanvas && mainImage && segmenter) {
      
      const removeBg = async () => {
        try {
            // Get original image element
            const imgElement = mainImage.getElement() as HTMLImageElement;
            
            // Run inference
            const segmentationResult = await segmenter.segment(imgElement);
            const categoryMask = segmentationResult.categoryMask;
            
            if (!categoryMask) {
                clearBgRemoval();
                return;
            }

            // Create a temporary canvas to draw the raw image
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = imgElement.width;
            tempCanvas.height = imgElement.height;
            const ctx = tempCanvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;
            
            ctx.drawImage(imgElement, 0, 0);
            
            // Extract Pixel Data
            const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const maskData = categoryMask.getAsFloat32Array();

            // The model outputs 1 for body, 0 for background. 
            // We loop over all pixels and set Alpha = 0 where mask == 0
            for (let i = 0; i < maskData.length; i++) {
                // maskData[i] is a float roughly around 0.0 (bg) to 1.0 (fg)
                // Thresholding it
                if (maskData[i] < 0.5) {
                    const pixelIndex = i * 4;
                    imageData.data[pixelIndex + 3] = 0; // Set Alpha channel completely transparent
                }
            }
            
            // Put modified array back to canvas
            ctx.putImageData(imageData, 0, 0);
            
            // Overwrite fabric image with new transparent source
            const newDataUrl = tempCanvas.toDataURL('image/png');
            
            fabricInternalUpdateImageSrc(mainImage, newDataUrl, fabricCanvas, clearBgRemoval);

        } catch (err) {
            console.error("Background removal failed:", err);
            clearBgRemoval();
        }
      };

      removeBg();
    } else if (pendingBgRemoval && !segmenter) {
        console.warn("Segmenter not loaded yet!");
        clearBgRemoval();
    }
  }, [pendingBgRemoval, fabricCanvas, mainImage, segmenter, clearBgRemoval]);

  // Execute Background Blur Action (Local AI via MediaPipe)
  useEffect(() => {
    if (pendingBgBlur && fabricCanvas && mainImage && segmenter) {
      const applyBlur = async () => {
        try {
            const imgElement = mainImage.getElement() as HTMLImageElement;
            const segmentationResult = await segmenter.segment(imgElement);
            const categoryMask = segmentationResult.categoryMask;
            
            if (!categoryMask) {
                clearBgBlur();
                return;
            }

            // Create temp canvas for original image
            const originalCanvas = document.createElement('canvas');
            originalCanvas.width = imgElement.width;
            originalCanvas.height = imgElement.height;
            const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true });
            
            // Create temp canvas for blurred image
            const blurredCanvas = document.createElement('canvas');
            blurredCanvas.width = imgElement.width;
            blurredCanvas.height = imgElement.height;
            const blurredCtx = blurredCanvas.getContext('2d', { willReadFrequently: true });
            
            if (!originalCtx || !blurredCtx) return;
            
            originalCtx.drawImage(imgElement, 0, 0);
            
            // Draw blurred image
            blurredCtx.filter = 'blur(16px)';
            blurredCtx.drawImage(imgElement, 0, 0);
            
            const originalData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
            const blurredData = blurredCtx.getImageData(0, 0, blurredCanvas.width, blurredCanvas.height);
            const maskData = categoryMask.getAsFloat32Array();

            // Mix based on mask
            for (let i = 0; i < maskData.length; i++) {
                // maskData[i] is approx 0 for background, 1 for person
                // If background (mask < 0.5), use blurred pixel
                if (maskData[i] < 0.5) {
                    const pixelIndex = i * 4;
                    originalData.data[pixelIndex] = blurredData.data[pixelIndex];
                    originalData.data[pixelIndex + 1] = blurredData.data[pixelIndex + 1];
                    originalData.data[pixelIndex + 2] = blurredData.data[pixelIndex + 2];
                    originalData.data[pixelIndex + 3] = blurredData.data[pixelIndex + 3];
                }
            }
            
            originalCtx.putImageData(originalData, 0, 0);
            
            const newDataUrl = originalCanvas.toDataURL('image/jpeg', 0.95);
            fabricInternalUpdateImageSrc(mainImage, newDataUrl, fabricCanvas, clearBgBlur);

        } catch (err) {
             console.error("Background blur failed:", err);
             clearBgBlur();
        }
      };

      applyBlur();
    } else if (pendingBgBlur && !segmenter) {
        console.warn("Segmenter not loaded yet!");
        clearBgBlur();
    }
  }, [pendingBgBlur, fabricCanvas, mainImage, segmenter, clearBgBlur]);

  // Helper function to replace mainImage source safely
  const fabricInternalUpdateImageSrc = (img: fabric.Image, newSrc: string, canvas: fabric.Canvas, cleanup: () => void) => {
    fabric.Image.fromURL(newSrc, { crossOrigin: 'anonymous' }).then((newImg) => {
        const oldScaleX = img.scaleX;
        const oldScaleY = img.scaleY;
        const oldLeft = img.left;
        const oldTop = img.top;
        const oldAngle = img.angle;

        // Apply same transforms
        newImg.set({
            scaleX: oldScaleX,
            scaleY: oldScaleY,
            left: oldLeft,
            top: oldTop,
            angle: oldAngle,
            originX: 'center',
            originY: 'center',
            selectable: false,
            hoverCursor: 'default'
        });

        canvas.remove(img);
        canvas.add(newImg);
        // keep at bottom of stack
        canvas.sendObjectToBack(newImg);
        
        setMainImage(newImg);
        canvas.requestRenderAll();
        cleanup();
    });
  };

  // Sync Drawing Mode
  useEffect(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.isDrawingMode = isDrawingMode;
    
    if (isDrawingMode) {
        const brush = new fabric.PencilBrush(fabricCanvas);
        brush.color = brushColor;
        brush.width = brushWidth;
        fabricCanvas.freeDrawingBrush = brush;
    }
  }, [isDrawingMode, brushColor, brushWidth, fabricCanvas]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    exportImage: () => {
      if (!fabricCanvas) return;
      
      // Temporarily reset zoom and pan to get full image export
      const oldVpt = fabricCanvas.viewportTransform!.slice() as fabric.TMat2D;
      fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0] as fabric.TMat2D);
      
      // Find the image object to know its exact bounds
      const objects = fabricCanvas.getObjects('image');
      if (objects.length > 0) {
        const bgImage = objects[0];
        const dataUrl = fabricCanvas.toDataURL({
          format: 'jpeg',
          quality: 1, // Max quality
          multiplier: 1, // Required by Fabric 6 types
          left: bgImage.left! - (bgImage.getScaledWidth() / 2),
          top: bgImage.top! - (bgImage.getScaledHeight() / 2),
          width: bgImage.getScaledWidth(),
          height: bgImage.getScaledHeight()
        });
        
        // Trigger download
        const link = document.createElement('a');
        link.download = `luminary-edit-${Date.now()}.jpg`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // Restore view
      fabricCanvas.setViewportTransform(oldVpt);
    },
    getCanvas: () => fabricCanvas
  }), [fabricCanvas]);

  return (
    <div ref={containerRef} className="w-full h-full relative" id="editor-workspace">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
});
