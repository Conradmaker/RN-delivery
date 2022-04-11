import {useCallback} from 'react';
import Config from 'react-native-config';
import {io, Socket} from 'socket.io-client';

// 여기 있으면 useSocket에 대해 전역변수로 된다.
let socket: Socket | undefined;
const useSocket = (): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);
  if (!socket) {
    socket = io(Config.API_URL, {
      // 웹소켓 지원 안되는 브라우저에서는 롱풀링 추가
      transports: ['websocket'],
    });
  }
  return [socket, disconnect];
};

export default useSocket;
