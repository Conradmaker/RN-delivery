import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Order {
  orderId: string;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  price: number;
  image?: string;
  completedAt: string;
  rider?: string;
}
type OrderState = {
  orders: Order[];
  deliveries: Order[];
  completes: Order[];
};
const initialState: OrderState = {
  orders: [],
  deliveries: [],
  completes: [],
};
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    acceptOrder(state, action: PayloadAction<string>) {
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
    setCompletes(state, action: PayloadAction<Order[]>) {
      state.completes = action.payload;
    },
  },
  extraReducers: builder => {},
});
export default orderSlice;
