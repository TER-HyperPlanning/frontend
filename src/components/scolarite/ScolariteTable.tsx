import { motion } from 'framer-motion'
import { Pencil, Link2 } from 'lucide-react'
import type { ScolariteAccount } from './types'

interface ScolariteTableProps {
    accounts: ScolariteAccount[]
    onEdit: (account: ScolariteAccount) => void
    onAssignFiliere: (account: ScolariteAccount) => void
}

export default function ScolariteTable({ accounts, onEdit, onAssignFiliere }: ScolariteTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full">
                <thead>
                    <tr className="bg-primary-800 text-white">
                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Nom</th>
                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Prénom</th>
                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Email</th>
                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Filières</th>
                        <th className="text-center px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {accounts.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                Aucun compte scolarité trouvé
                            </td>
                        </tr>
                    ) : (
                        accounts.map((account, index) => (
                            <motion.tr
                                key={account.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
                                className="hover:bg-gray-50/80 transition-colors duration-150"
                            >
                                <td className="px-6 py-3.5 text-sm font-medium text-gray-800">{account.nom}</td>
                                <td className="px-6 py-3.5 text-sm text-gray-600">{account.prenom}</td>
                                <td className="px-6 py-3.5 text-sm text-gray-600">{account.email}</td>
                                <td className="px-6 py-3.5">
                                    <div className="flex flex-wrap gap-1.5">
                                        {account.filieres.length > 0 ? account.filieres.map((f) => (
                                            <span
                                                key={f}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200"
                                            >
                                                {f}
                                            </span>
                                        )) : (
                                            <span className="text-xs text-gray-400 italic">Aucune filière</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-3.5">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onAssignFiliere(account)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                                            title="Assigner filières"
                                        >
                                            <Link2 size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onEdit(account)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                                            title="Modifier"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
