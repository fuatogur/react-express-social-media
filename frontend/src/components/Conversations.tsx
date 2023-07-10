import {useAuth} from '@/hooks/useAuth'
import {useRouter} from 'next/router'
import Avatar from '@/components/Avatar'
import {IConversation} from '@/types'
import Link from 'next/link'

interface Props {
    conversations: IConversation[]
}

const Conversations = ({conversations}: Props) => {
    const {user} = useAuth()
    const {query} = useRouter()
    const slug = query.slug?.[0]

    return (
        <div className="users">
            {conversations.map(conversation => (
                <Link key={conversation._id}
                      href={`/chat/${conversation.members.find(member => member._id !== user._id)!.slug}`}
                      shallow
                      className={`user ${conversation.members.some(member => member.slug === slug) ? 'active' : ''}`}>
                    <div className="user-profile">
                        <Avatar user={conversation.members.find(member => member._id !== user._id)}/>
                    </div>
                    <div
                        className="user-name">{conversation.members.find(member => member._id !== user._id)?.slug || 'Unknown'}</div>
                </Link>
            ))}
        </div>
    )
}

export default Conversations
