import re

with open('src/components/editor/EditorWorkspace.tsx', 'r') as f:
    content = f.read()

# Add history state variables
search = "  const [segmenter, setSegmenter] = useState<ImageSegmenter | null>(null);"
replace = """  const [segmenter, setSegmenter] = useState<ImageSegmenter | null>(null);

  // History State
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const isHistoryAction = useRef(false);

  const saveHistory = useCallback(() => {
    if (!fabricCanvas || isHistoryAction.current) return;

    const json = JSON.stringify(fabricCanvas.toJSON());

    setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(json);
        // Keep last 20 states to prevent massive memory usage
        if (newHistory.length > 20) newHistory.shift();
        return newHistory;
    });

    setHistoryIndex(prev => {
        return Math.min(prev + 1, 19); // max index 19
    });
  }, [fabricCanvas, historyIndex]);

  // Hook into canvas modifications to save history
  useEffect(() => {
    if (!fabricCanvas) return;

    const events = ['object:added', 'object:removed', 'object:modified'];
    events.forEach(e => fabricCanvas.on(e, saveHistory));

    return () => {
        events.forEach(e => fabricCanvas.off(e, saveHistory));
    }
  }, [fabricCanvas, saveHistory]);"""

content = content.replace(search, replace)

# Add undo/redo/zoom methods to useImperativeHandle
search2 = """  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    exportImage: () => {
      if (!fabricCanvas) return;"""

replace2 = """  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    undo: () => {
        if (!fabricCanvas || historyIndex <= 0) return;

        isHistoryAction.current = true;
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);

        fabricCanvas.loadFromJSON(history[newIndex], () => {
            fabricCanvas.requestRenderAll();
            // Re-find main image after load
            const objs = fabricCanvas.getObjects('image');
            if (objs.length > 0) setMainImage(objs[0] as fabric.Image);
            isHistoryAction.current = false;
        });
    },
    redo: () => {
        if (!fabricCanvas || historyIndex >= history.length - 1) return;

        isHistoryAction.current = true;
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);

        fabricCanvas.loadFromJSON(history[newIndex], () => {
            fabricCanvas.requestRenderAll();
            // Re-find main image after load
            const objs = fabricCanvas.getObjects('image');
            if (objs.length > 0) setMainImage(objs[0] as fabric.Image);
            isHistoryAction.current = false;
        });
    },
    zoomIn: () => {
        if (!fabricCanvas) return;
        let zoom = fabricCanvas.getZoom() * 1.1;
        if (zoom > 20) zoom = 20;
        fabricCanvas.zoomToPoint(new fabric.Point(fabricCanvas.width! / 2, fabricCanvas.height! / 2), zoom);
    },
    zoomOut: () => {
        if (!fabricCanvas) return;
        let zoom = fabricCanvas.getZoom() / 1.1;
        if (zoom < 0.05) zoom = 0.05;
        fabricCanvas.zoomToPoint(new fabric.Point(fabricCanvas.width! / 2, fabricCanvas.height! / 2), zoom);
    },
    getZoom: () => {
        return fabricCanvas ? Math.round(fabricCanvas.getZoom() * 100) : 100;
    },
    exportImage: () => {
      if (!fabricCanvas) return;"""

content = content.replace(search2, replace2)

# Save initial state when main image loads
search3 = """      setMainImage(img);

      // --- Selection Event Handling ---"""
replace3 = """      setMainImage(img);

      // Save initial state
      setTimeout(() => {
          if (!isHistoryAction.current) {
              const json = JSON.stringify(canvas.toJSON());
              setHistory([json]);
              setHistoryIndex(0);
          }
      }, 100);

      // --- Selection Event Handling ---"""

content = content.replace(search3, replace3)


with open('src/components/editor/EditorWorkspace.tsx', 'w') as f:
    f.write(content)

print("Done")
