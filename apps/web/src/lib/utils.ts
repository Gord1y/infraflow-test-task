import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatId(id: string) {
  if (id.length <= 8) return id
  return `${id.slice(0, 4)}...${id.slice(-4)}`
}
