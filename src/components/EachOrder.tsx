/* eslint-disable react-native/no-inline-styles */
import {NavigationProp, useNavigation} from '@react-navigation/native';
import axios, {AxiosError} from 'axios';
import React from 'react';
import {useCallback} from 'react';
import {useState} from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Config from 'react-native-config';
import NaverMapView, {Marker, Path} from 'react-native-nmap';
import {LoggedInParamList} from '../../App';
import {useAppDispatch, useAppSelector} from '../modules';
import orderSlice, {Order} from '../modules/order';
import getDistanceFromLatLonInKm from '../utils';

type EachOrderProps = {
  item: Order;
};
export default function EachOrder({item}: EachOrderProps) {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [detail, setDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const accessToken = useAppSelector(state => state.user.accessToken);
  const dispatch = useAppDispatch();
  const toggleDetail = useCallback(() => setDetail(prev => !prev), []);
  const {end, start} = item;
  const onAccept = useCallback(async () => {
    try {
      setLoading(true);
      await axios.post(
        `${Config.API_URL}/accept`,
        {orderId: item.orderId},
        {headers: {authorization: `Bearer ${accessToken}`}},
      );
      dispatch(orderSlice.actions.acceptOrder(item.orderId));
      setLoading(false);
      navigation.navigate('Delivery'); //다른페이지 이동하는 경우 finally쓰지말자
    } catch (error) {
      let errorResponse = (error as AxiosError).response;
      if (errorResponse?.status === 400) {
        // 타인이 이미 수락한 경우
        Alert.alert('알림', errorResponse.data.message);
        dispatch(orderSlice.actions.rejectOrder(item.orderId));
      }
      setLoading(false);
    }
  }, [dispatch, item, accessToken, navigation]);
  const onReject = useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  }, [dispatch, item]);
  return (
    <View style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Text>
        <Text style={styles.eachInfo}>
          {getDistanceFromLatLonInKm(
            start.latitude,
            start.longitude,
            end.latitude,
            end.longitude,
          ).toFixed(1)}
          km
        </Text>
      </Pressable>
      {detail ? (
        <View>
          <View>
            <View
              style={{
                width: Dimensions.get('window').width - 30,
                height: 200,
                marginTop: 10,
              }}>
              <NaverMapView
                style={{width: '100%', height: '100%'}}
                zoomControl={false}
                center={{
                  zoom: 10,
                  tilt: 0,
                  latitude: (start.latitude + end.latitude) / 2,
                  longitude: (start.longitude + end.longitude) / 2,
                }}>
                <Marker
                  coordinate={{
                    latitude: start.latitude,
                    longitude: start.longitude,
                  }}
                  pinColor="blue"
                />
                <Path
                  coordinates={[
                    {
                      latitude: start.latitude,
                      longitude: start.longitude,
                    },
                    {latitude: end.latitude, longitude: end.longitude},
                  ]}
                />
                <Marker
                  coordinate={{
                    latitude: end.latitude,
                    longitude: end.longitude,
                  }}
                />
              </NaverMapView>
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable
              disabled={loading}
              onPress={onAccept}
              style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable
              disabled={loading}
              onPress={onReject}
              style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
  },
  eachInfo: {
    flex: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
