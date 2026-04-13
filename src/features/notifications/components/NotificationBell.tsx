import React, { useState } from 'react'
import { Bell, Check, Info, AlertTriangle, Calendar, ChevronRight } from 'lucide-react'       
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Bouton latéral droit */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-0 -translate-y-1/2 z-40 bg-white shadow-xl shadow-gray-200/50 border border-r-0 border-gray-200 rounded-l-2xl py-6 px-2.5 flex flex-col items-center gap-4 hover:bg-gray-50 hover:-translate-x-1 transition-all cursor-pointer group"
      >
        <div className="relative mt-1">
          <Bell className="h-6 w-6 text-[#003A68] group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <span className="badge badge-sm badge-error text-white absolute -top-2.5 -right-3.5 border-2 border-white shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span 
          style={{ writingMode: 'vertical-rl' }} 
          className="font-semibold text-sm text-[#003A68] tracking-widest uppercase rotate-180"
        >
          Notifications
        </span>
      </button>

      {/* Overlay sombre pour fermer au clic à l'extérieur */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[60] backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu / Drawer latéral */}
      <div 
        className={`fixed top-0 right-0 h-screen w-96 max-w-full bg-white z-[70] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* En-tête du drawer */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-xl text-[#003A68]">Notifications</h3>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Tout marquer lu
            </button>
          )}
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          {isLoading ? (
            <div className="p-10 flex justify-center">
              <span className="loading loading-spinner text-primary"></span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center gap-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Aucune notification pour le moment.</p>
              <p className="text-sm text-gray-400">Vous serez averti ici en cas de changement.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`p-5 hover:bg-gray-50 transition-colors flex gap-4 items-start group relative ${!notification.isRead ? 'bg-blue-50/40' : 'bg-white'}`}
                >
                  {!notification.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r" />
                  )}
                  
                  <div className="flex-none mt-0.5 bg-white p-2 shadow-sm border border-gray-100 rounded-xl">
                    <NotificationIcon type={notification.type} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2"> 
                      <span className={`text-sm font-bold truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </span>
                      <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap">
                        {format(new Date(notification.createdAt), 'dd MMM HH:mm', { locale: fr })}
                      </span>
                    </div>
                    <div className={`text-sm leading-relaxed ${!notification.isRead ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                      {renderNotificationMessage(notification.message)}       
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
                        >
                          Marquer lu
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 px-2 py-1 hover:bg-red-50 rounded transition-colors"
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
      </div>
    </>
  )
}

export default NotificationBell
