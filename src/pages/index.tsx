import { useSnackbar } from '../components/snackbar'
import styles from './HomePage.module.css'

function HomePage() {
   const { snackbar, snackbarApiResponse } = useSnackbar()
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
