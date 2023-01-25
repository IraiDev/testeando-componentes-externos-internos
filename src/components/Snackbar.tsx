import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import uuid from 'react-id-generator'
import styles from './Snackbar.module.css'

export interface SnackbarProps {
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

   const handleClose = (key: string) => {
      setStackedSnackbars((prevState) => prevState.filter((prev) => prev.key !== key))
   }

   const snackbarApiResponse = (props: SnackbarApiProps) => {
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
   }

   const snackbar = (props: SnackbarProps) => {
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
   }

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
   useEffect(() => {
      if (!item.autoHide) return

      const timeout = setTimeout(() => {
         onClose(item.key)
      }, item.hideTime ?? 2000)

      return () => {
         clearTimeout(timeout)
      }
   }, [item])

   return (
      <li className={styles.wrapper}>
         <div className={styles.container}>
            <span>{item.message}</span>
            <button onClick={() => onClose(item.key)} className={styles.closer}>
               +
            </button>
         </div>
      </li>
   )
}
