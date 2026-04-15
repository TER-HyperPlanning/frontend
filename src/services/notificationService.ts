import { apiGet, apiPatch, apiDelete } from './apiClient'

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  relatedId?: string
  createdAt: string
  isRead: boolean
}

export const notificationService = {
  getNotifications: () => apiGet<Notification[]>('/notifications'),
  
  getUnreadCount: () => apiGet<number>('/notifications/unread-count'),
  
  markAsRead: (id: string) => apiPatch(`/notifications/${id}/read`),
  
  markAllAsRead: () => apiPatch('/notifications/read-all'),
  
  deleteNotification: (id: string) => apiDelete(`/notifications/${id}`)
}
