import {create} from 'zustand'
import {devtools} from 'zustand/middleware'

interface Store {
    notificationBadge: boolean
    setNotificationBadge: (value: boolean) => void
}

const useNotificationStore = create<Store>()(
    devtools((set) => ({
        notificationBadge: false,
        setNotificationBadge: (value) => set(() => ({notificationBadge: value}))
    }))
)

export default useNotificationStore
