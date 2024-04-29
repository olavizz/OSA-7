import { useParams, BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import userService from '../services/users'
import { useState, useEffect } from 'react'
import blogService from '../services/blogs'

const SpecificUser = () => {
  const id = useParams().id

  const [blogs, setBlogs] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getInfo = async () => {
      try {
        console.log(id)
        const Info = await blogService.getAll()
        const usersname = await userService.specificUser( id )
        console.log(Info)
        console.log(usersname)
        setUser(usersname)

        const correctBlogs = Info.filter(blog => blog.user.id.toString() === id)

        setBlogs(correctBlogs)
      } catch (error) {
        console.log(error.message)
      }
    }
    getInfo()
  }, [])

  if (!blogs) {
    return null
  }

  return (
    <div>
      <div><h2>{user.name}</h2></div>
      <div><strong><h3>added blogs</h3></strong></div>
      {blogs && blogs.map((a, index) => (
        <div key={`${a}-${index}`}>
          <li style={{ marginLeft: '20px' }}>{a.title}</li>
        </div>
      ))}
    </div>
  )
}

export default SpecificUser
