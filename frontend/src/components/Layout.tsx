import {PropsWithChildren} from 'react'
import {useRouter} from 'next/router'
import {useAuth} from '@/hooks/useAuth'
import Link from 'next/link'
import HeaderSearch from '@/components/HeaderSearch'
import useNotificationStore from '@/store/useNotificationStore'

const Layout = ({children}: PropsWithChildren) => {
    const {user, authorized, logout: logoutImpl} = useAuth()
    const notificationBadge = useNotificationStore(state => state.notificationBadge)
    const router = useRouter()

    const logout = () => {
        logoutImpl()
        router.push('/login')
    }

    return (
        <>
            <header>
                <Link href="/" className="header-logo">
                    <i>Homepage</i>
                </Link>
                {authorized ? (
                    <>
                        <HeaderSearch/>
                        <div className="header-buttons">
                            <Link href="/feed" className="box"><i
                                className="fa-solid fa-feed fa-lg"></i></Link>
                            <Link href={`/profile/${user.slug}`} className="box"><i
                                className="fa-solid fa-user fa-lg"></i></Link>
                            <Link href="/notifications" className="box"><i
                                className="fa-solid fa-bell fa-lg"
                                style={notificationBadge ? {color: 'red'} : {}}></i></Link>
                            <Link href="/connections" className="box"><i
                                className="fa-solid fa-user-group fa-lg"></i></Link>
                            <Link href="/chat" className="box"><i className="fa-solid fa-message fa-lg"/></Link>
                            <Link href="/jobs" className="box"><i
                                className="fa-solid fa-briefcase fa-lg"></i></Link>
                            <Link href={`/profile/${user.slug}`} className="box"><i
                                className="fa-sharp fa-solid fa-gear fa-lg"></i></Link>
                            <button onClick={logout} className="box"><i className="fa-solid fa-power-off fa-lg"></i>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="header-buttons">
                        <Link href="/login">Login</Link>
                        <Link href="/sign-up">Sign Up</Link>
                    </div>
                )}
            </header>
            {children}
        </>
    )
}

export default Layout
