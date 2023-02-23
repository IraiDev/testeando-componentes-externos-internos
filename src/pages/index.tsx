import { useSnackbar } from '../components/snackbar'
import { useSnackbarStore } from '../components/ui'
import styles from './HomePage.module.css'
import { useEffect } from 'react'

function HomePage() {
   const { snackbar, snackbarApiResponse } = useSnackbarStore()

   useEffect(() => {
      console.log('renders home')
   })

   return (
      <>
         <div className={styles.container}>
            <button
               onClick={() =>
                  snackbar({
                     message: 'normal alert',
                     hideTime: 3000,
                     autoHide: true,
                  })
               }
            >
               Normal snackbar
            </button>
            <button
               onClick={() =>
                  snackbarApiResponse({
                     message: 'api alert',
                     errorHideTime: 3000,
                     ok: true,
                     successHideTime: 3000,
                  })
               }
            >
               API snackbar
            </button>
         </div>
      </>
   )
}

export default HomePage
