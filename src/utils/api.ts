import { type Account } from '@/types'
import { getApiBaseUrl } from '@/config/api'

const API_BASE_URL = getApiBaseUrl()

// ==================== Interfaces ====================
interface LoginResponse {
  accessToken: string
  expiresIn: number
}

interface ApiResponse<T> {
  status: string
  message: string
  result: T
}

interface StudentResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  password?: string
  groupId?: string
}

interface GroupResponse {
  id: string
  name: string
}

interface AdminResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
}

// ==================== Helper Functions ====================
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Try both 'accessToken' and 'authToken' for compatibility
  const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken')
  
  if (!token) {
    console.warn('No token found in localStorage! User may not be authenticated.')
    throw new Error('Missing or invalid token. Please login first.')
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMsg = errorData.message || `HTTP Error: ${response.status}`
    throw new Error(errorMsg)
  }

  const data = await response.json()
  return data.result || data.data || data
}

// ==================== Authentication ====================
export async function login(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) throw new Error('Login failed')
  const data = await response.json()
  const token = data.result?.accessToken || data.accessToken
  
  if (token) {
    localStorage.setItem('accessToken', token)
  }
  
  return data.result as LoginResponse
}

// ==================== Scolarite (Students) ====================
export async function fetchScolariteAccounts() {
  return apiRequest<StudentResponse[]>('/students')
}

export async function createScolariteAccount(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  groupId: string
}) {
  return apiRequest<StudentResponse>('/students', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateScolariteAccount(id: string, data: Partial<StudentResponse>) {
  return apiRequest<StudentResponse>(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteScolariteAccount(id: string) {
  return apiRequest<void>(`/students/${id}`, { method: 'DELETE' })
}

export async function fetchGroups() {
  return apiRequest<GroupResponse[]>('/groups')
}

// ==================== Admins - API Functions ====================
export async function fetchAdmins() {
  return apiRequest<AdminResponse[]>('/Admins')
}

export async function createAdmin(data: {
  firstName: string
  lastName: string
  email: string
  password: string
}) {
  return apiRequest<AdminResponse>('/Admins', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getAdminById(id: string) {
  return apiRequest<AdminResponse>(`/Admins/${id}`)
}

export async function updateAdmin(id: string, data: Partial<AdminResponse>) {
  console.log('Updating admin:', id, data)
  return apiRequest<AdminResponse>(`/Admins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteAdmin(id: string) {
  return apiRequest<void>(`/Admins/${id}`, { method: 'DELETE' })
}

export async function getDeletedAdmins() {
  return apiRequest<AdminResponse[]>('/Admins/deleted')
}

export async function fetchAccounts() {
  const admins = await fetchAdmins()
  return admins.map((admin) => ({
    id: admin.id,
    name: `${admin.firstName} ${admin.lastName}`,
    email: admin.email,
    active: admin.isActive,
  }))
}

export async function disableAccount(id: string) {
  await updateAdmin(id, { isActive: false } as any)
  return { success: true }
}

export async function enableAccount(id: string) {
  await updateAdmin(id, { isActive: true } as any)
  return { success: true }
}

export async function deleteAccount(id: string) {
  await deleteAdmin(id)
  return { success: true }
}
