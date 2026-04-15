import { Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Table'
import type { ScolariteAccount } from './types'

interface ScolariteTableProps {
    accounts: ScolariteAccount[]
    onEdit: (account: ScolariteAccount) => void
    onDelete: (account: ScolariteAccount) => void
}

export default function ScolariteTable({ accounts, onEdit, onDelete }: ScolariteTableProps) {
    return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Nom</TableHeader>
                        <TableHeader>Prénom</TableHeader>
                        <TableHeader>Email</TableHeader>
                        <TableHeader>Téléphone</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-base-content/50 py-12">
                                Aucun compte scolarité trouvé
                            </TableCell>
                        </TableRow>
                    ) : (
                        accounts.map(account => (
                            <TableRow key={account.id}>
                                <TableCell className="font-medium text-base-content">{account.nom}</TableCell>
                                <TableCell className="text-sm text-base-content/80">{account.prenom}</TableCell>
                                <TableCell className="text-sm text-primary/80">{account.email}</TableCell>
                                <TableCell className="text-sm text-base-content/80">{account.phone}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(account)}
                                            className="btn btn-ghost btn-sm text-base-content/50 hover:text-warning"
                                            title="Modifier"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(account)}
                                            className="btn btn-ghost btn-sm text-base-content/50 hover:text-error"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={16} />
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
