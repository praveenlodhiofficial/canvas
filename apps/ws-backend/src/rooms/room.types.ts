import { CanvasShape } from "@repo/shared/types";

export type ClientMessage =
  | {
      type: "shape:add" | "shape:update";
      payload: CanvasShape;
    }
  | {
      type: "shape:delete";
      payload: { id: string };
    };

export type ServerMessage =
  | {
      type: "room:init";
      payload: CanvasShape[];
    }
  | {
      type: "shape:broadcast";
      payload: CanvasShape;
    };
