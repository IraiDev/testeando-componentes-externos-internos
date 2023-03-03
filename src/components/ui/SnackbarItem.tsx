import { isEqual } from 'lodash'
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { CSSTransition } from 'react-transition-group'
import { CloseIcon } from '../icons'
import { SnackbarProps } from './'

const TIMEOUT_ANIMATION = 800 // en ms

interface Props {
   item: SnackbarProps
   onClose: (key: string) => void
}

export function SnackbarItem({ item, onClose }: Props) {
   const transitionChainRef = useRef(null)
   const [localItem, setLocalItem] = useState<SnackbarProps>(item)
   const [holdSnackbar, setHoldSnackbar] = useState(false)
   const [isShowing, setIsShowing] = useState(false)

   const handleHoldSnackbar = (newState: boolean) => setHoldSnackbar(newState)

   const handleClose = useCallback(
      (key: string) => {
         setIsShowing(false)
         setTimeout(() => {
            onClose(key)
         }, TIMEOUT_ANIMATION)
      },
      [onClose]
   )

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
   }, [localItem, holdSnackbar, handleClose])

   return (
      <CSSTransition
         nodeRef={transitionChainRef}
         unmountOnExit
         in={isShowing}
         timeout={TIMEOUT_ANIMATION}
         classNames={{
            enter: 'animate-snackbar-enter',
            exit: 'animate-snackbar-exit',
            enterActive: 'opacity-1',
            exitActive: 'opacity-0',
         }}
      >
         <li
            ref={transitionChainRef}
            className="flex justify-between items-start w-72 py-3 px-4 pr-2 rounded-xl bg-indigo-500 shadow-lg text-white text-lg"
            onMouseEnter={() => handleHoldSnackbar(true)}
            onMouseLeave={() => handleHoldSnackbar(false)}
         >
            <span>{item.message}</span>
            <button
               onClick={() => handleClose(item.key)}
               className="text-white hover:bg-white/10 rounded-full h-8 w-8 grid place-content-center"
            >
               <CloseIcon size={20} color="#fff" strokeWidth={2.5} />
            </button>
         </li>
      </CSSTransition>
   )
}
