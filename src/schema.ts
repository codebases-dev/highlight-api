import { z } from "zod";

export const codeSchema = z.object({
	code: z.string(),
	language: z.string(),
});

export const codesSchema = z.object({
	codes: z.array(codeSchema),
});
