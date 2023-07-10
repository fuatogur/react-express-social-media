import Pusher from 'pusher-js'

export default new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: 'eu'
})
