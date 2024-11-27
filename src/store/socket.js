import { io } from 'socket.io-client';

const socket = io('http://103.130.213.92:3006'); // Thay bằng URL server của bạn

export default socket;