import { createPortal } from 'react-dom'
import { create } from 'zustand'
import { SnackbarItem } from './SnackbarItem'
import uuid from 'react-id-generator'
import { TransitionGroup } from 'react-transition-group'
const SNACKBAR_ROOT = document.getElementById('snackbar-root')

export interface SnackbarProps {
   key: string
   message: string
   hideTime: number
   autoHide: boolean
   maxStack?: number
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

export function Snackbar() {
   const { items: snackbars, close } = useSnackbarStore()

   return createPortal(
      <div className="fixed bottom-3 left-3">
         <TransitionGroup
            component="ul"
            className="flex flex-col-reverse gap-4 transition-all h-auto"
         >
            {/* <ul className=""> */}
            {snackbars.map((item) => (
               <SnackbarItem key={item.key} item={item} onClose={close} />
            ))}
            {/* </ul> */}
         </TransitionGroup>
      </div>,
      SNACKBAR_ROOT!
   )
}

interface SnackbarApiProps {
   message: string
   ok: boolean
   errorHideTime: number
   successHideTime: number
   maxStack?: number
}

interface StoreProps {
   items: SnackbarProps[]
   close: (key: string) => void
   snackbar: (injectedProps: Omit<SnackbarProps, 'key'>) => void
   snackbarApiResponse: (injectedProps: SnackbarApiProps) => void
}

export const useSnackbarStore = create<StoreProps>((set) => ({
   items: [],
   snackbar: (props) => {
      set(({ items: prevState, ...rest }): StoreProps => {
         const newElement = { ...props, key: uuid() }
         const maxStacks = props?.maxStack! ?? 1

         if (prevState.length === 0) {
            return { ...rest, items: [newElement] }
         }

         if (prevState.length < maxStacks) {
            return { ...rest, items: [...prevState, newElement] }
         }

         const newArr = prevState.filter((_, idx) => idx !== 0)
         return { ...rest, items: [...newArr, newElement] }
      })
   },
   snackbarApiResponse: (props) => {
      const { ok, errorHideTime, successHideTime, message, maxStack = 1 } = props

      set(({ items: prevState, ...rest }): StoreProps => {
         const formatedElement: SnackbarProps = {
            key: uuid(),
            message,
            autoHide: true,
            color: ok ? 'success' : 'error',
            hideTime: ok ? successHideTime : errorHideTime,
         }
         const newElement = { ...prevState, ...formatedElement }

         if (prevState.length === 0) {
            return { ...rest, items: [newElement] }
         }

         if (prevState.length < maxStack) {
            return { ...rest, items: [...prevState, newElement] }
         }

         const newArr = prevState.filter((_, idx) => idx !== 0)
         return { ...rest, items: [...newArr, newElement] }
      })
   },
   close: (key: string) => {
      set(({ items: prevState, ...rest }): StoreProps => {
         const newState = prevState.filter((prev) => prev.key !== key)

         return { ...rest, items: newState }
      })
   },
}))
