import { type Account } from '@/types'

// Mock API: simule de petites delays
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

const mockAccounts: Account[] = [
  { id: '1', name: 'Alice Dupont', email: 'alice.dupont@uni.fr', active: true },
  { id: '2', name: 'Benoît Martin', email: 'benoit.martin@uni.fr', active: true },
  { id: '3', name: 'Chloé Bernard', email: 'chloe.bernard@uni.fr', active: false },
]

export async function fetchAccounts() {
  await delay(200)
  // return a shallow copy to simulate fetch
  return mockAccounts.map((a) => ({ ...a }))
}

export async function disableAccount(id: string) {
  await delay(150)
  const acc = mockAccounts.find((a) => a.id === id)
  if (acc) acc.active = false
  return { success: !!acc }
}

export async function enableAccount(id: string) {
  await delay(150)
  const acc = mockAccounts.find((a) => a.id === id)
  if (acc) acc.active = true
  return { success: !!acc }
}

export async function deleteAccount(id: string) {
  await delay(150)
  const idx = mockAccounts.findIndex((a) => a.id === id)
  if (idx >= 0) mockAccounts.splice(idx, 1)
  return { success: idx >= 0 }
}
