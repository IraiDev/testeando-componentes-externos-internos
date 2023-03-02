import {
   MultiSelect,
   MultiSelectChange,
   Option,
   Select,
   SelectChange,
   useSnackbarStore,
   ValueTypes,
} from '../components/ui'
import styles from './HomePage.module.css'
import { useEffect, useState } from 'react'

function HomePage() {
   const { snackbar, snackbarApiResponse } = useSnackbarStore()
   const [select, setSelect] = useState<Option>({ label: 'Summer Smith', value: '3' })
   const [multiSelect, setMultiSelect] = useState<ValueTypes>(['5', '1'])
   const [options, setOptions] = useState<Option[]>([])

   useEffect(() => {
      fetch('https://rickandmortyapi.com/api/character')
         .then((resp) => resp.json())
         .then((data) => {
            const formatedOptions: Option[] = data.results.map((item: any) => ({
               label: item.name,
               value: item.id.toString(),
               avatar: item.image,
            }))
            setOptions(formatedOptions)
         })
   }, [])

   return (
      <>
         <div className={styles.container}>
            <Select
               // findBy="value"
               options={options}
               value={select}
               onChange={(e: SelectChange) => setSelect(e.target.value)}
            />

            <MultiSelect
               show="both"
               options={options}
               value={multiSelect}
               onChange={(e: MultiSelectChange) => setMultiSelect(e.target.value)}
            />

            <span>{JSON.stringify(select)}</span>

            <button
               onClick={() =>
                  snackbar({
                     message: 'normal alert',
                     hideTime: 3000,
                     autoHide: true,
                  })
               }
            >
               Normal snackbar
            </button>
            <button
               onClick={() =>
                  snackbarApiResponse({
                     message: 'api alert',
                     errorHideTime: 3000,
                     ok: true,
                     successHideTime: 3000,
                  })
               }
            >
               API snackbar
            </button>
         </div>
      </>
   )
}

export default HomePage
