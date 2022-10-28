/* eslint-disable import/prefer-default-export */
import { z } from "zod";

export const upsertBookSchema = z.object({
  name: z.string(),
  author: z.string(),
  summary: z.string(),
  publisher: z.string(),
  year: z.number(),
  pageCount: z.number(),
  readPage: z.number(),
  reading: z.boolean(),
});
