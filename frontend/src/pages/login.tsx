import {NextPageWithLayout} from '@/types'
import Link from 'next/link'
import Head from 'next/head'
import {useAuth} from '@/hooks/useAuth'
import {useRouter} from 'next/router'
import {FormEvent, useEffect, useState} from 'react'
import axios from '@/axios'
import toast from 'react-hot-toast'

const Login: NextPageWithLayout = () => {
    const router = useRouter()
    const {login, authorized} = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submit = (e: FormEvent) => {
        e.preventDefault()

        axios.post('/api/login', {
            email,
            password
        }).then(response => {
            const data = response.data

            if (data.error) {
                toast.error(data.error)
            } else if (data.success) {
                // show a successful toast to user
                toast.success(data.success.message)
                login(data.success.token)
            }
        })
    }

    useEffect(() => {
        if (authorized) {
            router.push('/')
        }
    }, [authorized])

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <form onSubmit={submit} className="form-area">
                <h1>Login</h1>
                <div className="text-area">
                    <div className="label-and-text">
                        <label htmlFor="email">Email</label>
                        <span>:</span>
                        <input id="email" type="text" placeholder="email" value={email}
                               onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className="label-and-text">
                        <label htmlFor="password">Password</label>
                        <span>:</span>
                        <input id="password" type="password" placeholder="password" value={password}
                               onChange={e => setPassword(e.target.value)}/>
                    </div>
                </div>
                <div className="create-account">
                    <button className="btn">Login</button>
                    <p>If you don't have an account <Link href="sign-up">Register Now</Link></p>
                </div>
            </form>
        </>
    )
}

export default Login
