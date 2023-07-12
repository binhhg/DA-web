import { api } from '../axios'
import * as querystring from 'query-string'
import ApiConfig from '../config'

export const AuthenApi = {
  async login (body) {
    try {
      const { data } = await api.post('/login', body)
      return data
    } catch (e) {
      return null
    }
  },
  async account (body) {
    try {
      const { data } = await api.post('/account', body)
      return data
    } catch (e) {
      return null
    }
  }
}
