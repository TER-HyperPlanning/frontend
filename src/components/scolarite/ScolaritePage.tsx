import { useState, useMemo } from 'react'
import { Plus, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/components/Logo'
import SearchBar from './SearchBar'
import FilterDropdown from './FilterDropdown'
import ScolariteTable from './ScolariteTable'
import ScolariteModal from './ScolariteModal'
import { MOCK_ACCOUNTS, FILIERES } from './types'
import type { ScolariteAccount } from './types'

export default function ScolaritePage() {
    const [accounts, setAccounts] = useState<ScolariteAccount[]>(MOCK_ACCOUNTS)
    const [search, setSearch] = useState('')
    const [filiereFilter, setFiliereFilter] = useState('')

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editAccount, setEditAccount] = useState<ScolariteAccount | null>(null)

    // Filter and search
    const filteredAccounts = useMemo(() => {
        return accounts.filter((acc) => {
            const matchesSearch =
                !search ||
                acc.nom.toLowerCase().includes(search.toLowerCase()) ||
                acc.prenom.toLowerCase().includes(search.toLowerCase()) ||
                acc.email.toLowerCase().includes(search.toLowerCase())

            const matchesFiliere =
                !filiereFilter || acc.filieres.includes(filiereFilter)

            return matchesSearch && matchesFiliere
        })
    }, [accounts, search, filiereFilter])

    // CRUD handlers
    function handleCreate(data: { nom: string; prenom: string; email: string; filieres: string[] }) {
        const newAccount: ScolariteAccount = {
            id: String(Date.now()),
            nom: data.nom.toUpperCase(),
            prenom: data.prenom,
            email: data.email,
            filieres: data.filieres,
        }
        setAccounts((prev) => [...prev, newAccount])
    }

    function handleEdit(data: { nom: string; prenom: string; email: string; filieres: string[] }) {
        if (!editAccount) return
        setAccounts((prev) =>
            prev.map((acc) =>
                acc.id === editAccount.id
                    ? { ...acc, nom: data.nom.toUpperCase(), prenom: data.prenom, email: data.email, filieres: data.filieres }
                    : acc
            )
        )
        setEditAccount(null)
    }

    function handleAssignFilieres(accountId: string, filieres: string[]) {
        setAccounts((prev) =>
            prev.map((acc) =>
                acc.id === accountId ? { ...acc, filieres } : acc
            )
        )
    }

    const filiereOptions = FILIERES.map((f) => ({ value: f.nom, label: f.nom }))

    return (
        <div className="flex h-full bg-white">
            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header bar */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex items-center justify-between px-8 py-6"
                >
                    <div className="flex items-center gap-4">
                        <Logo showText={true} className="h-9 w-auto text-[#0b3b60]" />
                    </div>
                    <div className="flex items-center gap-6">
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0b3b60] text-white text-sm font-medium hover:bg-[#082a45] transition-all duration-200 shadow-sm"
                        >
                            <Plus size={16} />
                            Nouvelle Formation
                        </button>
                        <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700 transition-colors relative"
                        >
                            <Bell size={22} className="fill-gray-500/20" />
                            <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </motion.div>

                {/* Controls: Search + Filters */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                    className="flex flex-wrap items-center gap-3 px-8 pb-6"
                >
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher un compte scolarité"
                    />
                    <FilterDropdown
                        label="Filière"
                        options={filiereOptions}
                        value={filiereFilter}
                        onChange={setFiliereFilter}
                    />
                </motion.div>

                {/* Table */}
                <div className="flex-1 overflow-auto px-8 pb-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                    >
                        <ScolariteTable
                            accounts={filteredAccounts}
                            onEdit={(acc) => setEditAccount(acc)}
                        />
                    </motion.div>

                    {/* Stats summary */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-4 text-xs text-gray-400"
                    >
                        {filteredAccounts.length} compte{filteredAccounts.length !== 1 ? 's' : ''} affiché{filteredAccounts.length !== 1 ? 's' : ''}
                        {(search || filiereFilter) && ` sur ${accounts.length}`}
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
