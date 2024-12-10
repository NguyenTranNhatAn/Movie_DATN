import { io } from 'socket.io-client';

const socket = io('http://103.69.193.151:3006'); // Thay bằng URL server của bạn

export default socket;