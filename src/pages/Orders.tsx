import React from 'react';
import {FlatList, ListRenderItem, Text, View} from 'react-native';
import EachOrder from '../components/EachOrder';
import {useAppSelector} from '../modules';
import {Order} from '../modules/order';

export default function Orders() {
  const orders = useAppSelector(state => state.order.orders);
  const renderItem: ListRenderItem<Order> = React.useCallback(
    ({item}) => <EachOrder item={item} />,
    [],
  );
  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.orderId}
      renderItem={renderItem}
    />
  );
}
