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
                  hideTime: 6000,
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
                  errorHideTime: 6000,
                  ok: true,
                  successHideTime: 6000,
               })
            }
         >
            API snackbar
         </button>
      </div>
   )
}

export default App
