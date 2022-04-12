import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  accessToken: '',
  money: 0,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
    setMoney(state, action) {
      state.money = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },
});
export default userSlice;
