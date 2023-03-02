import { useState, useRef, useEffect, ChangeEvent, ReactNode } from 'react'
import { SelectDropdown } from './SelectDropdwon'
import { SelectWrapper } from './SelectWrapper'

export interface Option {
   label: string
   value: string | number
   avatar?: string | ReactNode
}

export interface SelectChange {
   target: {
      name?: string
      value: Option
      type: 'text'
   }
}

interface Props {
   value: Option
   options: Option[]
   onChange: (injectedProps: SelectChange) => void
   onBlur?: (injectedProps: SelectChange) => void
   name?: string
   disabled?: boolean
   placeholder?: string
   findBy?: 'value' | 'label'
}

export function Select({ placeholder = 'Seleccione...', findBy = 'label', ...props }: Props) {
   const inputRef = useRef<HTMLInputElement>(null)
   const wrapperRef = useRef<HTMLDivElement>(null)
   const [isOpen, setIsOpen] = useState(false)
   const [options, setOptions] = useState<Option[]>(props.options)
   const [avatar, setAvatar] = useState<string | ReactNode>('')

   const setInputValue = (value: string) => (inputRef.current!.value = value)

   const handleOpenOptions = () => {
      inputRef.current?.focus()
      setIsOpen(true)
   }

   const handleSelectOption = (option: Option) => {
      setIsOpen(false)
      setInputValue(option.label)
      setAvatar(option.avatar)
      props.onChange!({ target: { value: option, type: 'text', name: props.name } })
      setOptions(props.options!)
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
      // eslint-disable-next-line
   }, [wrapperRef])

   useEffect(() => {
      const newValue = props.options.find((opt) => opt.value.toString() === props.value?.value)
      setInputValue(newValue?.label ?? '')
      setOptions(props.options)
      setAvatar(props.value.avatar)
      // eslint-disable-next-line
   }, [props.options])

   return (
      <div ref={wrapperRef} className="relative">
         <SelectWrapper
            isOpen={isOpen}
            alt={props.value.label}
            avatar={avatar}
            onClick={handleOpenOptions}
         >
            <input
               className={`outline-none bg-transparent ${!isOpen && 'cursor-pointer'}`}
               ref={inputRef}
               type="text"
               placeholder={placeholder}
               onChange={handleFindInOptions}
            />
         </SelectWrapper>
         <SelectDropdown
            items={options}
            isOpen={isOpen}
            selectedValue={props.value}
            onSelect={handleSelectOption}
         />
      </div>
   )
}
