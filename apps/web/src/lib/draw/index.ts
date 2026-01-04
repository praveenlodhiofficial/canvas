export async function initDraw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error(
      "Failed to get 2D context. Check if the canvas is properly initialized.",
    );
    return;
  }

  // Device Pixel Ratio
  const dpr = window.devicePixelRatio || 1;

  // Get the canvas bounding client rect
  const rect = canvas.getBoundingClientRect();
  console.log(rect);

  // Set the canvas width and height
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Scale the context to the device pixel ratio
  ctx.scale(dpr, dpr);

  // Mouse events
  let clicked = false;
  let posX1 = 0;
  let posY1 = 0;
  let posX2 = 0;
  let posY2 = 0;

  // Mouse down event - set the starting position
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    posX1 = e.clientX - rect.left;
    posY1 = e.clientY - rect.top;
    console.log(`mouse down at ${posX1}, ${posY1}`);
  });

  // Mouse move event - draw the rectangle
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      posX2 = e.clientX - rect.left;
      posY2 = e.clientY - rect.top;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeRect(posX1, posY1, posX2 - posX1, posY2 - posY1);
    }
  });

  // Mouse up event -  clear the rectangle
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    posX2 = e.clientX - rect.left;
    posY2 = e.clientY - rect.top;
    console.log(`mouse up at ${posX2}, ${posY2}`);
  });
}
