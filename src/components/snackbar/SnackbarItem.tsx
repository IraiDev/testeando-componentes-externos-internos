import { isEqual } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { SnackbarProps } from './'
import styles from './Snackbar.module.css'

interface Props {
   item: SnackbarProps
   onClose: (key: string) => void
}

export function SnackbarItem({ item, onClose }: Props) {
   const [localItem, setLocalItem] = useState<SnackbarProps>(item)
   const [holdSnackbar, setHoldSnackbar] = useState(false)
   const ref = useRef(null)

   const handleHoldSnackbar = (newState: boolean) => setHoldSnackbar(newState)

   const handleClose = (key: string) => {
      onClose(key)
   }

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
         handleClose(localItem.key)
      }, localItem.hideTime)

      return () => {
         clearTimeout(timeout)
      }
   }, [localItem, holdSnackbar])

   return (
      <SwitchTransition>
         <CSSTransition
            key={item.key}
            nodeRef={ref}
            addEndListener={(node, done) => node.addEventListener('transitionend', done, false)}
            classNames="animation"
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
      </SwitchTransition>
   )
}
