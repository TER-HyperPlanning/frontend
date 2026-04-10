import { type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface TableProps extends ComponentPropsWithoutRef<'table'> {
  children: ReactNode
  className?: string
}

interface TableHeadProps extends ComponentPropsWithoutRef<'thead'> {
  children: ReactNode
  className?: string
}

interface TableBodyProps extends ComponentPropsWithoutRef<'tbody'> {
  children: ReactNode
  className?: string
}

interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
  children: ReactNode
  className?: string
}

interface TableHeaderProps extends ComponentPropsWithoutRef<'th'> {
  children: ReactNode
  className?: string
}

interface TableCellProps extends ComponentPropsWithoutRef<'td'> {
  children: ReactNode
  className?: string
}

function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table
        className={cn(
          'w-full border-collapse text-sm',
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    <thead
      className={cn('bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </thead>
  )
}

function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn('[&>tr:last-child>td]:border-b-0', className)}
      {...props}
    >
      {children}
    </tbody>
  )
}

function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-gray-200 transition-colors hover:bg-gray-50/50 [&>td]:py-3 [&>td]:px-4 [&>th]:py-3 [&>th]:px-4',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <th
      className={cn(
        'text-left font-semibold text-gray-700 text-xs uppercase tracking-wider whitespace-nowrap',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  )
}

function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td
      className={cn('text-gray-600', className)}
      {...props}
    >
      {children}
    </td>
  )
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
