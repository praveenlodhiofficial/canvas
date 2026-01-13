export function renderSelectionBounds(
    ctx: CanvasRenderingContext2D,
    bounds: { x: number; y: number; width: number; height: number }
  ) {
    ctx.save();
  
    ctx.strokeStyle = "#7c7cff";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
  
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
    ctx.restore();
  }
  