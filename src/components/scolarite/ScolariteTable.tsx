import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import type { ScolariteAccount } from './types'

interface ScolariteTableProps {
    accounts: ScolariteAccount[]
    onEdit: (account: ScolariteAccount) => void
}

export default function ScolariteTable({ accounts, onEdit }: ScolariteTableProps) {
    return (
        <div className="overflow-hidden bg-[#f4f7f9] rounded-xl">
            <table className="w-full">
                <thead>
                    <tr className="bg-[#f4f7f9]">
                        <th className="text-left px-6 py-4 text-[13px] font-bold text-[#0b3b60] uppercase tracking-wider rounded-tl-xl w-1/5">Nom</th>
                        <th className="text-left px-6 py-4 text-[13px] font-bold text-[#0b3b60] uppercase tracking-wider w-1/5">Prénom</th>
                        <th className="text-left px-6 py-4 text-[13px] font-bold text-[#0b3b60] uppercase tracking-wider w-1/5">Email</th>
                        <th className="text-left px-6 py-4 text-[13px] font-bold text-[#0b3b60] uppercase tracking-wider w-1/5">Filières</th>
                        <th className="text-center px-6 py-4 text-[13px] font-bold text-[#0b3b60] uppercase tracking-wider rounded-tr-xl">Actions</th>
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
                                className="border-b border-gray-100 hover:bg-[#e9ecef] transition-colors duration-150"
                            >
                                <td className="px-6 py-5 text-[15px] font-bold text-[#0b3b60]">{account.nom}</td>
                                <td className="px-6 py-5 text-[14px] font-semibold text-[#0b3b60]">{account.prenom}</td>
                                <td className="px-6 py-5 text-[14px] font-semibold text-[#0b3b60]">{account.email}</td>
                                <td className="px-6 py-5 font-bold text-[#0b3b60]">
                                    <div className="flex flex-wrap gap-1.5">
                                        {account.filieres.length > 0 ? account.filieres.map((f) => (
                                            <span
                                                key={f}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200"
                                            >
                                                {f}
                                            </span>
                                        )) : (
                                            <span className="text-sm font-medium text-gray-400 italic">Aucune filière</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(account)}
                                            className="text-gray-500 hover:text-[#0b3b60] transition-colors"
                                            title="Modifier"
                                        >
                                            <Pencil size={18} strokeWidth={2.5} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {}}
                                            className="text-gray-500 hover:text-red-600 transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={18} strokeWidth={2.5} />
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
