import {FormEvent, Fragment, useEffect, useRef, useState} from 'react'
import axios from '@/axios'
import {useAuth} from '@/hooks/useAuth'
import Avatar from '@/components/Avatar'
import {IMessage} from '@/types'
import {useRouter} from 'next/router'
import {Channel} from 'pusher-js'
import pusher from '@/pusher'

const SendMessage = () => {
    const {user} = useAuth()
    const [messages, setMessages] = useState<IMessage[]>([])
    const [message, setMessage] = useState('')
    const chatAreaRef = useRef<HTMLDivElement | null>(null)
    const router = useRouter()
    const {query} = router
    const slug = query.slug?.[0]

    const sendMessage = (e: FormEvent) => {
        e.preventDefault()

        setMessage('')

        axios.post('/api/messages', {slug, message})
            .then(response => {
                if (response.data.success) {
                    getMessages()
                }
            })
    }

    const getMessages = () => {
        axios.get('/api/messages', {params: {slug}})
            .then(response => {
                if (response.data.error === 'not-found') {
                    router.push('/')
                    return
                }
                setMessages(response.data)
            })
    }

    useEffect(() => {
        getMessages()

        const channel = pusher.subscribe('user_' + user._id)

        channel.bind('chat', (data: any) => {
            if (data.type === 'new') {
                getMessages()
            }
        })

        return () => {
            channel.unbind('chat')
        }
    }, [slug, user._id])

    useEffect(() => {
        chatAreaRef.current!.scrollTop = chatAreaRef.current!.scrollHeight
    }, [messages])

    return (
        <div className="chat-area">
            <div className="sidebar">
                <div className="chat-sidebar-profile">
                    <i className="fa-solid fa-user" style={{color: 'black'}}></i>
                </div>
                <div className="chat-sidebar-name">{slug}</div>
            </div>
            <div className="chat-area-content">
                <div ref={chatAreaRef} className="chat-area-content-2">
                    {messages.map(message => (
                        <Fragment key={message._id}>
                            {message.user._id === user._id && (
                                <div className="right-message">
                                    {message.message}
                                </div>
                            )}
                            {message.user._id !== user._id && (
                                <div className="left-message">
                                    <div className="left-message-profile">
                                        <Avatar user={message.user}/>
                                    </div>
                                    <div className="left-message-content">
                                        {message.message}
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="chat-area-send-message">
                    <input type="text" placeholder="Enter a message" value={message}
                           onChange={e => setMessage(e.target.value)}/>
                    <button>Send <i className="fa-solid fa-angle-right"></i></button>
                </form>
            </div>
        </div>
    )
}

export default SendMessage
