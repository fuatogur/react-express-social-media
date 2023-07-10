import {IUser} from '@/types'
import axios from '@/axios'
import toast from 'react-hot-toast'
import Avatar from '@/components/Avatar'

const ConnectionCard = ({connection, getConnections}: { connection: IUser, getConnections: () => void }) => {
    const remove = () => {
        axios.post('/api/removeConnection', {userId: connection._id})
            .then(response => {
                if (response.data.success) {
                    toast.success(response.data.success.message)
                    getConnections()
                }
            })
    }

    return (
        <div className="connection">
            <div className="connection-wrapper">
                <div className="connection-profile">
                    <Avatar user={connection}/>
                </div>
                <div
                    className="connection-name">{connection.company ? connection.company : `${connection.firstName} ${connection.lastName}`}</div>
                <div className="connection-job">{connection.about}</div>
            </div>
            <button onClick={remove} className="connection-remove">Remove</button>
        </div>
    )
}

export default ConnectionCard
