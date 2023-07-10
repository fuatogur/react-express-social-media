import useAuthStore from '@/store/useAuthStore'
import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie'

export const useAuth = () => {
    const {authorized, user, login, logout} = useAuthStore()

    return {
        authorized,
        user,
        login(token: string) {
            Cookies.set('token', token, {expires: 30})
            login(jwt.decode(token))
        },
        logout() {
            Cookies.remove('token')
            logout()
        }
    }
}
