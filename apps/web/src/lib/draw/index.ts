import { Shape } from "@/types/shape";

export function initDraw(
  canvas: HTMLCanvasElement,
  shapes: Shape[],
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // DPR handling
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  // Clear & render shapes
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShapes(shapes, ctx);

  /* ---------------------------
   ❌ DRAWING LOGIC (DISABLED)
  ----------------------------

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", ...)
  canvas.addEventListener("mousemove", ...)
  canvas.addEventListener("mouseup", ...)
  
  ---------------------------- */
}

function drawShapes(
  shapes: Shape[],
  ctx: CanvasRenderingContext2D,
) {
  shapes.forEach((shape) => {
    switch (shape.type) {
      case "rectangle":
        ctx.strokeRect(
          shape.x,
          shape.y,
          shape.width,
          shape.height,
        );
        break;

      case "circle":
        ctx.beginPath();
        ctx.arc(
          shape.x,
          shape.y,
          shape.radius,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        break;
    }
  });
}










// import { Shape } from "@/types/shape";

// export async function initDraw(canvas: HTMLCanvasElement) {
//   const ctx = canvas.getContext("2d");
//   if (!ctx) return;

//   const shapes: Shape[] = [];

//   // DPR handling
//   const dpr = window.devicePixelRatio || 1;
//   const rect = canvas.getBoundingClientRect();

//   canvas.width = rect.width * dpr;
//   canvas.height = rect.height * dpr;
//   ctx.scale(dpr, dpr);

//   let clicked = false;
//   let startX = 0;
//   let startY = 0;

//   canvas.addEventListener("mousedown", (e) => {
//     clicked = true;
//     startX = e.clientX - rect.left;
//     startY = e.clientY - rect.top;
//   });

//   canvas.addEventListener("mousemove", (e) => {
//     if (!clicked) return;

//     const currentX = e.clientX - rect.left;
//     const currentY = e.clientY - rect.top;

//     // 1️⃣ Clear
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // 2️⃣ Map all stored shapes
//     drawShapes(shapes, ctx);

//     // 3️⃣ Draw preview rectangle
//     ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
//   });

//   canvas.addEventListener("mouseup", (e) => {
//     clicked = false;

//     const endX = e.clientX - rect.left;
//     const endY = e.clientY - rect.top;

//     shapes.push({
//       type: "rectangle",
//       x: startX,
//       y: startY,
//       width: endX - startX,
//       height: endY - startY,
//     });

//     // Final redraw
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawShapes(shapes, ctx);

//     console.log("All shapes:", shapes);
//   });
// }

// function drawShapes(shapes: Shape[], ctx: CanvasRenderingContext2D) {
//   shapes.forEach((shape) => {
//     switch (shape.type) {
//       case "rectangle":
//         ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
//         break;

//       case "circle":
//         ctx.beginPath();
//         ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
//         ctx.stroke();
//         break;
//     }
//   });
// }
