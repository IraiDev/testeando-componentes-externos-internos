import { useState } from 'react'
import { AvatarSelect } from './AvatarSelect'
import { Option } from './Select'
import style from './Select.module.css'

interface Props {
   items: Option[]
   isOpen?: boolean
   selectedValue?: Option
   onSelect: (option: Option) => void
}

export function SelectDropdown({ items = [], isOpen, onSelect, selectedValue }: Props) {
   const [selected, setSelected] = useState<Option | undefined>(selectedValue)

   const handleSelectItem = (option: Option) => {
      setSelected(option)
      onSelect(option)
   }

   if (!isOpen) return null

   return (
      <div className={`${style['dropdown-wrapper']} ${isOpen && style['select-active']}`}>
         <ul className={style['dropdown-list']}>
            {items.length > 0 &&
               items.map((item) => (
                  <li
                     key={item.value}
                     onClick={() => handleSelectItem(item)}
                     className={
                        selected?.value === item.value ? style['dropdown-item-active'] : ''
                     }
                  >
                     <AvatarSelect type={item.avatar?.type!} avatar={item.avatar?.content} />
                     {item.label}
                  </li>
               ))}
            {items.length === 0 && <li>No hay opciones...</li>}
         </ul>
      </div>
   )
}
