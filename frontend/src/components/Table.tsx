import { type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface TableProps extends ComponentPropsWithoutRef<'table'> {
  children: ReactNode
}

interface TableHeadProps extends ComponentPropsWithoutRef<'thead'> {
  children: ReactNode
}

interface TableBodyProps extends ComponentPropsWithoutRef<'tbody'> {
  children: ReactNode
}

interface TableRowProps extends ComponentPropsWithoutRef<'tr'> {
  children: ReactNode
}

interface TableHeaderProps extends ComponentPropsWithoutRef<'th'> {
  children: ReactNode
}

interface TableCellProps extends ComponentPropsWithoutRef<'td'> {
  children: ReactNode
}

function Table({ children, className, ...props }: TableProps) {
  return (
    <table className={cn('table table-zebra w-full', className)} {...props}>
      {children}
    </table>
  )
}

function TableHead({ children, className, ...props }: TableHeadProps) {
  return (
    <thead className={cn(className)} {...props}>
      {children}
    </thead>
  )
}

function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody className={cn(className)} {...props}>
      {children}
    </tbody>
  )
}

function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <tr className={cn('hover', className)} {...props}>
      {children}
    </tr>
  )
}

function TableHeader({ children, className, ...props }: TableHeaderProps) {
  return (
    <th className={cn('text-base-content/60 text-xs uppercase', className)} {...props}>
      {children}
    </th>
  )
}

function TableCell({ children, className, ...props }: TableCellProps) {
  return (
    <td className={cn(className)} {...props}>
      {children}
    </td>
  )
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow }
