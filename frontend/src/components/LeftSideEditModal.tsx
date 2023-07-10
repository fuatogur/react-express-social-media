import Modal from './Modal'
import {FormEvent, useState} from 'react'
import axios from '@/axios'
import toast from 'react-hot-toast'
import {useAuth} from '@/hooks/useAuth'
import {IUser} from '@/types'
import {useRouter} from 'next/router'

interface Props {
    isOpen: boolean
    onRequestClose: () => void
    user: IUser
}

const LeftSideEditModal = ({user, isOpen, onRequestClose}: Props) => {
    const {login} = useAuth()
    const [phone, setPhone] = useState(user.phone)
    const [instagram, setInstagram] = useState(user.instagram)
    const router = useRouter()

    const submit = (e: FormEvent) => {
        e.preventDefault()

        axios.post('/api/updateUserData', {
            phone,
            instagram
        }).then(response => {
            const data = response.data

            if (data.error) {
                toast.error(data.error)
            } else if (data.success) {
                toast.success(data.success.message)
                onRequestClose()
                login(data.success.token)
                router.reload()
            }
        })
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <form onSubmit={submit}>
                <div>
                    <label htmlFor="phone">PHONE: </label>
                    <input id="phone" type="text" value={phone}
                           onChange={e => setPhone(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="instagram">INSTAGRAM: </label>
                    <input id="instagram" type="text" value={instagram}
                           onChange={e => setInstagram(e.target.value)}/>
                </div>
                <button className="btn" style={{width: '100%', marginTop: '20px'}}>Update</button>
            </form>
        </Modal>
    )
}

export default LeftSideEditModal
