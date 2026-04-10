import { UserPlus } from 'lucide-react'
import Button from '@/components/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import { BADGE_STYLES } from '@/utils/tableStyles'
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
  const getGroupTypeBadge = (type: string) => {
    return type === 'FI' ? BADGE_STYLES['info-outline'] : BADGE_STYLES['secondary-outline']
  }

  const getCapacityColor = (ratio: number) => {
    if (ratio > 0.9) return 'bg-red-200'
    if (ratio > 0.7) return 'bg-amber-200'
    return 'bg-emerald-200'
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
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
          <TableHeader className="text-right">Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {groupes.map(groupe => {
          const ratio = groupe.effectif / groupe.capacite
          const assignedCount = students.filter(student => student.groupeId === groupe.id).length

          return (
            <TableRow key={groupe.id}>
              <TableCell className="font-semibold text-gray-900">{groupe.nom}</TableCell>
              <TableCell>
                <span className={getGroupTypeBadge(groupe.type)}>
                  {groupe.type}
                </span>
              </TableCell>
              <TableCell className="text-gray-600">{groupe.formation}</TableCell>
              <TableCell className="text-gray-600">{groupe.classe}</TableCell>
              <TableCell className="text-gray-600">{groupe.capacite}</TableCell>
              <TableCell className="text-gray-600">{groupe.effectif}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`w-16 h-2 rounded-full ${getCapacityColor(ratio)}`} style={{ width: '64px', background: ratio > 0.9 ? '#fecaca' : ratio > 0.7 ? '#fed7aa' : '#dcfce7' }} />
                  <span className="text-xs text-gray-600">{Math.round(ratio * 100)}%</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outlined"
                  leftIcon={<UserPlus size={15} />}
                  className="text-xs"
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
