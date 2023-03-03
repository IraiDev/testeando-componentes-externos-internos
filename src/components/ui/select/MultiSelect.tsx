import { useState, useRef, useEffect, ChangeEvent, useMemo, useCallback } from 'react'
import { CloseIcon } from '../../icons'
import { AvatarSelect } from './AvatarSelect'
import { Option } from './Select'
import { SelectDropdown } from './SelectDropdwon'
import { SelectWrapper } from './SelectWrapper'

export type ValueTypes = string[]
export type LabelDisplay = 'label' | 'avatar' | 'both'

export interface MultiSelectChange {
   target: {
      name?: string
      value: ValueTypes
      type: 'text'
   }
}

interface Props {
   value: ValueTypes
   options: Option[]
   onChange: (injectedProps: MultiSelectChange) => void
   onBlur?: (injectedProps: MultiSelectChange) => void
   name?: string
   disabled?: boolean
   placeholder?: string
   findBy?: 'value' | 'label'
   labelDisplay?: LabelDisplay
}

export function MultiSelect({
   placeholder = 'Seleccione...',
   findBy = 'label',
   labelDisplay = 'label',
   ...props
}: Props) {
   const inputRef = useRef<HTMLInputElement>(null)
   const wrapperRef = useRef<HTMLDivElement>(null)
   const [isOpen, setIsOpen] = useState(false)
   const [options, setOptions] = useState<Option[]>(props.options)

   const setInputValue = (value: string) => (inputRef.current!.value = value)

   const handleOpenOptions = () => {
      inputRef.current?.focus()
      setIsOpen(true)
   }

   const handleSelectOption = (option: Option) => {
      // setIsOpen(false)
      const values: ValueTypes = [...props.value, option.value.toString()]
      setInputValue('')
      props.onChange!({ target: { value: values, type: 'text', name: props.name } })
      setOptions(props.options!.filter((opt) => !values.includes(opt.value.toString())))
   }

   const handleClearOption = (key: string) => {
      const values: ValueTypes = [...props.value].filter((item) => item !== key)
      props.onChange!({ target: { value: values, type: 'text', name: props.name } })
      setOptions(props.options!.filter((opt) => !values.includes(opt.value.toString())))
   }

   const handleFindInOptions = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInputValue(value)
      if (findBy === 'label') {
         setOptions(
            props.options.filter((option) =>
               option.label.toLocaleLowerCase().includes(value.toLocaleLowerCase().trim())
            )
         )
         return
      }
      setOptions(props.options.filter((option) => option.value.toString() === value))
   }

   useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
         if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
            setIsOpen(false)
            Boolean(props.onBlur) &&
               props.onBlur!({ target: { value: props.value, type: 'text', name: props.name } })
         }
      }

      document.addEventListener('mousedown', handleOutsideClick)

      return () => {
         document.removeEventListener('mousedown', handleOutsideClick)
      }
      // eslint-disable-next-line
   }, [wrapperRef])

   useEffect(() => {
      setOptions(props.options.filter((opt) => !props.value.includes(opt.value.toString())))
      setInputValue('')
      // eslint-disable-next-line
   }, [props.options])

   return (
      <div ref={wrapperRef} className="relative">
         <SelectWrapper isOpen={isOpen} onClick={handleOpenOptions}>
            <MultiItems
               isOpen={isOpen}
               labelDisplay={labelDisplay}
               items={props.value}
               options={props.options}
               onClear={handleClearOption}
            >
               <input
                  className={`outline-none bg-transparent ${!isOpen && 'cursor-pointer'}`}
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  onChange={handleFindInOptions}
               />
            </MultiItems>
         </SelectWrapper>
         <SelectDropdown items={options} isOpen={isOpen} onSelect={handleSelectOption} />
      </div>
   )
}

function MultiItems({
   children,
   items,
   options,
   labelDisplay = 'label',
   isOpen,
   onClear,
}: {
   children: React.ReactNode
   items: string[]
   isOpen?: boolean
   options: Option[]
   labelDisplay?: LabelDisplay
   onClear: (key: string) => void
}) {
   const filteredOptions = useMemo(() => {
      return options.filter((option) => items.includes(option.value.toString()))
   }, [items, options])

   const LiContent = useCallback(
      (item: Option) => {
         if (labelDisplay === 'avatar') {
            return <AvatarSelect alt={item.label} avatar={item.avatar} />
         }

         if (labelDisplay === 'both') {
            return (
               <>
                  <AvatarSelect alt={item.label} avatar={item.avatar} />
                  {item.label}
               </>
            )
         }
         return item.label
      },
      [labelDisplay]
   )

   return (
      <ul className="flex flex-wrap items-center gap-1">
         {filteredOptions.map((item) => (
            <li
               key={item.value}
               className={`
               flex gap-2 items-center bg-white rounded-md shadow-md shadow-neutral-300/50 pl-2 text-xs 
               transition border overflow-hidden
               ${isOpen ? 'border-neutral-200' : 'border-transparent'}
               `}
            >
               {LiContent(item)}
               <button
                  className="h-9 w-7 grid place-content-center hover:bg-neutral-200"
                  onClick={() => onClear(item.value.toString())}
               >
                  <CloseIcon size={18} strokeWidth={1.7} />
               </button>
            </li>
         ))}

         <>{children}</>
      </ul>
   )
}
