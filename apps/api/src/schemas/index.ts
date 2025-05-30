import { z } from 'zod'

export const nameSchema = z.string().min(1, 'Name is required')

export const updateFileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required')
})

export const deleteFileSchema = z.object({ id: z.string().uuid() })

export const querySchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional()
  // dateFrom: z.string().optional(),
  // dateTo: z.string().optional()
})
