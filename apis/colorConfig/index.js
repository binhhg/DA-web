import {api} from "../axios";
import ApiConfig from '../config'

export const ColorConfig = {
    async getColorConfig() {
        try {
            const {data} = await api.get('/config')
            return data
        } catch (e) {
            return null
        }
    },
    async changeColorConfig(body) {
        try {
            const {data} = await api.put('/config', body)
            return data
        } catch (e) {
            return null
        }
    }
}
