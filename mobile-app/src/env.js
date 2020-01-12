import {Platform} from 'react-native';

export const SOCKET_URL = __DEV__ ? 'http://localhost:5555' : 'https://ad-battleship.herokuapp.com/';
export const PLATFORM = Platform.OS;
