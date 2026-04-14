import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ScolariteAccount } from './types'

interface GroupOption {
    id: string
    name: string
}

interface ScolariteModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { nom: string; prenom: string; email: string; phone: string; password?: string; groupId?: string }) => void
    account?: ScolariteAccount | null
    groups?: GroupOption[]
}

export default function ScolariteModal({ isOpen, onClose, onSubmit, account, groups = [] }: ScolariteModalProps) {
    const isEdit = !!account
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [groupId, setGroupId] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (account) {
            setNom(account.nom)
            setPrenom(account.prenom)
            setEmail(account.email)
            setPhone(account.phone)
            setPassword('')
            setGroupId('')
        } else {
            setNom('')
            setPrenom('')
            setEmail('')
            setPhone('')
            setPassword('')
            setGroupId('')
        }
        setErrors({})
    }, [account, isOpen])

    function validate() {
        const errs: Record<string, string> = {}
        if (!nom.trim()) errs.nom = 'Le nom est requis'
        if (!prenom.trim()) errs.prenom = 'Le prénom est requis'
        if (!email.trim()) errs.email = "L'email est requis"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format d'email invalide"
        if (!phone.trim()) errs.phone = 'Le téléphone est requis'
        if (!isEdit && !password.trim()) errs.password = 'Le mot de passe est requis'
        if (!isEdit && password.length > 0 && password.length < 6) errs.password = 'Minimum 6 caractères'
        if (!isEdit && !groupId.trim()) errs.groupId = 'Le groupe est requis'
        return errs
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const errs = validate()
        setErrors(errs)
        if (Object.keys(errs).length === 0) {
            onSubmit({ 
                nom: nom.trim(), 
                prenom: prenom.trim(), 
                email: email.trim(),
                phone: phone.trim(),
                password: isEdit ? undefined : password,
                groupId: isEdit ? undefined : groupId,
            })
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 24 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-primary-800">
                            <h2 className="text-lg font-bold text-white">
                                {isEdit ? 'Modifier le compte' : 'Nouveau compte scolarité'}
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                                    <input
                                        type="text"
                                        value={nom}
                                        onChange={(e) => setNom(e.target.value)}
                                        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${errors.nom ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                                        placeholder="DUPONT"
                                    />
                                    {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom</label>
                                    <input
                                        type="text"
                                        value={prenom}
                                        onChange={(e) => setPrenom(e.target.value)}
                                        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${errors.prenom ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                                        placeholder="Marie"
                                    />
                                    {errors.prenom && <p className="mt-1 text-xs text-red-500">{errors.prenom}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                                    placeholder="agent@univ-evry.fr"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                                    placeholder="+33 6 12 34 56 78"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                            </div>

                            {!isEdit && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                                            placeholder="••••••••"
                                        />
                                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Groupe</label>
                                        <select
                                            value={groupId}
                                            onChange={(e) => setGroupId(e.target.value)}
                                            className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${errors.groupId ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                                        >
                                            <option value="">-- Sélectionner un groupe --</option>
                                            {groups.map((group) => (
                                                <option key={group.id} value={group.id}>
                                                    {group.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.groupId && <p className="mt-1 text-xs text-red-500">{errors.groupId}</p>}
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                                >
                                    {isEdit ? 'Enregistrer' : 'Créer le compte'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
