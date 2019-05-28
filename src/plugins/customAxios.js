import axios from 'axios'

export default axios.create({
  baseURL: 'https://api.dankookie.com/v2',
  // baseURL: 'http://localhost:3000/v2',
  timeout: 3000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})
