import z from "zod";

import {
  isClassName,
  isPCID,
  isSessionID,
  isSpeciesName,
  isWebURL,
} from "./data.js";

export const zClassLevel = z.object({
  name: z.string().refine(isClassName),
  level: z.number(),
  subclass: z.optional(z.string()),
});
export type ClassLevel = z.infer<typeof zClassLevel>;

export const pcPrefix = "pc:";

export const zPCID = z.string().startsWith(pcPrefix).refine(isPCID);
export const zPC = z.object({
  id: zPCID,
  name: z.string(),
  shortName: z.string().optional(),
  player: z.string(),
  species: z.string().refine(isSpeciesName),
  beyondUrl: z
    .string()
    .url()
    .startsWith(
      "https://www.dndbeyond.com/characters",
      "beyond URL looks wrong",
    )
    .refine(isWebURL),
  classLevels: z.array(zClassLevel).min(1, "must have at least one class"),
});
export type PC = z.infer<typeof zPC>;

export const sessionPrefix = "session:";

export const zSessionID = z
  .string()
  .startsWith(sessionPrefix)
  .refine(isSessionID);
export const zSession = z.object({
  id: zSessionID,
  name: z.string(),
  date: z.string().date(),
  dm: z.string(),
  pcs: z.array(zPCID),
});
export type Session = z.infer<typeof zSession>;

export function formatZodError<T>(error: z.ZodError<T>) {
  const flat = error.flatten();
  const errors = flat.formErrors;

  for (const v of Object.values(flat.fieldErrors))
    if (v) errors.push(...(v as string[]));

  return errors.join("\n");
}
