import {createElement} from 'react'
import {IUser} from '@/types'
import classnames from 'classnames'

interface Props {
    user: IUser | undefined
    className?: string
    style?: object
}

const Avatar = ({user, className, style}: Props) => {
    if (user?.avatar) {
        return createElement(
            'img',
            {
                style: {borderRadius: '50%', height: '100%', width: '100%'},
                src: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/avatars/${user.avatar}`,
                alt: user.slug
            }
        )
    }

    return createElement(
        'i',
        {
            style: {color: 'white', ...style},
            className: classnames(className, 'fa-solid', user?.company ? 'fa-warehouse' : 'fa-user')
        }
    )
}

export default Avatar
