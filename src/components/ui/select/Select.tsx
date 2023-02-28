import { useState, useRef, useEffect, useLayoutEffect, ChangeEvent } from 'react'
import { SelectorIcon } from '../../icons'
import { AvatarSelect } from './AvatarSelect'
import style from './Select.module.css'
import { SelectDropdown } from './SelectDropdwon'

export interface Option {
   label: string
   value: string | number
   avatar?: {
      type: string
      content: any
   }
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
   const [{ avatar, type }, setAvatar] = useState<{ avatar: any; type: string }>({
      avatar: '',
      type: 'string',
   })

   const setInputValue = (value: string) => (inputRef.current!.value = value)

   const handleOpenOptions = () => {
      inputRef.current?.focus()
      setIsOpen(true)
   }

   const handleSelectOption = (option: Option) => {
      setIsOpen(false)
      setInputValue(option.label)
      setAvatar({ avatar: option.avatar?.content, type: option.avatar?.type! })
      props.onChange!({ target: { value: option, type: 'text', name: props.name } })
      setOptions(props.options!)
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

   useLayoutEffect(() => {
      setInputValue(props.value.label)
   }, [])

   useEffect(() => {
      const handleOutsideClick = (event: any) => {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpen(false)
            Boolean(props.onBlur) &&
               props.onBlur!({ target: { value: props.value, type: 'text' } })
         }
      }

      document.addEventListener('click', handleOutsideClick)

      return () => {
         document.removeEventListener('click', handleOutsideClick)
      }
   }, [wrapperRef])

   useEffect(() => {
      setOptions(props.options)
   }, [props.options])

   return (
      <div ref={wrapperRef} className={`${style.wrapper} ${isOpen && style['wrapper-open']}`}>
         <div
            onClick={handleOpenOptions}
            className={`${style.input} ${isOpen && style['input-open']} ${
               isOpen && style['select-active']
            }`}
         >
            <AvatarSelect avatar={avatar} type={type} />
            <input
               ref={inputRef}
               type="text"
               placeholder={placeholder}
               onChange={handleFindInOptions}
            />
            <SelectorIcon />
         </div>
         <SelectDropdown
            items={options}
            isOpen={isOpen}
            selectedValue={props.value}
            onSelect={handleSelectOption}
         />
      </div>
   )
}
