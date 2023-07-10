import {useState, KeyboardEvent, Dispatch, SetStateAction} from 'react'
import {useAuth} from '@/hooks/useAuth'
import {IPost, IReply} from '@/types'
import axios from '@/axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Avatar from '@/components/Avatar'

interface Props {
    post: IPost
    getPosts: () => void
}

const Post = ({post, getPosts}: Props) => {
    const {user, authorized} = useAuth()
    const [replyText, setReplyText] = useState('')
    const [showReplies, setShowReplies] = useState(false)
    const [loadingReplies, setLoadingReplies] = useState(false)
    const [replies, setReplies] = useState<IReply[]>([])

    const createLiker = (type: string) => {
        return () => {
            if (!authorized) {
                toast.error(`You need to login to ${type} a post`)
                return
            }

            axios.post('/api/likePost', {postId: post._id, type})
                .then(response => {
                    if (response.data.success) {
                        toast.success(response.data.success.message)
                        getPosts()
                    }
                })
        }
    }

    const removePost = () => {
        axios.post('/api/removePost', {postId: post._id})
            .then(response => {
                if (response.data.success) {
                    toast.success(response.data.success)
                    getPosts()
                }
            })
    }

    const getReplies = () => {
        axios.get('/api/replies', {params: {postId: post._id}})
            .then(response => {
                setLoadingReplies(false)
                setReplies(response.data)
            })
    }

    const reply = (e: KeyboardEvent) => {
        if (e.key.includes('Enter')) {
            axios.post('/api/replies', {postId: post._id, title: replyText})
                .then(response => {
                    if (response.data.success) {
                        toast.success(response.data.success.message)
                        setReplyText('')
                        getReplies()
                    }
                })
        }
    }

    const removeReply = (id: string) => {
        axios.post('/api/removeReply', {replyId: id})
            .then(response => {
                if (response.data.success) {
                    toast.success(response.data.success)
                    getReplies()
                }
            })
    }

    const toggleReplies = () => {
        if (showReplies) {
            setShowReplies(false)
        } else {
            setShowReplies(true)
            setLoadingReplies(true)
            getReplies()
        }
    }

    return (
        <div className="message" style={{position: 'relative'}}>
            {post.user?._id === user._id && (
                <div onClick={removePost} style={{position: 'absolute', top: 20, right: 20, cursor: 'pointer'}}>
                    <i className="fa fa-x"></i>
                </div>
            )}
            <Link href={`/profile/${post.user?.slug}`} className="profile">
                <Avatar className="fa-xl" user={post.user} style={{color: 'unset'}}/>
            </Link>
            <div className="infos">
                <h2 className="name">{post.user?.company ? post.user.company : `${post.user?.firstName} ${post.user?.lastName}`}</h2>
                <p className="description"><small>{post.title}</small></p>
                <div className="transactions">
                    {post.likeCount}
                    <div onClick={createLiker('like')}
                         className={`like ${post.userLike?.type === 'like' ? 'active' : ''}`}>
                        <i className={`fa-solid fa-thumbs-up `}/>
                    </div>
                    {post.dislikeCount}
                    <div onClick={createLiker('dislike')}
                         className={`disslike ${post.userLike?.type === 'dislike' ? 'active' : ''}`}>
                        <i className="fa-solid fa-thumbs-down"/>
                    </div>
                    {replies.length ? replies.length : post.replies!.length}
                    <div onClick={toggleReplies} className="add-comment">
                        <i className={`fa-sharp fa-solid fa-comments`}/>
                    </div>
                </div>
                {authorized &&
                  <input className="reply-post" type="text" placeholder="Reply to this post..." value={replyText}
                         onKeyUp={reply} onChange={e => setReplyText(e.target.value)}/>}
                {showReplies && !loadingReplies && (
                    <div>
                        {replies.length ? replies.map(reply => (
                            <div key={reply._id}>
                                {reply.title}
                                {reply.user._id === user._id && (
                                    <button style={{marginLeft: '20px'}} onClick={() => removeReply(reply._id)}>
                                        REMOVE REPLY
                                    </button>
                                )}
                            </div>
                        )) : <p>there are no replies for this post</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Post
