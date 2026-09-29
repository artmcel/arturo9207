import { z } from 'zod';
export const ApiResponseSchema = (dataSchema) => z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    error: z
        .object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.unknown()).optional(),
    })
        .nullable(),
});
export const PaginatedResponseSchema = (itemSchema) => z.object({
    items: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
});
