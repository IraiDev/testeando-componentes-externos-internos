import { isEqual } from 'lodash'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { SnackbarProps } from './'
import styles from './Snackbar.module.css'

const ANIMATION_DURATION = 500 // en ms

interface Props {
   item: SnackbarProps
   onClose: (key: string) => void
}

export function SnackbarItem({ item, onClose }: Props) {
   const [localItem, setLocalItem] = useState<SnackbarProps>(item)
   const [holdSnackbar, setHoldSnackbar] = useState(false)
   const [isShowing, setIsShowing] = useState(false)
   const ref = useRef<HTMLLIElement>(null)

   const handleHoldSnackbar = (newState: boolean) => setHoldSnackbar(newState)

   const handleClose = (key: string) => {
      setIsShowing(false)
      setTimeout(() => {
         onClose(key)
      }, ANIMATION_DURATION)
   }

   useLayoutEffect(() => setIsShowing(true), []) // para gatillar la animacion

   useEffect(() => {
      if (!localItem.autoHide) return

      if (holdSnackbar) {
         setLocalItem((prevState) => {
            const newState = { ...localItem, hideTime: 1000 }
            if (isEqual(prevState, newState)) return prevState
            return newState
         })
         return
      }

      const timeout = setTimeout(() => {
         handleClose(localItem.key)
      }, localItem.hideTime)

      return () => {
         clearTimeout(timeout)
      }
   }, [localItem, holdSnackbar])

   return (
      <CSSTransition
         nodeRef={ref}
         timeout={ANIMATION_DURATION}
         in={isShowing}
         classNames={{
            enter: styles['animation-enter'],
            exit: styles['animation-exit'],
            enterActive: styles['animation-enter-active'],
            exitActive: styles['animation-exit-active'],
         }}
      >
         <li
            ref={ref}
            className={styles.wrapper}
            onMouseEnter={() => handleHoldSnackbar(true)}
            onMouseLeave={() => handleHoldSnackbar(false)}
         >
            <div className={styles.container}>
               <span>{item.message}</span>
               <button onClick={() => handleClose(item.key)} className={styles.closer}>
                  +
               </button>
            </div>
         </li>
      </CSSTransition>
   )
}
