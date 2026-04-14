import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'
import { routeTree } from './routeTree.gen'

import { NotificationProvider } from './features/notifications/NotificationContext'

import './styles.css'

const router = createRouter({ routeTree })
const queryClient = new QueryClient()

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </QueryClientProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "35px",
            padding: "40px 50px",
            borderRadius: "10px",
          },
        }}
      /> {/* MODIFICATION : plus visible */}
    </StrictMode>,
  )
}
