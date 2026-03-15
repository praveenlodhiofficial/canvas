import { CanvasShape } from "@repo/shared/types";

/* ---------- CLIENT → SERVER ---------- */
export type ClientMessage =
  | {
      type: "shape:add";
      payload: CanvasShape;
    }
  | {
      type: "shape:update";
      payload: CanvasShape;
    }
  | {
      type: "shape:delete";
      payload: string[]; // ids
    }
  | {
      type: "cursor_move";
      x: number;
      y: number;
    }
  | {
      type: "selection_change";
      selectedShapeIds: string[];
    };

/* ---------- SERVER → CLIENT ---------- */
export type ServerMessage =
  | {
      type: "room:init";
      payload: CanvasShape[];
    }
  | {
      type: "shape:created";
      payload: CanvasShape;
    }
  | {
      type: "shape:updated";
      payload: CanvasShape;
    }
  | {
      type: "shape:deleted";
      payload: string[];
    };

// import { CanvasShape } from "@repo/shared/types";

// export type ClientMessage =
//   | {
//       type: "shape:add" | "shape:update";
//       payload: CanvasShape;
//     }
//   | {
//       type: "shape:delete";
//       payload: string[];
//     };

// export type ServerMessage =
//   | {
//       type: "room:init";
//       payload: CanvasShape[];
//     }
//   | {
//       type: "shape:broadcast";
//       payload: CanvasShape;
//     };
