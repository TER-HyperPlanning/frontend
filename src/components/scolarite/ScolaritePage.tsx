import { useState, useMemo, useEffect } from 'react'
import { Plus, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import SearchBar from './SearchBar'
import ScolariteTable from './ScolariteTable'
import ScolariteModal from './ScolariteModal'
import Toast from '@/components/Toast'
import { useToast } from '@/utils/useToast'
import type { ScolariteAccount } from './types'
import {
    fetchScolariteAccounts,
    createScolariteAccount,
    updateScolariteAccount,
    deleteScolariteAccount,
    fetchGroups,
} from '@/utils/api'

export default function ScolaritePage() {
    const [accounts, setAccounts] = useState<ScolariteAccount[]>([])
    const [groups, setGroups] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editAccount, setEditAccount] = useState<ScolariteAccount | null>(null)

    const { toasts, removeToast, success, error } = useToast()

    // Load data from backend
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            console.log('Loading students and groups from backend...')
            const [studentsData, groupsData] = await Promise.all([
                fetchScolariteAccounts(),
                fetchGroups(),
            ])

            console.log('Groups loaded from backend:', groupsData)
            console.log('Students loaded from backend:', studentsData)

            // Transform students to ScolariteAccount format
            const transformedAccounts: ScolariteAccount[] = studentsData.map((student: any) => ({
                id: student.id,
                nom: student.lastName || '',
                prenom: student.firstName || '',
                email: student.email || '',
                phone: student.phone || '',
            }))

            setAccounts(transformedAccounts)
            setGroups(groupsData)
            console.log('Data loaded successfully:', { accounts: transformedAccounts.length, groups: groupsData.length })
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erreur lors du chargement'
            console.error('Error loading data:', err)
            error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

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
        try {
            console.log('Creating student with data:', data)

            const createPayload = {
                firstName: data.prenom,
                lastName: data.nom.toUpperCase(),
                email: data.email,
                phone: data.phone,
                password: data.password || 'TempPassword123!',
            }

            console.log('Sending API request with payload:', createPayload)
            const newStudent = await createScolariteAccount(createPayload)
            console.log('Student created response:', newStudent)

            const newAccount: ScolariteAccount = {
                id: newStudent.id,
                nom: newStudent.lastName || '',
                prenom: newStudent.firstName || '',
                email: newStudent.email || '',
                phone: newStudent.phone || '',
            }

            setAccounts((prev) => [...prev, newAccount])
            setIsCreateOpen(false)
            success('Étudiant créé avec succès')
            console.log('Student added to UI:', newAccount)
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la création'
            console.error('Error creating student:', err)
            error(errorMsg)
        }
    }

    async function handleEdit(data: { nom: string; prenom: string; email: string; phone: string }) {
        if (!editAccount) return
        try {
            console.log('Updating student:', editAccount.id, data)
            await updateScolariteAccount(editAccount.id, {
                firstName: data.prenom,
                lastName: data.nom.toUpperCase(),
                email: data.email,
                phone: data.phone,
            })

            setAccounts((prev) =>
                prev.map((acc) =>
                    acc.id === editAccount.id
                        ? { ...acc, nom: data.nom.toUpperCase(), prenom: data.prenom, email: data.email, phone: data.phone }
                        : acc
                )
            )
            setEditAccount(null)
            success('Étudiant modifié avec succès')
            console.log('Student updated successfully')
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la modification'
            console.error('Error updating student:', err)
            error(errorMsg)
        }
    }

    async function handleDelete(accountId: string) {
        try {
            console.log('Deleting student:', accountId)
            await deleteScolariteAccount(accountId)
            setAccounts((prev) => prev.filter((acc) => acc.id !== accountId))
            success('Étudiant supprimé avec succès')
            console.log('Student deleted successfully')
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la suppression'
            console.error('Error deleting student:', err)
            error(errorMsg)
        }
    }



    return (
        <div className="flex h-full">
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast toast={{ message: toast.message, type: toast.type as 'success' | 'error' }} onClose={() => removeToast(toast.id)} />
                    </div>
                ))}
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

                {/* Controls: Search + Filters */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                    className="flex flex-wrap items-center gap-3 px-8 pb-4"
                >
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher un compte scolarité"
                    />
                </motion.div>

                {/* Table */}
                <div className="flex-1 overflow-auto px-8 pb-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <span className="text-gray-500">Chargement des étudiants...</span>
                            </div>
                        ) : (
                            <div className="card bg-base-100 border border-base-200">
                                <div className="overflow-x-auto">
                                    <ScolariteTable
                                        accounts={filteredAccounts}
                                        onEdit={(acc) => setEditAccount(acc)}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>

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
        </div>
    )
}
