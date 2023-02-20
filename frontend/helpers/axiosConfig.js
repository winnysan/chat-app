import { API_URL } from '@env'
import axios from 'axios'

const instance = axios.create({
  baseURL: `${API_URL}/api`,
})

export default instance
