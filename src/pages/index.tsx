import { useSnackbar } from '../components/snackbar'
import { useSnackbarStore } from '../components/ui'
import styles from './HomePage.module.css'
import { useEffect } from 'react'

function HomePage() {
   const { snackbar, snackbarApiResponse } = useSnackbar()

   useEffect(() => {
      console.log('renders home')
   })

   return (
      <div className={styles.container}>
         <button
            onClick={() =>
               snackbar({
                  message: 'normal alert',
                  hideTime: 2000,
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
                  errorHideTime: 2000,
                  ok: true,
                  successHideTime: 2000,
               })
            }
         >
            API snackbar
         </button>
      </div>
   )
}

export default HomePage
