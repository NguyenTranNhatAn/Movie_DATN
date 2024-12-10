import { io } from 'socket.io-client';

const socket = io('http://103.130.213.92:8866'); // Thay bằng URL server của bạn

export default socket;