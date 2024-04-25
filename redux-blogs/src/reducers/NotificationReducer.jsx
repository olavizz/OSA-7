import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

const NotificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setOnScreen(state, action) {
      console.log(action.payload, 'reducerissa')
      const notification = action.payload
      return notification
    }
  }
})

export const { setOnScreen } = NotificationSlice.actions

export const setNotification = (message, time) => {
  console.log('wut the fuk')
  console.log(message)
  return dispatch => {
    console.log(message, 'tässä kohtaa')
    dispatch(setOnScreen(message))
    setTimeout(() => {
      dispatch(setOnScreen(''))
    }, time * 1000)
  }
}

export default NotificationSlice.reducer