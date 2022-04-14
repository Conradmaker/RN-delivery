import React, {useCallback} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../modules/user';
import {useSelector} from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';
import {RootState, useAppDispatch} from '../modules';
import {useEffect} from 'react';
import orderSlice, {Order} from '../modules/order';
import FastImage from 'react-native-fast-image';

function Settings() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const money = useSelector((state: RootState) => state.user.money);
  const name = useSelector((state: RootState) => state.user.name);
  const completes = useSelector((state: RootState) => state.order.completes);
  const dispatch = useAppDispatch();
  const onLogout = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL}/logout`,
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );
      Alert.alert('알림', '로그아웃 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    async function getMoney() {
      const {data} = await axios.get(`${Config.API_URL}/showmethemoney`, {
        headers: {authorization: `Bearer ${accessToken}`},
      });
      console.log(data);
      dispatch(userSlice.actions.setMoney(data.data));
    }
    getMoney();
  }, [dispatch, accessToken]);

  useEffect(() => {
    async function getCompletes() {
      const {data} = await axios.get(`${Config.API_URL}/completes`, {
        headers: {authorization: `Bearer ${accessToken}`},
      });
      console.log(data);
      dispatch(orderSlice.actions.setCompletes(data.data));
    }
    getCompletes();
  }, [dispatch, accessToken]);

  const renderItem: ListRenderItem<Order> = React.useCallback(({item}) => {
    return (
      <FastImage
        source={{uri: `${Config.API_URL}/${item.image}`}}
        resizeMode="contain"
        style={{
          height: Dimensions.get('window').height / 3,
          width: Dimensions.get('window').width / 3,
        }}
      />
    );
  }, []);
  return (
    <View>
      <View style={styles.money}>
        <Text style={styles.moneyText}>
          {name}님의 수익금{' '}
          <Text style={styles.bold}>
            {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Text>
          원
        </Text>
      </View>
      <View>
        <FlatList
          numColumns={3}
          data={completes}
          keyExtractor={o => o.orderId}
          renderItem={renderItem}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={[styles.loginButton, styles.loginButtonActive]}
          onPress={onLogout}>
          <Text style={styles.loginButtonText}>로그아웃</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  money: {
    padding: 20,
  },
  bold: {fontWeight: 'bold'},
  moneyText: {
    fontSize: 16,
  },
  buttonZone: {
    alignItems: 'center',
    paddingTop: 20,
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Settings;
