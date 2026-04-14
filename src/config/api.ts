/**
 * Base URL de l'API (sans slash final).
 * - Dev recommandé : `VITE_API_URL=/api` avec le proxy Vite (voir vite.config.ts).
 * - Sinon : URL complète, ex. `https://hyper-planning.fr/api` ou `http://localhost:5075/api`.
 */
export function getApiBaseUrl(): string {
    const raw = import.meta.env.VITE_API_URL?.trim()
    if (raw) return raw.replace(/\/$/, '')
    return 'https://hyper-planning.fr/api'
}
