import { io } from 'socket.io-client';

const socket = io('http://192.168.1.44:3006'); // Thay bằng URL server của bạn

export default socket;