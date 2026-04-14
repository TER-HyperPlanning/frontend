import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as signalR from '@microsoft/signalr'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'
import { notificationService, type Notification } from '../../services/notificationService'
import { getAccessToken } from '../../auth/storage'
import { useCurrentUser } from '../../hooks/api/useAuth'
import { cn } from '../../utils/cn'
import { renderNotificationMessage } from '../../utils/formatNotification'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  isConnected: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const token = getAccessToken()

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      return await notificationService.getNotifications()
    },
    enabled: !!token && !!user, // Only fetch if we have a token AND user profile
    refetchOnWindowFocus: false,
  })

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: async () => {
      return await notificationService.getUnreadCount()
    },
    enabled: !!token && !!user, // Only fetch if we have a token AND user profile
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    const token = getAccessToken()
    if (!token || !user) {
      if (connection) {
        connection.stop()
        setConnection(null)
        setIsConnected(false)
      }
      return
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5075/api'
    const HUB_URL = API_BASE_URL.replace('/api', '/hubs/notifications')

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    newConnection.on('ReceiveNotification', (notification: any) => {
      try {
        // 1. Invalider les requêtes pour que le chiffre rouge et la liste se mettent à jour
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
        queryClient.invalidateQueries({ queryKey: ['notifications', 'unreadCount'] })

        // 2. Afficher le Toast stylé
        const title = notification.title || 'Notification'
        const message = notification.message || ''
        const type = notification.type?.toUpperCase() || 'INFO'
        
        toast.custom((t) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 shadow-2xl min-w-[320px] max-w-sm pointer-events-auto border-l-4 backdrop-blur-xl transition-all',
              type === 'SUCCESS' && 'bg-emerald-50/95 border-emerald-500 text-emerald-900',
              type === 'ERROR' && 'bg-rose-50/95 border-rose-500 text-rose-900',
              type === 'WARNING' && 'bg-amber-50/95 border-amber-500 text-amber-900',
              type === 'INFO' && 'bg-sky-50/95 border-sky-500 text-sky-900'
            )}
          >
            {type === 'SUCCESS' && <CheckCircleIcon className="size-6 shrink-0 text-emerald-500" />}
            {type === 'ERROR' && <ExclamationTriangleIcon className="size-6 shrink-0 text-rose-500" />}
            {type === 'WARNING' && <ExclamationTriangleIcon className="size-6 shrink-0 text-amber-500" />}
            {type === 'INFO' && <InformationCircleIcon className="size-6 shrink-0 text-sky-500" />}
            
            <div className="flex-1 min-w-0 py-0.5">
              <p className="text-[15px] font-bold leading-tight">{title}</p>
              <div className="mt-1 text-sm opacity-90 leading-relaxed text-inherit">{renderNotificationMessage(message)}</div>
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="p-0.5 rounded hover:bg-black/5 transition-colors shrink-0"
            >
              <XMarkIcon className="size-4" />
            </button>
          </motion.div>
        ), {
          duration: 5000,
          position: 'top-right'
        })
      } catch (err) {
        // Ignorer l'erreur silencieusement en prod ou loguer en warning
      }
    })

    newConnection.start()
      .then(() => {
        setIsConnected(true)
      })
      .catch(() => { /* Erreur silencieuse */ })

    setConnection(newConnection)

    return () => {
      newConnection.off('ReceiveNotification')
      newConnection.stop()
    }
  }, [user, queryClient]) 

  const markAsRead = useCallback(async (id: string) => {
    await notificationService.markAsRead(id)
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }, [queryClient])

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead()
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }, [queryClient])

  const deleteNotification = useCallback(async (id: string) => {
    await notificationService.deleteNotification(id)
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }, [queryClient])

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      isLoading, 
      markAsRead, 
      markAllAsRead, 
      deleteNotification,
      isConnected
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
