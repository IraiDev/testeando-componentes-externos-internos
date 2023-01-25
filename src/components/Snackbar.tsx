import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { isEqual } from 'lodash'
import uuid from 'react-id-generator'
import styles from './Snackbar.module.css'

interface SnackbarProps {
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

interface SnackbarArrProps extends SnackbarProps {
   key: string
}

export interface SnackbarApiProps {
   message: string
   ok: boolean
   errorHideTime: number
   successHideTime: number
}

interface ContextProps {
   snackbar: (injectedProps: SnackbarProps) => void
   snackbarApiResponse: (injectedProps: SnackbarApiProps) => void
}

const SnackbarContext = createContext<ContextProps>({
   snackbar: (props: SnackbarProps) => {},
   snackbarApiResponse: (props: SnackbarApiProps) => {},
})

export const useSnackbar = () => useContext(SnackbarContext)

export function SnackbarProvider({
   children,
   maxStack = 3,
}: {
   children: ReactNode
   maxStack?: number
}) {
   const [stackedSnackbars, setStackedSnackbars] = useState<SnackbarArrProps[]>([])

   const handleClose = useCallback((key: string) => {
      setStackedSnackbars((prevState) => prevState.filter((prev) => prev.key !== key))
   }, [])

   const snackbarApiResponse = useCallback((props: SnackbarApiProps) => {
      const { ok, errorHideTime, successHideTime, message } = props

      setStackedSnackbars((prevState) => {
         const formatedElement: SnackbarArrProps = {
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

   const snackbar = useCallback((props: SnackbarProps) => {
      setStackedSnackbars((prevState) => {
         const newElement = { ...prevState, ...props, key: uuid() }

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
               {stackedSnackbars.map((item) => (
                  <SnackbarItem key={item.key} item={item} onClose={handleClose} />
               ))}
            </ul>
         </>
      </SnackbarContext.Provider>
   )
}

interface SnackbarItemProps {
   item: SnackbarArrProps
   onClose: (key: string) => void
}

function SnackbarItem({ item, onClose }: SnackbarItemProps) {
   const [localItem, setLocalItem] = useState<SnackbarArrProps>(item)
   const [holdSnackbar, setHoldSnackbar] = useState(false)

   const handleHoldSnackbar = (newState: boolean) => setHoldSnackbar(newState)

   useEffect(() => {
      if (holdSnackbar) {
         setLocalItem((prevState) => {
            const newState = { ...localItem, hideTime: 1000 }
            if (isEqual(prevState, newState)) return prevState
            return newState
         })
         return
      }
      if (!localItem.autoHide) return

      const timeout = setTimeout(() => {
         onClose(localItem.key)
      }, localItem.hideTime)

      return () => {
         clearTimeout(timeout)
      }
   }, [localItem, holdSnackbar])

   return (
      <li
         className={styles.wrapper}
         onMouseEnter={() => handleHoldSnackbar(true)}
         onMouseLeave={() => handleHoldSnackbar(false)}
      >
         <div className={styles.container}>
            <span>{item.message}</span>
            <button onClick={() => onClose(item.key)} className={styles.closer}>
               +
            </button>
         </div>
      </li>
   )
}
