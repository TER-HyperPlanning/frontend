import { Pencil, Link2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import { BADGE_STYLES, ACTION_BUTTON_STYLES, EmptyState } from '@/utils/tableStyles'
import type { ScolariteAccount } from './types'

interface ScolariteTableProps {
    accounts: ScolariteAccount[]
    onEdit: (account: ScolariteAccount) => void
    onAssignFiliere: (account: ScolariteAccount) => void
}

export default function ScolariteTable({ accounts, onEdit, onAssignFiliere }: ScolariteTableProps) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeader>Nom</TableHeader>
                    <TableHeader>Prénom</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Filières</TableHeader>
                    <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {accounts.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="px-4 py-0">
                            <EmptyState 
                                title="Aucun compte scolarité"
                                message="Aucun compte scolarité enregistré pour le moment"
                            />
                        </TableCell>
                    </TableRow>
                ) : (
                    accounts.map(account => (
                        <TableRow key={account.id}>
                            <TableCell className="font-semibold text-gray-900">{account.nom}</TableCell>
                            <TableCell className="text-gray-600">{account.prenom}</TableCell>
                            <TableCell className="text-blue-600 hover:text-blue-700">{account.email}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1.5">
                                    {account.filieres.length > 0 ? account.filieres.map((f) => (
                                        <span
                                            key={f}
                                            className={BADGE_STYLES['info-outline']}
                                        >
                                            {f}
                                        </span>
                                    )) : (
                                        <span className="text-xs text-gray-400 italic">Aucune filière</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onAssignFiliere(account)}
                                        className={ACTION_BUTTON_STYLES.assign}
                                        title="Assigner filières"
                                        aria-label="Assigner filières"
                                    >
                                        <Link2 size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onEdit(account)}
                                        className={ACTION_BUTTON_STYLES.edit}
                                        title="Modifier"
                                        aria-label="Modifier compte"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
