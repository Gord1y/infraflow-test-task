import { createTRPCReact } from '@trpc/react-query'

import { AppRouter } from '@/api/router'

export const trpc = createTRPCReact<AppRouter>({})
