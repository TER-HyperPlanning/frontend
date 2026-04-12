/** Premier message affichable depuis les erreurs TanStack Form + Zod */
export function firstFieldErrorMessage(errors: unknown[]): string {
  if (!errors.length) return ''
  const e = errors[0]
  if (typeof e === 'string') return e
  if (e && typeof e === 'object' && 'message' in e) {
    const m = (e as { message?: unknown }).message
    if (typeof m === 'string') return m
  }
  return ''
}
