import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delievery';
import Settings from './src/pages/Settings';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import {useAppDispatch, useAppSelector} from './src/modules';
import useSocket from './src/hooks/useSocket';
import {useEffect} from 'react';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import userSlice from './src/modules/user';
import {Alert} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import orderSlice from './src/modules/order';
import usePermissions from './src/hooks/usePermission';
import SplashScreen from 'react-native-splash-screen';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default function AppInner() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [socket, disconnect] = useSocket();
  const [isLoggedIn] = useAppSelector(state => state.user.email);
  const dispatch = useAppDispatch();
  usePermissions();

  useEffect(() => {
    const callback = (data: any) => {
      dispatch(orderSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      console.log(socket);
      //보내고
      socket.emit('acceptOrder', 'hello');
      //받고
      socket.on('order', callback);
    }
    return () => {
      socket?.off('order', callback);
    };
  }, [isLoggedIn, socket, dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          SplashScreen.hide();
          return;
        }
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.error(error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      } finally {
        SplashScreen.hide();
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);
  useEffect(() => {
    // axios.interceptors.request.use(); <- 이걸로 토큰 찾아서 넣을 수 있음
    axios.interceptors.response.use(
      res => {
        return res;
      },
      async error => {
        const {
          config,
          response: {status},
        } = error;
        if (status === 419) {
          const originalReq = config;
          const token = await EncryptedStorage.getItem('refreshToken');
          const {data} = await axios.post(
            `${Config.API_URL}/refreshToken`,
            {},
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            },
          );
          dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
          originalReq.headers.authorization = `Bearer ${data.data.accessToken}`;
          return axios(originalReq);
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator initialRouteName="">
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{
              title: '오더 목록',
              tabBarIcon: ({color}) => (
                <FontAwesome5Icon color={color} name="list" size={16} />
              ),
            }}
          />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{
              title: '지도',
              headerShown: false,
              unmountOnBlur: true,
              tabBarIcon: ({color}) => (
                <FontAwesome5Icon color={color} name="map" size={16} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              title: '내정보',
              unmountOnBlur: true,
              tabBarIcon: ({color}) => (
                <FontAwesomeIcon color={color} name="gear" size={16} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
