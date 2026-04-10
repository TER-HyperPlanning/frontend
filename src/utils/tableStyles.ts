export { EmptyState, EMPTY_STATE_STYLES } from '@/components/EmptyState'

/**
 * Unified table styling constants and utilities
 * Use these across all table components for consistent design
 */

// Badge styles for different statuses
export const BADGE_STYLES = {
  // Status badges
  active: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800',
  inactive: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800',
  warning: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800',
  error: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800',
  info: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800',
  secondary: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800',

  // Outlined variants
  'active-outline': 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-transparent border border-emerald-300 text-emerald-700',
  'info-outline': 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-transparent border border-blue-300 text-blue-700',
  'secondary-outline': 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-transparent border border-purple-300 text-purple-700',
  'warning-outline': 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-transparent border border-amber-300 text-amber-700',
}

// Button styles for table actions
export const ACTION_BUTTON_STYLES = {
  edit: 'p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors duration-200',
  delete: 'p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200',
  view: 'p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200',
  assign: 'p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors duration-200',
  primary: 'p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors duration-200',
}

// Text styles for different content types
export const TEXT_STYLES = {
  label: 'font-medium text-gray-900',
  muted: 'text-gray-500',
  faded: 'text-gray-400 italic',
  code: 'font-mono text-sm bg-gray-100 px-2 py-1 rounded',
}
