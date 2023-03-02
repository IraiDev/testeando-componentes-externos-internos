import { SelectorIcon } from '../../icons'
import { AvatarSelect } from './AvatarSelect'

interface Props {
   children: React.ReactNode
   isOpen: boolean
   avatar?: string | React.ReactNode
   alt?: string
   onClick: () => void
}

export function SelectWrapper({ onClick, isOpen, avatar, alt, children }: Props) {
   return (
      <section
         onClick={onClick}
         className={`
            flex items-center gap-2 w-full p-3 pr-1 rounded-xl border-2 border-transparent transition
            ${
               isOpen
                  ? 'rounded-b-none border-neutral-300 border-b-transparent bg-white'
                  : 'bg-neutral-100 cursor-pointer hover:border-indigo-500'
            }
         `}
      >
         <AvatarSelect avatar={avatar} alt={alt!} />
         {children}
         <span className="h-7">
            <SelectorIcon />
         </span>
      </section>
   )
}
