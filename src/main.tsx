import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SnackbarProvider } from './components'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <React.StrictMode>
      <SnackbarProvider maxStack={4}>
         <App />
      </SnackbarProvider>
   </React.StrictMode>
)
