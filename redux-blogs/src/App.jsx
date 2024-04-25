import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import userService from './services/users'
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from "./reducers/NotificationReducer"
import { setBlogs, addBlogs, removeBlog, IncreaseLikes } from "./reducers/BlogReducer";


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
      const blogs = await blogService.getAll();
      dispatch(IncreaseLikes(updatedObj));
      dispatch(setNotification(`You voted ${updatedObj.title}`, 5))
    } catch (error) {
      console.log(error);
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
    const blogs = useSelector(({ EveryBlog }) => {
      return EveryBlog
    })

    const sortBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
    console.log(sortBlogs)
    return (
      <div>
        {sortBlogs
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updatedBlog={updateObject}
              deleteBlog={deleteBlog}
            />
          ))}</div>)}

  const Notification = () => {
    const message = useSelector(({ notification }) => {
      return notification
    })
    console.log(message)
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
      <Notification />
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>
      <br />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleNewBlog} />
      </Togglable>
      <div /> <br />
      <AllTheBlogs />
      <br />

    </div>
  );
};

export default App
