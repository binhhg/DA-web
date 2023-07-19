import { api } from '../axios'
import * as querystring from 'query-string'
import queryString from "querystring";
import ApiConfig from '../config'

export const CalendarApi = {
  async addCalendar (body) {
    try {
      const { data } = await api.post(`${ApiConfig.calendar}/event`, body)
      return data
    } catch (e) {
      return null
    }
  },
  async updateCalendar (id,body) {
    try {
      const { data } = await api.put(`${ApiConfig.calendar}/event/${id}`, body)
      return data
    } catch (e) {
      return null
    }
  },
  async getEvent (query) {
    try {
      const { data } = await api.get(`${ApiConfig.calendar}/event?${queryString.stringify(query)}`)
      return data
    } catch (e) {
      return null
    }
  },
  async deleteEvent (id, body) {
    try {
      console.log('body ne ', body)
      const { data } = await api.patch(`${ApiConfig.calendar}/event/${id}`, body)
      return data
    } catch (e) {
      return null
    }
  }
}
