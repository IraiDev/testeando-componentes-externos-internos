import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { SnackbarProvider } from './components/snackbar'
import { Snackbar } from './components/ui'

const HomePage = lazy(() => import('./pages'))
const AboutPage = lazy(() => import('./pages/about'))

function App() {
   return (
      <Suspense fallback={<>loading...</>}>
         <SnackbarProvider maxStack={4}>
            {/* <Snackbar /> */}
            <HashRouter>
               <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/" element={<AboutPage />} />
               </Routes>
            </HashRouter>
         </SnackbarProvider>
      </Suspense>
   )
}

export default App
