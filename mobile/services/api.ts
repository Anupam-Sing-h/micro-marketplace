import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
    android: 'http://10.0.2.2:3000', // For Android Emulator
    ios: 'http://localhost:3000', // For iOS Simulator
    default: 'http://192.168.1.1:3000', // For Physical Device
});

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;
