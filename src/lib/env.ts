const url = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

if (!url && import.meta.env.PROD) {
  throw new Error(
    'VITE_API_URL is not set. Configure it in your build environment before building for production.'
  )
}

// Dev fallback only — never used in production (the guard above throws).
export const API_BASE_URL = url ?? 'http://localhost:8000'
