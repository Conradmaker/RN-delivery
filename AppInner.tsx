import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Orders from './src/pages/Orders';
import Delievery from './src/pages/Delievery';
import Settings from './src/pages/Settings';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import {useAppSelector} from './src/modules';

export default function AppInner() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [isLoggedIn, setIsLoggedIn] = useAppSelector(state => state.user.email);
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator initialRouteName="">
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{title: '오더 목록'}}
          />
          <Tab.Screen
            name="Delievery"
            component={Delievery}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{title: '내정보'}}
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
