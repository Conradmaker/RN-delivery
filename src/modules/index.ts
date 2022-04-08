import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {useDispatch, TypedUseSelectorHook, useSelector} from 'react-redux';
import userSlice from './user';

const rootReducer = combineReducers({user: userSlice.reducer});

const store = configureStore({reducer: rootReducer});

export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof rootReducer>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
