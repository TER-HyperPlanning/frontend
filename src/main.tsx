import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "react-hot-toast" // AJOUT ROSANE

import { queryClient } from './queryClient'
import { router } from './router'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
