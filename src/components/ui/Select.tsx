import { useState, useRef } from 'react'
import { SelectorIcon } from './icons'
import style from './Select.module.css'

interface OptionsI {
   label: string
   value: string | number
}

interface Props {
   value?: any
   options?: OptionsI[]
   onChange?: () => void
   onBlur?: () => void
   label?: string
   name?: string
   disabled?: boolean
}

const DEFAULT_OPTIONS: OptionsI[] = [
   { label: 'opcion 1', value: 1 },
   { label: 'opcion 2', value: 2 },
   { label: 'opcion 3', value: 3 },
   { label: 'opcion 4', value: 4 },
   { label: 'opcion 5', value: 5 },
   { label: 'opcion 6', value: 6 },
   { label: 'opcion 7', value: 7 },
   { label: 'opcion 8', value: 8 },
   { label: 'opcion 9', value: 9 },
]

export function Select(props: Props) {
   const inputRef = useRef<HTMLInputElement>(null)
   const [focused, setFocused] = useState(false)
   const [options, setOptions] = useState<OptionsI[]>(DEFAULT_OPTIONS)

   const setInputValue = (value: string) => (inputRef.current!.value = value)

   const handleOpenOptions = () => {
      inputRef.current?.focus()
      setFocused((prev) => !prev)
   }

   const findOptionsByEntry = (value: string) => {
      setInputValue(value)
      setOptions((options) => options.filter((option) => option.label.includes(value)))
   }

   return (
      <div className={style.wrapper}>
         <label className={style.label}>{props.label}</label>
         <div onClick={handleOpenOptions} className={style.input}>
            <input
               ref={inputRef}
               type="text"
               placeholder="Seleccione..."
               onChange={(e) => findOptionsByEntry(e.target.value)}
            />
            <SelectorIcon />
         </div>
         <Options items={options} focused={focused} onSelect={(value) => setInputValue(value)} />
      </div>
   )
}

function Options({
   items = [],
   focused,
   onSelect,
}: {
   items: OptionsI[]
   focused?: boolean
   onSelect: (label: string) => void
}) {
   const [selected, setSelected] = useState<string>('')

   const handleSelectItem = (seleceted: string) => {
      setSelected(seleceted)
      onSelect(seleceted)
   }

   if (!focused) return null

   return (
      <ul className={style.options}>
         {items.map((item) => (
            <li
               key={item.value}
               onClick={() => handleSelectItem(item.label)}
               className={selected === item.label ? style['options-active'] : ''}
            >
               {item.label}
            </li>
         ))}
      </ul>
   )
}
