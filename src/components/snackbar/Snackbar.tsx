import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { SnackbarItem } from './SnackbarItem'
import uuid from 'react-id-generator'
import styles from './Snackbar.module.css'
import { TransitionGroup } from 'react-transition-group'

export interface SnackbarProps extends ItemProps {
   key: string
}
interface Props {
   children: ReactNode
   maxStack?: number
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

const SnackbarContext = createContext<ContextProps>({
   snackbar: (props: ItemProps) => {},
   snackbarApiResponse: (props: SnackbarApiProps) => {},
})

export const useSnackbar = () => useContext(SnackbarContext)

export function SnackbarProvider({ children, maxStack = 3 }: Props) {
   const [snackbars, setSnackbars] = useState<SnackbarProps[]>([])

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
            <ul className={styles.list}>
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
