import { Pencil, Link2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import type { ScolariteAccount } from './types'

interface ScolariteTableProps {
    accounts: ScolariteAccount[]
    onEdit: (account: ScolariteAccount) => void
    onAssignFiliere: (account: ScolariteAccount) => void
}

export default function ScolariteTable({ accounts, onEdit, onAssignFiliere }: ScolariteTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Nom</TableHeader>
                        <TableHeader>Prénom</TableHeader>
                        <TableHeader>Email</TableHeader>
                        <TableHeader>Filières</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                Aucun compte scolarité trouvé
                            </TableCell>
                        </TableRow>
                    ) : (
                        accounts.map(account => (
                            <TableRow key={account.id}>
                                <TableCell className="font-medium text-base-content">{account.nom}</TableCell>
                                <TableCell className="text-sm text-base-content/80">{account.prenom}</TableCell>
                                <TableCell className="text-sm text-base-content/80">{account.email}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1.5">
                                        {account.filieres.length > 0 ? account.filieres.map((f) => (
                                            <span
                                                key={f}
                                                className="badge badge-primary badge-outline badge-sm font-medium"
                                            >
                                                {f}
                                            </span>
                                        )) : (
                                            <span className="text-xs text-base-content/50 italic">Aucune filière</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onAssignFiliere(account)}
                                            className="btn btn-ghost btn-sm text-base-content/50 hover:text-primary"
                                            title="Assigner filières"
                                        >
                                            <Link2 size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onEdit(account)}
                                            className="btn btn-ghost btn-sm text-base-content/50 hover:text-primary"
                                            title="Modifier"
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
        </div>
    )
}
