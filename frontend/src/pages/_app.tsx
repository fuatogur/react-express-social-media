import '@/styles/style.css'
import {useEffect} from 'react'
import {Channel} from 'pusher-js'
import {AppPropsWithLayout} from '@/types'
import toast, {Toaster} from 'react-hot-toast'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'
import useAuthStore from '@/store/useAuthStore'
import useNotificationStore from '@/store/useNotificationStore'
import jwt from 'jsonwebtoken'
import Modal from 'react-modal'
import pusher from '@/pusher'
import axios from '@/axios'
import Layout from '@/components/Layout'

Modal.setAppElement('#__next')

const PrivateRoute = dynamic(() => import('@/components/PrivateRoute'), {
    ssr: false
})

export default function App({Component, pageProps}: AppPropsWithLayout) {
    const requiresAuthentication = Component.authorization ?? false
    const user = useAuthStore(state => state.user)
    const login = useAuthStore(state => state.login)
    const setNotificationBadge = useNotificationStore(state => state.setNotificationBadge)

    useEffect(() => {
        const token = Cookies.get('token')

        if (token) {
            const decoded = jwt.decode(token)
            login(decoded)

            axios.get('/api/hasNotification')
                .then(response => {
                    if (response.data) {
                        setNotificationBadge(true)
                    }
                })
        }
    }, [])

    useEffect(() => {
        let channel: Channel

        if (user._id) {
            channel = pusher.subscribe('user_' + user._id)

            channel.bind('notification', (data: any) => {
                toast.success(data)
                setNotificationBadge(true)
            })
        }

        return () => {
            channel?.unsubscribe()
        }
    }, [user._id])

    return (
        <>
            <Head>
                <title>Social media</title>
            </Head>
            <Toaster/>
            {requiresAuthentication ? (
                <PrivateRoute>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </PrivateRoute>
            ) : (
                <Layout>
                    <Component {...pageProps}/>
                </Layout>
            )}
        </>
    )
}
