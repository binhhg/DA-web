const user = process.env.NEXT_USER_URL || 'http://localhost:8501'
const calendar = process.env.NEXT_CALENDAR_URL || 'http://localhost:8503'

const ApiConfig = {
    user,
    calendar
}
export default ApiConfig
