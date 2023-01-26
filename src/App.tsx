import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { SnackbarProvider } from './components/snackbar'

const HomePage = lazy(() => import('./pages'))

function App() {
   return (
      <Suspense fallback={<>loading...</>}>
         <SnackbarProvider maxStack={4}>
            <HashRouter>
               <Routes>
                  <Route path="/" element={<HomePage />} />
               </Routes>
            </HashRouter>
         </SnackbarProvider>
      </Suspense>
   )
}

export default App
