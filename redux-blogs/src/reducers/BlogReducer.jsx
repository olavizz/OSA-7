import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

const BlogSlice = createSlice({
  name: 'EveryBlog',
  initialState: '',
  reducers: {
    setBlogsOnScreen(state, action) {
      const blog = action.payload
      return blog
    },

    addnewBlog(state, action) {
      const newBBlog = {
        ...action.payload,
        likes: 0
      }
      state.push(newBBlog)
    },

    delOneBlog(state, action) {
      const delblog = action.payload
      return state.filter(blog => blog.id !== delblog.id)
    },

    IncreaseLikes(state, action) {
      const object = action.payload
      return state.map(blog => {
        if (blog.id === object.id) {
          return {
            ...blog,
            likes: object.likes
          }
        }
        return blog
      })
    }
  }
}
)

export const { setBlogsOnScreen, addnewBlog, delOneBlog, IncreaseLikes } = BlogSlice.actions

export const setBlogs = ( props ) => {
  const blogArray = Object.values(props)
  return dispatch => {
    dispatch(setBlogsOnScreen(blogArray))
  }
}

export const addBlogs = (props) => {
  return dispatch => {
    dispatch(addnewBlog(props))
  }
}

export const removeBlog = (props) => {
  return dispatch => {
    dispatch(delOneBlog(props))
  }
}

export const addLikes = (props) => {
  return dispatch => {
    dispatch(IncreaseLikes(props))
  }
}

export default BlogSlice.reducer