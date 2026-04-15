import { useState, useMemo, useEffect, useCallback } from 'react'
import { Plus, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import Toast from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import { useScolariteService, type AdminDto } from '@/services/scolariteService'
import SearchBar from './SearchBar'
import ScolariteTable from './ScolariteTable'
import ScolariteModal from './ScolariteModal'
import type { ScolariteAccount } from './types'

function mapAdminToScolariteAccount(admin: AdminDto): ScolariteAccount {
    return {
        id: admin.id,
        nom: admin.lastName,
        prenom: admin.firstName,
        email: admin.email,
        phone: admin.phone,
    }
}

export default function ScolaritePage() {
    const { getAdmins, createAdmin, updateAdmin, deleteAdmin } = useScolariteService()
    const { toast, showToast, hideToast } = useToast()
    const [accounts, setAccounts] = useState<ScolariteAccount[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editAccount, setEditAccount] = useState<ScolariteAccount | null>(null)

    const loadAccounts = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await getAdmins()
            setAccounts(data.map(mapAdminToScolariteAccount))
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur lors du chargement des comptes'
            showToast(message, 'error')
        } finally {
            setIsLoading(false)
        }
    }, [getAdmins, showToast])

    useEffect(() => {
        void loadAccounts()
    }, [loadAccounts])

    // Filter and search
    const filteredAccounts = useMemo(() => {
        return accounts.filter((acc) => {
            const matchesSearch =
                !search ||
                acc.nom.toLowerCase().includes(search.toLowerCase()) ||
                acc.prenom.toLowerCase().includes(search.toLowerCase()) ||
                acc.email.toLowerCase().includes(search.toLowerCase()) ||
                acc.phone.toLowerCase().includes(search.toLowerCase())
            return matchesSearch
        })
    }, [accounts, search])

    // CRUD handlers
    async function handleCreate(data: { nom: string; prenom: string; email: string; phone: string; password?: string }) {
        if (!data.password) return
        try {
            const created = await createAdmin({
                email: data.email,
                password: data.password,
                firstName: data.prenom,
                lastName: data.nom.toUpperCase(),
                phone: data.phone,
            })
            setAccounts((prev) => [...prev, mapAdminToScolariteAccount(created)])
            showToast('Compte créé avec succès', 'success')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur lors de la création du compte'
            showToast(message, 'error')
        }
    }

    async function handleEdit(data: { nom: string; prenom: string; email: string; phone: string; password?: string }) {
        if (!editAccount) return

        try {
            const updated = await updateAdmin(editAccount.id, {
                email: data.email,
                firstName: data.prenom,
                lastName: data.nom.toUpperCase(),
                phone: data.phone,
            })
            setAccounts((prev) =>
                prev.map((acc) =>
                    acc.id === editAccount.id ? mapAdminToScolariteAccount(updated) : acc
                )
            )
            setEditAccount(null)
            showToast('Compte modifié avec succès', 'success')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur lors de la modification du compte'
            showToast(message, 'error')
        }
    }

    async function handleDelete(account: ScolariteAccount) {
        try {
            await deleteAdmin(account.id)
            setAccounts((prev) => prev.filter((acc) => acc.id !== account.id))
            showToast('Compte supprimé avec succès', 'success')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur lors de la suppression du compte'
            showToast(message, 'error')
        }
    }

    return (
        <div className="flex h-full">
            {/* Left sidebar label */}
            <div className="flex flex-col w-0 sm:w-auto">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="bg-primary-800 text-white font-semibold text-sm px-6 py-3 rounded-r-xl mt-6 whitespace-nowrap hidden sm:block"
                >
                    Comptes Scolarité
                </motion.div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header bar */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex items-center justify-between px-8 py-4"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Hello, Admin</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Logo showText={false} className="h-10 w-auto" />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-800 text-white text-sm font-semibold hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <Plus size={16} />
                            Nouveau Compte
                        </button>
                        <button
                            type="button"
                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                    className="flex flex-wrap items-center gap-3 px-8 pb-4"
                >
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher un compte scolarité (nom, email, téléphone)"
                    />
                </motion.div>

                {/* Table */}
                <div className="flex-1 overflow-auto px-8 pb-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                    >
                        <div className="card bg-base-100 border border-base-200">
                            <div className="overflow-x-auto">
                                <ScolariteTable
                                    accounts={filteredAccounts}
                                    onEdit={(acc) => setEditAccount(acc)}
                                    onDelete={handleDelete}
                                />
                            </div>
                        </div>
                    </motion.div>
                    {isLoading && (
                        <div className="mt-4 text-sm text-gray-500">Chargement des comptes...</div>
                    )}

                    {/* Stats summary */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 text-xs text-gray-400"
                    >
                        {filteredAccounts.length} compte{filteredAccounts.length !== 1 ? 's' : ''} affiché{filteredAccounts.length !== 1 ? 's' : ''}
                        {search && ` sur ${accounts.length}`}
                    </motion.div>
                </div>
            </div>

            {/* Modals */}
            <ScolariteModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
            />

            <ScolariteModal
                isOpen={!!editAccount}
                onClose={() => setEditAccount(null)}
                onSubmit={handleEdit}
                account={editAccount}
            />

            <Toast toast={toast} onClose={hideToast} />
        </div>
    )
}
