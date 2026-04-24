/* eslint-disable react-hooks/refs */
/* eslint-disable react-refresh/only-export-components */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import globalReducer from "./index"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import {Provider} from "react-redux"
import { useRef } from "react";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";
const rootReducer = combineReducers({
    global: globalReducer,
    [api.reducerPath] : api.reducer
})



export const makeStore = ()=>{
    return configureStore({
        reducer: rootReducer,
        middleware:(getDefaultMiddleware)=>
          getDefaultMiddleware().concat(api.middleware)
        
    })
}
// REDUX TYPES

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

export const useAppDispatch = ()=> useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
