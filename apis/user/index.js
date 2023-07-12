import { api } from '../axios'
import * as querystring from 'query-string'
import ApiConfig from '../config'

export const UserApi = {
  async getAccount () {
    try {
      const { data } = await api.get('/account')
      return data
    } catch (e) {
      return null
    }
  },
  async getAccountProfile () {
    try {
      const { data } = await api.get('/account/profile')
      return data
    } catch (e) {
      return null
    }
  },
  async getUser () {
    try {
      const { data } = await api.get('/user')
      return data
    } catch (e) {
      return null
    }
  },
  async updateInfo (body) {
    try {
      const { data } = await api.put('/user', body)
      return data
    } catch (e) {
      return null
    }
  }
}
