import { create } from 'zustand'
import { SnackbarItem } from './SnackbarItem'
import uuid from 'react-id-generator'
import styles from './Snackbar.module.css'

export interface SnackbarProps extends ItemProps {
   key: string
}
interface Props {
   placemente?: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
}
interface ItemProps {
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
   snackbar: (injectedProps: ItemProps) => void
   snackbarApiResponse: (injectedProps: SnackbarApiProps) => void
}
interface PlacementProps {
   'top-left': string
   'bottom-left': string
   'top-right': string
   'bottom-right': string
}

const PLACEMENT: PlacementProps = {
   'bottom-left': styles['bottom-left'],
   'bottom-right': styles['bottom-right'],
   'top-left': styles['top-left'],
   'top-right': styles['top-right'],
}

export function Snackbar({ placemente = 'bottom-left' }: Props) {
   const { items: snackbars, close } = useSnackbarStore()

   return (
      <ul className={`${styles.list} ${PLACEMENT[placemente]}`}>
         {snackbars.map((item) => (
            <SnackbarItem key={item.key} item={item} onClose={close} />
         ))}
      </ul>
   )
}


export const useSnackbarStore = create<StoreProps>((set) => ({
  items: [],
  snackbar: (props) => {
     set(({ items: prevState, ...rest }): StoreProps => {
        const newElement = { ...props, key: uuid() }
        const maxStacks = props?.maxStack! ?? 3

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
     const { ok, errorHideTime, successHideTime, message, maxStack = 3 } = props

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
