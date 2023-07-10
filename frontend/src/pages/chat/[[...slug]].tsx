import {useEffect, useState} from 'react'
import {IConversation, NextPageWithLayout} from '@/types'
import {useRouter} from 'next/router'
import {useAuth} from '@/hooks/useAuth'
import {Channel} from 'pusher-js'
import Head from 'next/head'
import Conversations from '@/components/Conversations'
import SendMessage from '@/components/SendMessage'
import pusher from '@/pusher'
import axios from '@/axios'

const Chat: NextPageWithLayout = () => {
    const {user} = useAuth()
    const [conversations, setConversations] = useState<IConversation[]>([])
    const router = useRouter()
    const {query, isReady} = router
    const slug = query.slug?.[0]

    const getConversations = () => {
        axios.get('/api/conversations', {params: {slug}})
            .then(response => {
                if (!slug) {
                    if (response.data.length) {
                        router.push('/chat/' + response.data[0].members.find((member: any) => member._id !== user._id)!.slug)
                    } else {
                        router.push('/')
                    }
                    return
                }
                setConversations(response.data)
            })
    }

    useEffect(() => {
        let channel: Channel

        if (isReady) {
            getConversations()

            channel = pusher.subscribe('user_' + user._id)

            channel.bind('chat', (data: any) => {
                if (data.type === 'new') {
                    getConversations()
                }
            })
        }

        return () => {
            channel?.unbind('chat')
        }
    }, [slug, isReady, user._id])

    return (
        <>
            <Head>
                <title>Chat</title>
            </Head>
            <div className="notification-area" style={{margin: '30px auto 0'}}>
                <h2>Chat</h2>
                <div className="chat-area-container">
                    <Conversations conversations={conversations}/>
                    {slug && <SendMessage/>}
                </div>
            </div>
        </>
    )
}

Chat.authorization = true

export default Chat
