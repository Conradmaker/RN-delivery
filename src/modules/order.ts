import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Order {
  orderId: string;
  start: {
    latitude: number;
    longtitude: number;
  };
  end: {
    latitude: number;
    longtitude: number;
  };
  price: number;
}
type OrderState = {
  orders: Order[];
  deliveries: Order[];
};
const initialState: OrderState = {
  orders: [],
  deliveries: [],
};
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    acceotOrder(state, action: PayloadAction<string>) {
      const idx = state.orders.findIndex(v => v.orderId === action.payload);
      if (idx > -1) {
        state.deliveries.push(state.orders[idx]);
        state.orders.splice(idx, 1);
      }
    },
    rejectOrder(state, action: PayloadAction<string>) {
      const idx = state.orders.findIndex(v => v.orderId === action.payload);
      if (idx > -1) {
        state.orders.splice(idx, 1);
      }
      const delivery = state.deliveries.findIndex(
        v => v.orderId === action.payload,
      );
      if (delivery > -1) {
        state.deliveries.splice(delivery, 1);
      }
    },
  },
  extraReducers: builder => {},
});
export default orderSlice;
