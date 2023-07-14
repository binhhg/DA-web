import axios from 'axios'
import ApiConfig from './config'
import eventEmitter from '../utils/eventEmitter'

let token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : 'ssr'
eventEmitter.on('loggedIn', data => {
  console.log('zo day ne')
  const { token: qq } = data
  if (qq) {
    token = qq
    console.log('vao day r nee')
    eventEmitter.emit('ok')
  } else {
    token = 'ssr'
  }
})
export const api = axios.create({
  baseURL: ApiConfig.user,
  headers: {
    'x-access-token': token || 'ssr'
  }
})

api.interceptors.request.use(config => {
  config.headers['x-access-token'] = token || 'ssr'
  return config
})
