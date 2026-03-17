import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FILIERES } from './types'
import type { ScolariteAccount } from './types'

interface ScolariteModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { nom: string; prenom: string; email: string; password?: string; filieres: string[] }) => void
    account?: ScolariteAccount | null
}

export default function ScolariteModal({ isOpen, onClose, onSubmit, account }: ScolariteModalProps) {
    const isEdit = !!account
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [selectedFilieres, setSelectedFilieres] = useState<string[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (account) {
            setNom(account.nom)
            setPrenom(account.prenom)
            setEmail(account.email)
            setPassword('')
            setSelectedFilieres([...account.filieres])
        } else {
            setNom('')
            setPrenom('')
            setEmail('')
            setPassword('')
            setSelectedFilieres([])
        }
        setErrors({})
    }, [account, isOpen])

    function validate() {
        const errs: Record<string, string> = {}
        if (!nom.trim()) errs.nom = 'Le nom est requis'
        if (!prenom.trim()) errs.prenom = 'Le prénom est requis'
        if (!email.trim()) errs.email = "L'email est requis"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format d'email invalide"
        if (!isEdit && !password.trim()) errs.password = 'Le mot de passe est requis'
        if (!isEdit && password.length > 0 && password.length < 6) errs.password = 'Minimum 6 caractères'
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
                password: isEdit ? undefined : password,
                filieres: selectedFilieres 
            })
            onClose()
        }
    }

    function toggleFiliere(nom: string) {
        setSelectedFilieres((prev) =>
            prev.includes(nom) ? prev.filter((f) => f !== nom) : [...prev, nom]
        )
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

                            {!isEdit && (
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
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Filières gérées</label>
                                <div className="flex flex-wrap gap-2">
                                    {FILIERES.map((filiere) => {
                                        const isSelected = selectedFilieres.includes(filiere.nom)
                                        return (
                                            <button
                                                key={filiere.id}
                                                type="button"
                                                onClick={() => toggleFiliere(filiere.nom)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isSelected ? 'bg-[#0b3b60] text-white border-[#0b3b60]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                            >
                                                {filiere.nom}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

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
