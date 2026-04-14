import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ScolariteAccount } from './types'
import { FILIERES } from './types'

interface AssignFiliereModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (accountId: string, filieres: string[]) => void
    account: ScolariteAccount | null
}

export default function AssignFiliereModal({ isOpen, onClose, onSubmit, account }: AssignFiliereModalProps) {
    const [selected, setSelected] = useState<string[]>([])

    useEffect(() => {
        if (account) {
            setSelected([...account.filieres])
        } else {
            setSelected([])
        }
    }, [account, isOpen])

    function toggleFiliere(nom: string) {
        setSelected((prev) =>
            prev.includes(nom) ? prev.filter((f) => f !== nom) : [...prev, nom]
        )
    }

    function handleSubmit() {
        if (account) {
            onSubmit(account.id, selected)
        }
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && account && (
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
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-primary-800">
                            <div>
                                <h2 className="text-lg font-bold text-white">Assigner des filières</h2>
                                <p className="text-sm text-white/70 mt-0.5">
                                    {account.prenom} {account.nom}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Filières list */}
                        <div className="p-6">
                            <p className="text-sm text-gray-500 mb-4">
                                Sélectionnez les filières que cet agent peut gérer :
                            </p>
                            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                                {FILIERES.map((filiere) => {
                                    const isSelected = selected.includes(filiere.nom)
                                    return (
                                        <motion.button
                                            key={filiere.id}
                                            type="button"
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => toggleFiliere(filiere.nom)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${isSelected
                                                    ? 'bg-primary-50 border-primary-300 text-primary-800'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div
                                                className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-300'
                                                    }`}
                                            >
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            exit={{ scale: 0 }}
                                                            transition={{ duration: 0.15 }}
                                                        >
                                                            <Check size={12} className="text-white" />
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            {filiere.nom}
                                        </motion.button>
                                    )
                                })}
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-5 py-2.5 rounded-lg bg-primary-800 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                                >
                                    Confirmer ({selected.length})
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
