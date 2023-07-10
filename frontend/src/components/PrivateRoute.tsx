import {ReactElement} from 'react'
import {useAuth} from '@/hooks/useAuth'
import Link from 'next/link'

interface Props {
    children: ReactElement
}

const PrivateRoute = ({children}: Props) => {
    const {authorized} = useAuth()

    if (!authorized) {
        return (
            <div>
                <p>You don't have permission to view this page</p>
                <Link style={{background: 'gray'}} href="/">Go Home</Link>
            </div>
        )
    }

    return children
}

export default PrivateRoute
