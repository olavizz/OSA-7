import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    console.log(event.target.value)
    setValue(event.target.value)
  }

  const clearcomp = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    clearcomp
  }
}