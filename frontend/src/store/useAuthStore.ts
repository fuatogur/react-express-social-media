import {create} from 'zustand'
import {devtools} from 'zustand/middleware'

interface Store {
    authorized: boolean
    user: any
    login: (user: any) => void
    logout: () => void
}

const useAuthStore = create<Store>()(
    devtools((set) => ({
        authorized: false,
        user: {},
        login: (user) => set(() => ({user, authorized: true})),
        logout: () => set(() => ({user: {}, authorized: false}))
    }))
)

export default useAuthStore
