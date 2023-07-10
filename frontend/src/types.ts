import {NextPage} from 'next'
import {ReactElement} from 'react'
import {AppProps} from 'next/app'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactElement
    authorization?: boolean
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

interface Model {
    _id: string
    createdAt: string
}

export interface IInterest extends Model {
    name: string
}

export interface IEducation extends Model {
    name: string
    date: string
}

export interface IExperience extends Model {
    name: string
    date: string
}

export interface ISkill extends Model {
    name: string
}

export interface INotification extends Model {
    connectionUser: IUser
    user: string
    title: string
    type: string
    typeId: string
}

export interface IUser extends Model {
    slug: string
    firstName?: string
    lastName?: string
    company?: string
    email: string
    password?: string
    phone: string
    avatar: string | null
    instagram: string
    about: string
    interests: IInterest[]
    education: IEducation[]
    experiences: IExperience[]
    skills: ISkill[]
    notifications: INotification[]
    connections: string[]
}

export interface ILike extends Model {
    type: string
    user?: IUser
}

export interface IReply extends Model {
    title: string
    user: IUser
}

export interface IPost extends Model {
    title: string
    likeCount: number
    dislikeCount: number
    user?: IUser
    userLike?: ILike
    likes?: ILike[]
    replies?: IReply[]
}

export interface IJob extends Model {
    user?: IUser
    title: string
    location: string
    role: string
}

export interface IConversation extends Model {
    members: IUser[]
}

export interface IMessage extends Model {
    conversation: IConversation
    user: IUser
    message: string
}
