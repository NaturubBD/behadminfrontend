import { apiUrl } from 'config/axios.config'
import { io } from 'socket.io-client'

const socket = io(apiUrl, {
  reconnectionDelayMax: 10000,
  path: '/socket',
  autoConnect: false,
  transports: ['websocket'],
})

export default socket
