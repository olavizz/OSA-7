import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
  };
  return (
    <div>
      <h2>create new</h2>
      <div>
        title:
        <input
          data-testid="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <br />
        author:
        <input
          data-testid="author"
          type="text"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
        />
        <br />
        url:
        <input
          data-testid="url"
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <br />
        <button onClick={addBlog}>create</button>
      </div>
    </div>
  );
};
export default BlogForm;
