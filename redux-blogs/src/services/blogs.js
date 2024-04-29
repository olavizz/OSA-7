import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(
    `${baseUrl}/${newObject.id}`,
    newObject,
    config,
  );
  return response.data;
};

const deleblog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(
    `${baseUrl}/${blog.blog.id}`,
    config,
  );
  return response.data;
};

const getComments = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}/comments`)
    return response.data
  } catch (error) {
    console.log(error.message)
  }
}

const addComment = async (id, comment) => {
  const object = {
    'id': id,
    'content': comment
  }
  const response = await axios.post(`${baseUrl}/${id}/comments`, object)
  console.log(response)
}

export default { getAll, create, setToken, update, deleblog, getComments, addComment };
