import {FormEvent, useEffect, useState} from 'react'
import {NextPageWithLayout} from '@/types'
import {useRouter} from 'next/router'
import {useAuth} from '@/hooks/useAuth'
import Link from 'next/link'
import axios from '@/axios'
import toast from 'react-hot-toast'
import Head from 'next/head'

const specialCharactersPattern = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

const SignUp: NextPageWithLayout = () => {
    const router = useRouter()
    const {login, authorized} = useAuth()
    const [isCompany, setIsCompany] = useState(false)
    const [username, setUsername] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [company, setCompany] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const submit = (e: FormEvent) => {
        e.preventDefault()

        if (specialCharactersPattern.test(username)) {
            toast.error('Username cannot contain special characters')
            return
        }

        if (password.toLowerCase() !== confirmPassword.toLowerCase()) {
            toast.error('Password and confirm password doesn\'t match')
            return
        }

        axios.post('/api/register', {
            firstName,
            lastName,
            username,
            company,
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
                <title>Sign up</title>
            </Head>
            <form onSubmit={submit} className="form-area">
                <h1>Sign Up</h1>
                <div className="radio-area">
                    <div className="radio">
                        <input id="radio1" checked={!isCompany} onChange={() => setIsCompany(false)} type="radio"/>
                        <label htmlFor="radio1">Personal</label>
                    </div>
                    <div className="radio">
                        <input id="radio2" checked={isCompany} onChange={() => setIsCompany(true)} type="radio"/>
                        <label htmlFor="radio2">Company</label>
                    </div>
                </div>
                <div className="text-area">
                    {isCompany ? (
                        <div className="label-and-text">
                            <label htmlFor="companyname">Company Name</label>
                            <span>:</span>
                            <input id="companyname" type="text" placeholder="company name" value={company}
                                   onChange={e => setCompany(e.target.value)} required/>
                        </div>
                    ) : (
                        <>
                            <div className="label-and-text">
                                <label htmlFor="firstname">First Name</label>
                                <span>:</span>
                                <input id="firstname" type="text" placeholder="first name" value={firstName}
                                       onChange={e => setFirstName(e.target.value)} required/>
                            </div>
                            <div className="label-and-text">
                                <label htmlFor="lastname">Last Name</label>
                                <span>:</span>
                                <input id="lastname" type="text" placeholder="last name" value={lastName}
                                       onChange={e => setLastName(e.target.value)} required/>
                            </div>
                        </>
                    )}
                    <div className="label-and-text">
                        <label htmlFor="username">Username</label>
                        <span>:</span>
                        <input id="username" type="text" placeholder="username" value={username}
                               onChange={e => setUsername(e.target.value)} required/>
                    </div>
                    <div className="label-and-text">
                        <label htmlFor="email">Email</label>
                        <span>:</span>
                        <input id="email" type="text" placeholder="email" value={email}
                               onChange={e => setEmail(e.target.value)} required/>
                    </div>
                    <div className="label-and-text">
                        <label htmlFor="password">Password</label>
                        <span>:</span>
                        <input id="password" type="password" placeholder="password" value={password}
                               onChange={e => setPassword(e.target.value)} required/>
                    </div>
                    <div className="label-and-text">
                        <label htmlFor="cpassword">Confirm Password</label>
                        <span>:</span>
                        <input id="cpassword" type="password" placeholder="confirm password" value={confirmPassword}
                               onChange={e => setConfirmPassword(e.target.value)} required/>
                    </div>
                </div>
                <div className="create-account">
                    <button className="btn">Create Account</button>
                    <p>If you have an account <Link href="/login">Login</Link></p>
                </div>
            </form>
        </>
    )
}

export default SignUp
