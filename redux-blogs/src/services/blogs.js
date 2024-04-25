import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
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
  console.log(config);
  console.log(newObject);
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

export default { getAll, create, setToken, update, deleblog };
