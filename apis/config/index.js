const user = process.env.USER_URL || 'http://localhost:8501'
const calendar = process.env.CALENDAR_URL || 'http://localhost:8503'

const ApiConfig = {
    user,
    calendar
}
export default ApiConfig
