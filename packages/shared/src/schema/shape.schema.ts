import { z } from "zod";

// --------------------------------------------> SHAPE ENUM <--------------------------------------------
export const ShapeTypeSchema = z.enum(["BOX", "ELLIPSE"]);

// --------------------------------------------> BASE SHAPE SCHEMA <--------------------------------------------
export const ShapeSchema = z.object({
  id: z.string().optional(),
  roomId: z.string(),

  type: ShapeTypeSchema,

  x: z.number(),
  y: z.number(),

  width: z.number().optional(),
  height: z.number().optional(),
  radius: z.number().optional(),

  points: z
    .array(
      z.object({
        x: z.number(),
        y: z.number(),
      }),
    )
    .optional(),

  style: z
    .object({
      strokeColor: z.string().optional(),
      fillColor: z.string().optional(),
      strokeWidth: z.number().optional(),
    })
    .optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// --------------------------------------------> OTHER SHAPE SCHEMA <--------------------------------------------
export const CreateShapeSchema = ShapeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const GetShapeByIdSchema = ShapeSchema.pick({ id: true });
export const GetShapesByRoomSchema = ShapeSchema.pick({ roomId: true });
export const DeleteShapeSchema = ShapeSchema.pick({ id: true });
export const UpdateShapeSchema = ShapeSchema.pick({ id: true }).extend(
  ShapeSchema.omit({
    id: true,
    roomId: true,
    createdAt: true,
    updatedAt: true,
  }).partial().shape,
);

// --------------------------------------------> SHAPE INPUT AND OUTPUT <--------------------------------------------
export type ShapeInput = z.input<typeof ShapeSchema>;
export type Shape = z.output<typeof ShapeSchema>;

export type CreateShapeInput = z.input<typeof CreateShapeSchema>;
export type UpdateShapeInput = z.input<typeof UpdateShapeSchema>;
