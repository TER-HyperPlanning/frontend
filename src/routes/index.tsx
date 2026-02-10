import { type ReactNode } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Calendar, CheckCircle, Clock, Users } from 'lucide-react'
import Logo from '@/components/Logo'
import Button from '@/components/Button'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])

  return (
    <div className="min-h-screen bg-stone-900 text-white overflow-x-hidden selection:bg-primary-500 selection:text-white font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-primary-400/10 rounded-full blur-[100px] animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo showText className="text-white h-10" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <Link to="/auth/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer hidden sm:block">
                Se connecter
            </Link>
            <Link to="/auth/login">
              <Button variant="filled" className="bg-primary-600 hover:bg-primary-500 text-white rounded-full px-6">
                Commencer
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 min-h-[80vh] flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-400 text-sm font-medium mb-6 backdrop-blur-sm">
              ✨ La nouvelle référence du planning universitaire
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              L'organisation <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-400 to-secondary-400">intelligente</span><br />
              pour votre université.
            </h1>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Simplifiez la gestion des emplois du temps, coordonnez les ressources et optimisez l'expérience académique avec une plateforme moderne et intuitive.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/login">
                <Button className="h-14 px-8 text-lg rounded-full bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/25 transition-all text-white border-0">
                  Découvrir la démo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outlined" className="h-14 px-8 text-lg rounded-full border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Abstract Floating Elements */}
          <motion.div style={{ y: y1 }} className="absolute md:top-40 md:left-10 opacity-20 hidden md:block pointer-events-none">
            <Calendar size={120} className="text-primary-500" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute md:bottom-40 md:right-10 opacity-20 hidden md:block pointer-events-none">
             <Clock size={120} className="text-secondary-500" />
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-primary-400" />}
              title="Planification Intuitive"
              description="Créez et modifiez les emplois du temps par simple glisser-déposer avec détection automatique des conflits."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-secondary-400" />}
              title="Collaboration Temps Réel"
              description="Travaillez en équipe sur les plannings et partagez instantanément les mises à jour avec les étudiants et enseignants."
              delay={0.4}
            />
            <FeatureCard 
              icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
              title="Gestion des Ressources"
              description="Optimisez l'occupation des salles et la disponibilité des équipements grâce à nos algorithmes intelligents."
              delay={0.6}
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-linear-to-b from-primary-900/50 to-stone-900/50 border border-primary-500/20 backdrop-blur-md"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à moderniser votre campus ?</h2>
            <p className="text-stone-400 mb-8 max-w-xl mx-auto">
              Rejoignez les établissements qui font confiance à notre solution pour leur organisation académique.
            </p>
            <Link to="/auth/login">
              <Button className="h-12 px-8 rounded-full bg-white text-primary-900 hover:bg-stone-200 font-semibold border-0">
                Commencer maintenant
              </Button>
            </Link>
          </motion.div>
        </section>

        <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-white/5 text-center text-stone-500 text-sm">
          <p>© {new Date().getFullYear()} University Planner. Tous droits réservés.</p>
        </footer>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm group"
    >
      <div className="mb-4 p-3 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-stone-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
