import { useState, useRef, useEffect, ChangeEvent, useMemo, useCallback } from 'react'
import { SelectorIcon } from '../../icons'
import { AvatarSelect } from './AvatarSelect'
import { Option } from './Select'
import style from './Select.module.css'
import { SelectDropdown } from './SelectDropdwon'

export type ValueTypes = string[]
export type ShowTypes = 'label' | 'avatar' | 'both'

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
   show?: ShowTypes
}

export function MultiSelect({
   placeholder = 'Seleccione...',
   findBy = 'label',
   show = 'label',
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
      if (findBy === 'label') {
         setInputValue(value)
         setOptions(
            props.options.filter((option) =>
               option.label.toLocaleLowerCase().includes(value.toLocaleLowerCase())
            )
         )
         return
      }
      setInputValue(value)
      setOptions(props.options.filter((option) => option.value.toString() === value.toString()))
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
   }, [wrapperRef])

   useEffect(() => {
      setOptions(props.options.filter((opt) => !props.value.includes(opt.value.toString())))
      setInputValue('')
   }, [props.options])

   return (
      <div ref={wrapperRef} className={`${style.wrapper} ${isOpen && style['wrapper-open']}`}>
         <div
            onClick={handleOpenOptions}
            className={`${style.input} ${isOpen && style['input-open']} 
            ${isOpen && style['select-active']}
            `}
         >
            <MultiItems
               show={show}
               items={props.value.map((item) => item.toString())}
               options={props.options}
               onClear={handleClearOption}
            >
               <input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  onChange={handleFindInOptions}
               />
            </MultiItems>
            <SelectorIcon />
         </div>
         <SelectDropdown items={options} isOpen={isOpen} onSelect={handleSelectOption} />
      </div>
   )
}

function MultiItems({
   children,
   items,
   options,
   show = 'label',
   onClear,
}: {
   children: React.ReactNode
   items: string[]
   options: Option[]
   show?: ShowTypes
   onClear: (key: string) => void
}) {
   const filteredOptions = useMemo(() => {
      return options.filter((option) => items.includes(option.value.toString()))
   }, [items, options])

   const LiContent = useCallback(
      (item: Option) => {
         if (show === 'avatar') {
            return <AvatarSelect type={item.avatar?.type!} avatar={item.avatar?.content} />
         }

         if (show === 'both') {
            return (
               <>
                  <AvatarSelect type={item.avatar?.type!} avatar={item.avatar?.content} />
                  {item.label}
               </>
            )
         }
         return item.label
      },
      [show]
   )

   return (
      <ul className={style['multiple-list']}>
         {filteredOptions.map((item) => (
            <li key={item.value}>
               {LiContent(item)}
               <button onClick={() => onClear(item.value.toString())}>X</button>
            </li>
         ))}

         <>{children}</>
      </ul>
   )
}
