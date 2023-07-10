import {useEffect, useState} from 'react'
import {GetServerSidePropsContext} from 'next'
import {NextPageWithLayout, IUser} from '@/types'
import {useAuth} from '@/hooks/useAuth'
import {useRouter} from 'next/router'
import Head from 'next/head'
import LeftSideEditModal from '@/components/LeftSideEditModal'
import RightSideEditModal from '@/components/RightSideEditModal'
import ConnectionButton from '@/components/ConnectionButton'
import Avatar from '@/components/Avatar'
import axios from '@/axios'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Props {
    user: IUser
}

const Profile: NextPageWithLayout<Props> = ({user}) => {
    const {user: signedUser, authorized, login} = useAuth()
    const [leftSideModalOpen, setLeftSideModalOpen] = useState(false)
    const [rightSideEditModal, setRightSideModalOpen] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
    const [showAvatarIcon, setShowAvatarIcon] = useState(false)
    const router = useRouter()

    const currentUser = signedUser._id === user._id

    useEffect(() => {
        if (authorized && !currentUser) {
            axios.get('/api/connection', {params: {userId: user._id}})
                .then(response => {
                    if (response.data.success) {
                        setConnectionStatus(response.data.success.status)
                    }
                })
        }
    }, [authorized, currentUser])

    const openLeftSideModal = () => {
        setLeftSideModalOpen(true)
    }

    const closeLeftSideModal = () => {
        setLeftSideModalOpen(false)
    }

    const openRightSideModal = () => {
        setRightSideModalOpen(true)
    }

    const closeRightSideModal = () => {
        setRightSideModalOpen(false)
    }

    const openAvatar = () => {
        if (currentUser) {
            setShowAvatarIcon(true)
        }
    }

    const closeAvatar = () => {
        if (currentUser) {
            setShowAvatarIcon(false)
        }
    }

    const changeAvatar = () => {
        if (showAvatarIcon) {
            const input = document.createElement('input')
            input.type = 'file'

            input.onchange = (e) => {
                const target = e.target as HTMLInputElement

                if (target.files?.length) {
                    const formData = new FormData

                    formData.append('file', target.files![0])

                    axios.post('/api/changeAvatar', formData)
                        .then(response => {
                            if (response.data.error) {
                                toast.error(response.data.error)
                            } else if (response.data.success) {
                                toast.success(response.data.success.message)
                                login(response.data.success.token)
                                router.reload()
                            }
                        })
                }
            }

            input.click()
        }
    }

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            {currentUser &&
              <LeftSideEditModal isOpen={leftSideModalOpen}
                                 onRequestClose={closeLeftSideModal}
                                 user={user}
              />
            }
            {currentUser &&
              <RightSideEditModal isOpen={rightSideEditModal}
                                  onRequestClose={closeRightSideModal}
                                  user={user}
              />
            }
            <div className="gray-bg"></div>
            <div className="profile-area">
                <div className="profile-left">
                    <div onClick={changeAvatar} onMouseEnter={openAvatar} onMouseLeave={closeAvatar}
                         className="profile-pic" style={showAvatarIcon ? {background: 'grey'} : {}}>
                        {!showAvatarIcon ? <Avatar user={user}/> :
                            <i style={{color: 'white'}} className="fa-solid fa-pencil"/>}
                    </div>
                    <h2 className="profile-name">{user.company ? user.company : `${user.firstName} ${user.lastName}`}</h2>
                    <ConnectionButton
                        connectionStatus={connectionStatus}
                        setConnectionStatus={setConnectionStatus}
                        userId={user._id}
                    />
                    {authorized && !currentUser && <Link href={`/chat/${user.slug}`} className="btn">Chat</Link>}
                    <div className="contact-area">
                        <div className="contacts">
                            <div className="contact">
                                <i className="fa-solid fa-phone"></i>
                                <p>{user.phone || 'not specified'}</p>
                            </div>
                            <div className="contact">
                                <i className="fa-solid fa-envelope"></i>
                                <p>{user.email}</p>
                            </div>
                            <div className="contact">
                                <i className="fa-brands fa-instagram"></i>
                                <p>{user.instagram ? '@' + user.instagram : 'not specified'}</p>
                            </div>
                            {currentUser &&
                              <i onClick={openLeftSideModal} className="fa-sharp fa-solid fa-pencil pencil"/>}
                        </div>
                    </div>
                </div>
                <div className="profile-right">
                    <div className="content" style={{height: '200px'}}>
                        <div className="content-top">
                            <p className="content-heading">About</p><br/>
                            {currentUser &&
                              <i onClick={openRightSideModal} className="fa-sharp fa-solid fa-pencil pencil"/>}
                        </div>
                        <div className="content-bottom">{user.about}</div>
                    </div>
                    <div className="content">
                        <div className="content-top">
                            <p className="content-heading">Interests</p>
                            {/*<i className="fa-sharp fa-solid fa-pencil pencil"></i>*/}
                        </div>
                        <div className="content-bottom">
                            <ul>
                                {user.interests.map(interest => (
                                    <li key={interest._id as string}>{interest.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="content">
                        <div className="content-top">
                            <p className="content-heading">Education</p>
                            {/*<i className="fa-solid fa-plus"></i>*/}
                        </div>
                        <div className="content-bottom">
                            <ul>
                                {user.education.map(item => (
                                    <li key={item._id as string}>{item.name} {new Date(item.date).toLocaleDateString()}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="content">
                        <div className="content-top">
                            <p className="content-heading">Experience</p>
                            {/*<i className="fa-solid fa-plus"></i>*/}
                        </div>
                        <div className="content-bottom">
                            <ul>
                                {user.experiences.map(experience => (
                                    <li key={experience._id as string}>{experience.name} {new Date(experience.date).toLocaleDateString()}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="content">
                        <div className="content-top">
                            <p className="content-heading">Skills</p>
                            {/*<i className="fa-solid fa-plus"></i>*/}
                        </div>
                        <div className="content-bottom">
                            <ul>
                                {user.skills.map(skill => (
                                    <li key={skill._id as string}>{skill.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="content content-2">
                        <p className="content-heading">Recommendations</p>
                        <div className="content-comments">
                            <div className="content-comment">
                                <div className="content-comment-profile">
                                    <i className="fa-solid fa-user" style={{color: 'white'}}></i>
                                </div>
                                <div className="content-comment-infos">
                                    <div className="content-comment-name">Buğra Barış Osma</div>
                                    <p className="content-comment-desc">-"Great Voice"</p>
                                </div>
                            </div>
                            <div className="content-comment">
                                <div className="content-comment-profile">
                                    <i className="fa-solid fa-user" style={{color: 'white'}}></i>
                                </div>
                                <div className="content-comment-infos">
                                    <div className="content-comment-name">Chuck Schuldiner</div>
                                    <p className="content-comment-desc">-"Not good at guitar TBH"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async ({params}: GetServerSidePropsContext) => {
    let user

    try {
        user = await axios.get('/api/user', {params})
    } catch (e) {
        return {notFound: true}
    }

    if (!user.data) {
        return {notFound: true}
    }

    return {
        props: {user: user.data}
    }
}

export default Profile
