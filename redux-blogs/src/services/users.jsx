import axios from 'axios'

const baseUrl = '/api/users'

const getAll = async () => {
  const request = await axios.get(baseUrl)
  console.log(request)
  console.log(request.data)
  return request.data
}

const specificUser = async ( id ) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  console.log(response)
  console.log(response.data)
  return response.data
}

export default { getAll, specificUser }