import { useParams, BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import userService from '../services/users'
import { useState, useEffect } from 'react'


const UserInf = () => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const getInfo = async () => {
      try {
        const Info = await userService.getAll()
        console.log(Info)
        console.log(Info[0].blogs.length)
        setUserInfo(Info)
      } catch (error) {
        console.log(error.message)
      }
    }
    getInfo()
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td><strong>blogs created</strong></td>
          </tr>
          {userInfo && userInfo.map(user => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name} </Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


const Users = () => {

  return (
    UserInf()
  )
}

export default Users