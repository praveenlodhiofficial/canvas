import { z } from "zod";

export const ShapeTypeSchema = z.enum([
  "BOX",
  "ELLIPSE",
]);

export const ShapeSchema = z.object({
  id: z.uuid(),
  roomId: z.uuid(),
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

export type ShapeType = z.infer<typeof ShapeSchema>;

export const CreateShapeSchema = ShapeSchema.omit({
  id: true,
  roomId: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateShapeInput = z.infer<typeof CreateShapeSchema>;
