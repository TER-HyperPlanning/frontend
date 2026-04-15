import React from 'react'
import { Bell, Check, Info, AlertTriangle, Calendar } from 'lucide-react'
import { useNotifications } from '../NotificationContext'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { renderNotificationMessage } from '../../../utils/formatNotification'

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'SessionUpdate': return <Calendar className="w-5 h-5 text-blue-500" />
    case 'SessionCancellation': return <AlertTriangle className="w-5 h-5 text-red-500" />
    case 'RequestApproval': return <Check className="w-5 h-5 text-green-500" />
    case 'RequestRejection': return <AlertTriangle className="w-5 h-5 text-orange-500" />
    default: return <Info className="w-5 h-5 text-gray-400" />
  }
}

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading } = useNotifications()

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <Bell className="h-6 w-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="badge badge-sm badge-error indicator-item">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </div>
      <div
        tabIndex={0}
        className="card compact dropdown-content bg-white z-[100] mt-3 w-96 shadow-xl border border-gray-100"
      >
        <div className="card-body p-0 max-h-[500px]">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-lg text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  markAllAsRead()
                }}
                className="btn btn-ghost btn-xs text-primary low-case"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto overflow-x-hidden">
            {isLoading ? (
              <div className="p-10 flex justify-center">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-10 text-center flex flex-col items-center gap-3">
                <Bell className="w-12 h-12 text-gray-200" />
                <p className="text-gray-400 text-sm">Aucune notification pour le moment.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <li 
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors flex gap-4 items-start group ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex-none mt-1">
                      <NotificationIcon type={notification.type} />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-semibold truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-500'}`}>
                          {notification.title}
                        </span>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {format(new Date(notification.createdAt), 'dd MMM HH:mm', { locale: fr })}
                        </span>
                      </div>
                      <div className={`text-xs ${!notification.isRead ? 'text-gray-700' : 'text-gray-400'}`}>
                        {renderNotificationMessage(notification.message)}
                      </div>
                      
                      <div className="flex items-center gap-3 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            className="btn btn-ghost btn-xs text-[10px] h-auto min-h-0 py-1"
                          >
                            Lu
                          </button>
                        )}
                        <button 
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="btn btn-ghost btn-xs text-error text-[10px] h-auto min-h-0 py-1"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-2 border-t border-gray-100 bg-gray-50/30 text-center">
             <button className="btn btn-ghost btn-sm btn-block text-xs font-medium">
               Voir tout l'historique
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationBell
