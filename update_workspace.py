import re

with open('src/components/editor/EditorWorkspace.tsx', 'r') as f:
    content = f.read()

# Replace the pendingText logic block
text_block_search = """  // Execute Add Text Action
  useEffect(() => {
    if (pendingText && fabricCanvas && mainImage) {

      const textObj = new fabric.IText(pendingText, {
        left: mainImage.left!,
        top: mainImage.top!,
        originX: 'center',
        originY: 'center',
        fontFamily: 'system-ui, sans-serif',
        fontSize: pendingText.includes('Title') ? 80 : 40,
        fontWeight: pendingText.includes('Title') ? 'bold' : 'normal',
        fill: '#ffffff',
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.5)',
          blur: 10,
          offsetX: 2,
          offsetY: 2
        }),
        transparentCorners: false,
        cornerColor: '#3b82f6',
        cornerSize: 12,
      });

      fabricCanvas.add(textObj);
      fabricCanvas.setActiveObject(textObj);
      fabricCanvas.requestRenderAll();

      clearAddText();
    }
  }, [pendingText, fabricCanvas, mainImage, clearAddText]);"""

text_block_replace = """  // Execute Add Text Action
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
        cornerColor: '#3b82f6',
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
  }, [pendingText, fabricCanvas, mainImage, clearAddText]);"""

content = content.replace(text_block_search, text_block_replace)

shape_block_search = """  // Execute Add Shape Action
  useEffect(() => {
    if (pendingShape && fabricCanvas && mainImage) {

      const commonProps = {
        left: mainImage.left!,
        top: mainImage.top!,
        originX: 'center',
        originY: 'center',
        fill: '#3b82f6', // Default brand blue
        transparentCorners: false,
        cornerColor: '#ffffff',
        cornerStrokeColor: '#3b82f6',
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
          shapeObj = new fabric.Rect({ ...commonProps, width: size, height: size, rx: 16, ry: 16 });
          break;
        case 'circle':
          shapeObj = new fabric.Circle({ ...commonProps, radius: size / 2 });
          break;
        case 'triangle':
          shapeObj = new fabric.Triangle({ ...commonProps, width: size, height: size });
          break;
        case 'star':
          // Approximating a star with a polygon for simplicity in standard fabric
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
      }

      if (shapeObj) {
        fabricCanvas.add(shapeObj);
        fabricCanvas.setActiveObject(shapeObj);
        fabricCanvas.requestRenderAll();
      }

      clearAddShape();
    }
  }, [pendingShape, fabricCanvas, mainImage, clearAddShape]);"""

shape_block_replace = """  // Execute Add Shape Action
  useEffect(() => {
    if (pendingShape && fabricCanvas && mainImage) {

      const commonProps = {
        left: mainImage.left!,
        top: mainImage.top!,
        originX: 'center',
        originY: 'center',
        fill: '#3b82f6', // Default brand blue
        transparentCorners: false,
        cornerColor: '#ffffff',
        cornerStrokeColor: '#3b82f6',
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
          shapeObj = new fabric.Line([-size, 0, size, 0], { ...commonProps, fill: 'transparent', stroke: '#3b82f6', strokeWidth: 10 });
          break;
        case 'dashed-line':
          shapeObj = new fabric.Line([-size, 0, size, 0], { ...commonProps, fill: 'transparent', stroke: '#3b82f6', strokeWidth: 10, strokeDashArray: [20, 10] });
          break;
        case 'arrow':
          shapeObj = new fabric.Path('M 0 0 L 100 0 M 100 0 L 80 -20 M 100 0 L 80 20', { ...commonProps, fill: 'transparent', stroke: '#3b82f6', strokeWidth: 10 });
          break;
        case 'double-arrow':
          shapeObj = new fabric.Path('M 0 0 L 100 0 M 100 0 L 80 -20 M 100 0 L 80 20 M 0 0 L 20 -20 M 0 0 L 20 20', { ...commonProps, fill: 'transparent', stroke: '#3b82f6', strokeWidth: 10 });
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
  }, [pendingShape, fabricCanvas, mainImage, clearAddShape]);"""

content = content.replace(shape_block_search, shape_block_replace)

with open('src/components/editor/EditorWorkspace.tsx', 'w') as f:
    f.write(content)

print("Updated EditorWorkspace.tsx successfully.")
