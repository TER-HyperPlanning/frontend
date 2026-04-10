import React from 'react'

export const EMPTY_STATE_STYLES = {
  container: 'py-12 text-center',
  icon: 'w-12 h-12 mx-auto text-gray-400 mb-4',
  title: 'text-gray-600 font-medium mb-1',
  message: 'text-gray-500 text-sm',
}

export function EmptyState({ 
  message = 'Aucun résultat trouvé',
  icon: Icon,
  title = 'Aucune donnée'
}: { 
  message?: string
  icon?: React.ComponentType<{ className: string }>
  title?: string
}) {
  return (
    <div className={EMPTY_STATE_STYLES.container}>
      {Icon && <Icon className={EMPTY_STATE_STYLES.icon} />}
      <p className={EMPTY_STATE_STYLES.title}>{title}</p>
      <p className={EMPTY_STATE_STYLES.message}>{message}</p>
    </div>
  )
}
