import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import userService from './services/users'
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import Users from "./components/User"
import SpecificUser from "./components/SpecificUser";
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from "./reducers/NotificationReducer"
import { setBlogs, addBlogs, removeBlog, addLikes } from "./reducers/BlogReducer";
import { useParams, BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'


const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const dispatch = useDispatch()
  const blogs = useSelector(({ blog }) => {
    return blog
  })

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("wrong username or password", 5));
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    console.log("loggin out", username);
    window.localStorage.removeItem("loggedBlogappUser");
    window.location.reload();
  };

  const handleNewBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const updatedBlog = await blogService.create(blogObject);
      dispatch(addBlogs(updatedBlog));
      dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author}`, 5))
    } catch (error) {
      console.log(error.message);
    }
  };

  const blogFormRef = useRef();

  const updateObject = async (updatedObj) => {
    try {
      const updatedLikes = await blogService.update(updatedObj);
      const blogs = await blogService.getAll()
    } catch (error) {
      console.log(error)
    }
  };

  const deleteBlog = async (blog) => {
    try {
      const response = await blogService.deleblog(blog);
      console.log(response);
      dispatch(removeBlog(blog.blog));
    } catch (error) {
      console.log(error);
    }
  };

  const AllTheBlogs = () => {
    const blogview = {
      background: 'lightgrey',
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5,
    };
    const blogs = useSelector(({ EveryBlog }) => {
      return EveryBlog
    })

    const sortBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    console.log(sortBlogs)
    return (
      <div>
        <div>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={handleNewBlog} />
          </Togglable>
          {sortBlogs
            .map((blog) => (
              <Link to={`/blogs/${blog.id}`} key={blog.id} >
                <div style={blogview}>{blog.title}  </div>
              </Link>
            ))}</div>
      </div>)}

  const Notification = () => {
    const message = useSelector(({ notification }) => {
      return notification
    })
    if (message === null) {
      return null;
    }
    return (
      <div>
        <h2>{message}</h2>
      </div>
    );
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <div>
        <Notification />
        <div><Link to={'/'}>blogs</Link> <Link to={'/users'}>users</Link> {user.name} logged in <button onClick={handleLogout}>logout</button></div>
      </div>
      <div>
        <h2><strong>blog app</strong></h2>
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<SpecificUser blogs={blogs} removeBlog={deleteBlog} />} />
          <Route path="/blogs/:id" element={ <Blog updateLikes={updateObject} removeBlog={deleteBlog}/>} />
          <Route path="/" element={ <AllTheBlogs /> } />
        </Routes>
      </div>
    </div>
  )
}

export default App
