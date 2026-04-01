import { type ReactNode, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
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
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-primary-500 selection:text-white font-sans">
      <BackgroundGradientFollower />
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-white via-white to-slate-50/70" />
        <div className="absolute top-[-25%] left-[-15%] z-0 w-[55%] h-[55%] bg-primary-500/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-25%] right-[-15%] z-0 w-[55%] h-[55%] bg-secondary-500/15 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[35%] left-[30%] z-0 w-[30%] h-[30%] bg-primary-400/10 rounded-full blur-[90px] animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-slate-200/70 bg-white/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo showText className="text-slate-900 h-10" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <Link to="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer hidden sm:block">
                Se connecter
            </Link>
            <Link to="/auth/login">
              <Button variant="filled" className="bg-primary-600 hover:bg-primary-500 text-white rounded-full px-6 shadow-sm shadow-primary-600/20">
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
            <span className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-white/70 border border-slate-200 text-slate-700 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm shadow-slate-900/5">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary-500" />
              La nouvelle référence du planning universitaire
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              L'organisation <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-700 to-secondary-600">intelligente</span><br />
              pour votre université.
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Simplifiez la gestion des emplois du temps, coordonnez les ressources et optimisez l'expérience académique avec une plateforme moderne et intuitive.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth/login">
                <Button className="h-14 px-8 text-lg rounded-full bg-linear-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-600/20 transition-all text-white border-0">
                  Découvrir la démo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/planning">
                <Button variant="outlined" className="h-14 px-8 text-lg rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                  Accéder au planning (invité)
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outlined" className="h-14 px-8 text-lg rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Abstract Floating Elements */}
          <motion.div style={{ y: y1 }} className="absolute md:top-40 md:left-10 opacity-20 hidden md:block pointer-events-none">
            <Calendar size={120} className="text-primary-600" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute md:bottom-40 md:right-10 opacity-20 hidden md:block pointer-events-none">
             <Clock size={120} className="text-secondary-600" />
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-primary-700" />}
              title="Planification Intuitive"
              description="Créez et modifiez les emplois du temps par simple glisser-déposer avec détection automatique des conflits."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-secondary-700" />}
              title="Collaboration Temps Réel"
              description="Travaillez en équipe sur les plannings et partagez instantanément les mises à jour avec les étudiants et enseignants."
              delay={0.4}
            />
            <FeatureCard 
              icon={<CheckCircle className="w-8 h-8 text-emerald-600" />}
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
            className="p-12 rounded-3xl bg-linear-to-b from-white to-slate-50 border border-slate-200 shadow-lg shadow-slate-900/5"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à moderniser votre campus ?</h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Rejoignez les établissements qui font confiance à notre solution pour leur organisation académique.
            </p>
            <Link to="/auth/login">
              <Button className="h-12 px-8 rounded-full bg-primary-600 text-white hover:bg-primary-500 font-semibold border-0 shadow-sm shadow-primary-600/20">
                Commencer maintenant
              </Button>
            </Link>
          </motion.div>
        </section>

        <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-200 text-center text-slate-500 text-sm">
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
      className="p-6 rounded-2xl bg-white/70 border border-slate-200 hover:bg-white transition-colors backdrop-blur-sm group shadow-sm shadow-slate-900/5"
    >
      <div className="mb-4 p-3 rounded-xl bg-slate-50 w-fit group-hover:scale-110 transition-transform duration-300 border border-slate-200">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

function BackgroundGradientFollower() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for fluid movement
  const springConfig = { damping: 18, stiffness: 90 }
  const left = useSpring(mouseX, springConfig)
  const top = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <>
      <motion.div
        style={{ left, top }}
        className="fixed -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-linear-to-r from-primary-400/35 via-purple-400/25 to-secondary-400/35 blur-[90px] pointer-events-none z-0 mix-blend-multiply opacity-70 will-change-transform"
        animate={{
          scale: [1, 1.12, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        style={{ left, top }}
        className="fixed -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full bg-linear-to-r from-primary-500/25 via-white/30 to-secondary-500/25 blur-[22px] pointer-events-none z-0 mix-blend-soft-light opacity-90 will-change-transform"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </>
  )
}
