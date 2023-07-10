import defaultAxios from 'axios'
import Cookies from 'js-cookie'

const axios = defaultAxios.create({
    baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT
})

axios.interceptors.request.use((value) => {
    const token = Cookies.get('token')

    if (token) {
        value.headers['Authorization'] = `Bearer ${token}`
    }

    return value
})

export default axios
