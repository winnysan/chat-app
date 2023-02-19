import axios from 'axios'

const ngrokURL = 'https://8452-92-245-31-229.eu.ngrok.io'

const instance = axios.create({
  baseURL: `${ngrokURL}/api`,
})

export default instance
