import {useEffect, useState} from 'react'
import {IUser, NextPageWithLayout} from '@/types'
import Head from 'next/head'
import axios from '@/axios'
import ConnectionCard from '@/components/ConnectionCard'

const Connections: NextPageWithLayout = () => {
    const [connections, setConnections] = useState<IUser[]>([])

    useEffect(() => {
        getConnections()
    }, [])

    const getConnections = () => {
        axios.get('/api/connections')
            .then(response => {
                if (response.data) {
                    setConnections(response.data)
                }
            })
    }

    return (
        <>
            <Head>
                <title>Connections</title>
            </Head>
            <div className="notification-area">
                <h2>Connections</h2>
                <div className="connections">
                    {connections.map(connection => (
                        <ConnectionCard key={connection._id} connection={connection} getConnections={getConnections}/>
                    ))}
                </div>
            </div>
        </>
    )
}

Connections.authorization = true

export default Connections
