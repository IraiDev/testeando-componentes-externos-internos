import {
   MultiSelect,
   MultiSelectChange,
   Option,
   Select,
   SelectChange,
   useSnackbarStore,
   ValueTypes,
} from '../components/ui'
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
         <div className="container mx-auto h-screen grid place-content-center max-w-lg gap-4">
            <Select
               // findBy="value"
               options={options}
               value={select}
               onChange={(e: SelectChange) => setSelect(e.target.value)}
            />

            <MultiSelect
               labelDisplay="both"
               options={options}
               value={multiSelect}
               onChange={(e: MultiSelectChange) => setMultiSelect(e.target.value)}
            />

            <span>{JSON.stringify(select)}</span>

            <button
               className="bg-indigo-500 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl"
               onClick={() =>
                  snackbar({
                     message: 'normal alert',
                     hideTime: 2000,
                     autoHide: true,
                     maxStack: 3,
                  })
               }
            >
               Normal snackbar
            </button>
            <button
               className="bg-indigo-500 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl"
               onClick={() =>
                  snackbarApiResponse({
                     message: 'api alert',
                     errorHideTime: 2000,
                     ok: true,
                     successHideTime: 2000,
                     maxStack: 3,
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
