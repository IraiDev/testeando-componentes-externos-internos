import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { SnackbarItem } from './SnackbarItem'
import uuid from 'react-id-generator'
import styles from './Snackbar.module.css'

export interface SnackbarProps extends ItemProps {
   key: string
}
interface Props {
   children: ReactNode
   maxStack?: number
   placemente?: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
}
interface ItemProps {
   message: string
   hideTime: number
   autoHide: boolean
   color?:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'info'
      | 'warning'
      | 'error'
      | 'dark'
      | 'light'
      | 'default'
}
interface SnackbarApiProps {
   message: string
   ok: boolean
   errorHideTime: number
   successHideTime: number
}
interface ContextProps {
   snackbar: (injectedProps: ItemProps) => void
   snackbarApiResponse: (injectedProps: SnackbarApiProps) => void
}
interface PlacementProps {
   'top-left': string
   'bottom-left': string
   'top-right': string
   'bottom-right': string
}

const SnackbarContext = createContext<ContextProps>({
   snackbar: (props: ItemProps) => {},
   snackbarApiResponse: (props: SnackbarApiProps) => {},
})

export const useSnackbar = () => useContext(SnackbarContext)

export function SnackbarProvider({ children, maxStack = 3, placemente = 'bottom-left' }: Props) {
   const [snackbars, setSnackbars] = useState<SnackbarProps[]>([])

   const selectedPosition: PlacementProps = useMemo(
      () => ({
         'bottom-left': styles['bottom-left'],
         'bottom-right': styles['bottom-right'],
         'top-left': styles['top-left'],
         'top-right': styles['top-right'],
      }),
      []
   )

   const handleClose = useCallback((key: string) => {
      setSnackbars((prevState) => prevState.filter((prev) => prev.key !== key))
   }, [])

   const snackbarApiResponse = useCallback((props: SnackbarApiProps) => {
      const { ok, errorHideTime, successHideTime, message } = props

      setSnackbars((prevState) => {
         const formatedElement: SnackbarProps = {
            key: uuid(),
            message,
            autoHide: true,
            color: ok ? 'success' : 'error',
            hideTime: ok ? successHideTime : errorHideTime,
         }
         const newElement = { ...prevState, ...formatedElement }

         if (prevState.length === 0) {
            return [newElement]
         }

         if (prevState.length < maxStack) {
            return [...prevState, newElement]
         }

         const newArr = prevState.filter((_, idx) => idx !== 0)
         return [...newArr, newElement]
      })
   }, [])

   const snackbar = useCallback((props: ItemProps) => {
      setSnackbars((prevState) => {
         const newElement = { ...props, key: uuid() }

         if (prevState.length === 0) {
            return [newElement]
         }

         if (prevState.length < maxStack) {
            return [...prevState, newElement]
         }

         const newArr = prevState.filter((_, idx) => idx !== 0)
         return [...newArr, newElement]
      })
   }, [])

   return (
      <SnackbarContext.Provider
         value={{
            snackbar,
            snackbarApiResponse,
         }}
      >
         <>
            {children}
            <ul className={`${styles.list} ${selectedPosition[placemente]}`}>
               {/* <TransitionGroup className={styles.list}> */}
               {snackbars.map((item) => (
                  <SnackbarItem key={item.key} item={item} onClose={handleClose} />
               ))}
               {/* </TransitionGroup> */}
            </ul>
         </>
      </SnackbarContext.Provider>
   )
}
