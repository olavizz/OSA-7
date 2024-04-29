import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { PropTypes } from "prop-types";
import blogService from '../services/blogs'
import { useSelector, useDispatch } from 'react-redux'
import { setBlogs, addBlogs, removeBlog, addLikes } from "../reducers/BlogReducer";
import { setNotification } from "../reducers/NotificationReducer"

const Blog = ({ blog, updateLikes: updatedBlog, removeBlog: deleteBlog }) => {

  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5,
  };

  const [Specificblog, setBlog] = useState(null)
  const [comments, setComments] = useState(null)
  const [newComment, setNewComment] = useState('')

  const id = useParams().id
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const Info = await blogService.getAll()
        const AllTheComments = await blogService.getComments(id)

        setComments(AllTheComments)
        const abc = Info.find(blog => blog.id.toString() === id)
        setBlog(abc)
      } catch (error) {
        console.log(error.message)
      }
    }
    getBlogs()
  }, [id, newComment])

  const updateLikes = () => {
    const Ublog = { ...Specificblog,
      likes: Specificblog.likes + 1 }
    updatedBlog( Ublog )
    dispatch(addLikes(
      Ublog
    ))
    setBlog({
      ...Specificblog,
      likes: Specificblog.likes + 1
    })
    dispatch(setNotification(`You voted ${Specificblog.title}`, 5))

  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog({ blog });
    }
    setBlog(null)
  }

  const handleChange = (event) => {
    setNewComment(event.target.value)
  }

  const handleComment = (event) => {
    event.preventDefault()
    blogService.addComment(id ,newComment)
    setNewComment('')

  }

  if (!Specificblog) {
    return null
  }

  return (
    <div style={blogStyle}>
      <h2>{Specificblog.title}</h2>
      <div>{Specificblog.url}</div>
      <div>{Specificblog.likes} likes <button onClick={updateLikes}>like</button></div> <br />
      <button onClick={() => removeBlog(Specificblog)} >remove</button>
      <div>added by {Specificblog.user.name}</div> <br />
      <div><h3><strong>comments</strong></h3></div> <br />
      <form onSubmit={handleComment}>
        <input value={newComment} onChange={handleChange} /><button type="submit">add comment</button>
      </form>
      {comments && comments.map((comment, index) => (
        <div key={`${comment}-${index}`}>
          <li style={{ marginLeft: '20px' }}>{comment.content}</li>
        </div>  ))}

    </div>
  )
}

export default Blog
