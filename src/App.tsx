import styles from './App.module.css'
import { useSnackbar } from './components'

function App() {
   const { snackbar, snackbarApiResponse } = useSnackbar()

   return (
      <div className={styles['app-container']}>
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
                  errorHideTime: 4000,
                  ok: true,
                  successHideTime: 3000,
               })
            }
         >
            API snackbar
         </button>
      </div>
   )
}

export default App
