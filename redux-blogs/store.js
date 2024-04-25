import { configureStore } from '@reduxjs/toolkit'

import notificationReducer from './src/reducers/NotificationReducer'
import BlogReducer from './src/reducers/BlogReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    EveryBlog: BlogReducer
  }
})

export default store