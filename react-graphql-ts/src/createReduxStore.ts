import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import configureReducer from './configureReducer'

const listenerMiddlewareInstance = createListenerMiddleware({
  onError: () => console.error,
})

export const reduxStore = configureStore({

  reducer: configureReducer({}),

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .prepend(
        listenerMiddlewareInstance.middleware,
      )
      .concat(
      )
  },
})

export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const getDispatch = () => reduxStore.dispatch
export const getStoreState = ({

}) => reduxStore.getState
