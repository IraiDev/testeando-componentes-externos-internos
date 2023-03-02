import { useState } from 'react'
import { AvatarSelect } from './AvatarSelect'
import { Option } from './Select'

interface Props {
   items: Option[]
   isOpen?: boolean
   selectedValue?: Option
   onSelect: (option: Option) => void
}

export function SelectDropdown({ items = [], isOpen, onSelect, selectedValue }: Props) {
   const [selected, setSelected] = useState<Option | undefined>(selectedValue)

   const handleSelectItem = (option: Option) => {
      Boolean(selectedValue) && setSelected(option)
      onSelect(option)
   }

   if (!isOpen) return null

   return (
      <div
         className={`
         absolute top-full bg-neutral-100 rounded-b-xl w-full
         overflow-hidden z-50 border-2 border-transparent border-t-0 transition-colors
         before:content-[''] before:h-[1px] before:w-full before:block before:bg-neutral-200
         ${isOpen && 'border-neutral-300'}
      `}
         // dropdown-wrapper
      >
         {/* dropdown-list */}
         <ul className="p-1 pt-2 max-h-52 overflow-auto">
            {items.length > 0 &&
               items.map((item) => (
                  <li
                     key={item.value}
                     onClick={() => handleSelectItem(item)}
                     className={`
                        transition flex items-center px-1 py-2 gap-2 rounded-lg 
                        cursor-pointer hover:bg-neutral-200
                        ${selected?.value === item.value && 'bg-indigo-500 text-white'}
                     `}
                     // dropdown-list-item
                  >
                     <AvatarSelect avatar={item.avatar} alt={item.label} />
                     <span>{item.label}</span>
                  </li>
               ))}
            {items.length === 0 && (
               <li className="px-1 py-2 text-neutral-300">No hay opciones...</li>
            )}
         </ul>
      </div>
   )
}
