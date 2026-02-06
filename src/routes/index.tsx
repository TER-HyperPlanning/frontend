import { createFileRoute } from '@tanstack/react-router'
import Logo from '@/components/Logo'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className='size-full bg-primary-700 flex justify-center items-center p-4'>
      <div className='flex flex-col items-center gap-6 md:gap-8 max-w-2xl w-full px-4 md:px-6 text-center'>
        <Logo showText className='text-white h-16 sm:h-20 md:h-24'/>
        
        <div className='space-y-3 md:space-y-4'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-white'>
            Bientôt Disponible
          </h1>
          
          <p className='text-base sm:text-lg md:text-xl text-white/90'>
            Cette application est actuellement en construction
          </p>
          
          <p className='text-sm sm:text-base md:text-lg text-white/80 leading-relaxed'>
            Une solution moderne de gestion de planning pour les universités, 
            conçue pour simplifier l'organisation des emplois du temps, 
            la planification des cours et la coordination des ressources académiques.
          </p>
        </div>
      </div>
    </div>
  )
}
