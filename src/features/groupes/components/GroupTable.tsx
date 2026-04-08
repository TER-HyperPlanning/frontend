import { UserPlus } from 'lucide-react'
import Button from '@/components/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import SortableHeader from './SortableHeader'
import type { Group, SortConfig, SortKey, Student } from '../types'

interface GroupTableProps {
  groupes: Group[]
  students: Student[]
  sortConfig: SortConfig
  onSort: (key: SortKey) => void
  onAssign: (groupe: Group) => void
}

function GroupTable({ groupes, students, sortConfig, onSort, onAssign }: GroupTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow className="text-base-content/60 text-xs uppercase">
          <TableHeader>Nom</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Formation</TableHeader>
          <TableHeader>Classe</TableHeader>
          <SortableHeader sortKey="capacite" sortConfig={sortConfig} onSort={onSort}>
            Capacité
          </SortableHeader>
          <SortableHeader sortKey="effectif" sortConfig={sortConfig} onSort={onSort}>
            Effectif
          </SortableHeader>
          <TableHeader>Remplissage</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {groupes.map(groupe => {
          const ratio = groupe.effectif / groupe.capacite
          const assignedCount = students.filter(student => student.groupeId === groupe.id).length

          return (
            <TableRow key={groupe.id}>
              <TableCell className="font-medium text-base-content">{groupe.nom}</TableCell>
              <TableCell>
                <span
                  className={`badge badge-sm font-medium ${
                    groupe.type === 'FI'
                      ? 'badge-primary badge-outline'
                      : 'badge-secondary badge-outline'
                  }`}
                >
                  {groupe.type}
                </span>
              </TableCell>
              <TableCell className="text-sm text-base-content/80">{groupe.formation}</TableCell>
              <TableCell className="text-sm text-base-content/80">{groupe.classe}</TableCell>
              <TableCell className="text-sm">{groupe.capacite}</TableCell>
              <TableCell className="text-sm">{groupe.effectif}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <progress
                    className={`progress w-16 h-2 ${
                      ratio > 0.9
                        ? 'progress-error'
                        : ratio > 0.7
                          ? 'progress-warning'
                          : 'progress-success'
                    }`}
                    value={ratio * 100}
                    max={100}
                  />
                  <span className="text-xs text-base-content/50">{Math.round(ratio * 100)}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  leftIcon={<UserPlus size={15} />}
                  className="btn-sm text-xs"
                  onClick={() => onAssign(groupe)}
                >
                  Assigner
                  {assignedCount > 0 && (
                    <span className="badge badge-primary badge-sm ml-1">{assignedCount}</span>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default GroupTable
