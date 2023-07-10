import {ChangeEvent, useRef, useState} from 'react'
import {IUser} from '@/types'
import axios from '@/axios'
import Link from 'next/link'

const HeaderSearch = () => {
    const timeoutRef = useRef<any>()
    const [items, setItems] = useState<IUser[]>([])

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        clearTimeout(timeoutRef.current)

        if (!value) {
            return setItems([])
        }

        if (value.length >= 3) {
            timeoutRef.current = setTimeout(() => {
                axios.get('/api/users', {params: {name: value}})
                    .then(response => {
                        if (response.data.length) {
                            setItems(response.data)
                        }
                    })
            }, 100)
        }
    }

    return (
        <div style={{position: 'relative'}}>
            <input className="search" type="search" placeholder="search" onChange={onChange}/>
            <div style={{position: 'absolute', top: 'calc(100% + 4px)', background: 'grey', width: '100%'}}>
                {items.map(user => (
                    <Link href={`/profile/${user.slug}`}
                          key={user._id}
                          style={{fontSize: '18px'}}>{user.company ? user.company : `${user.firstName} ${user.lastName}`}</Link>
                ))}
            </div>
        </div>
    )
}

export default HeaderSearch
