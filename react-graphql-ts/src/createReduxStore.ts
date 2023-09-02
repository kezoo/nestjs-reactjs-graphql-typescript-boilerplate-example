import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import configureReducer from './configureReducer'
import { rootSaga } from './configureRootSaga'

const listenerMiddlewareInstance = createListenerMiddleware({
  onError: () => console.error,
})
const sagaMiddleware = createSagaMiddleware()

export const reduxStore = configureStore({

  reducer: configureReducer({}),

  middleware: (getDefaultMiddleware) => {

    const mWares = getDefaultMiddleware()
      .prepend(
        listenerMiddlewareInstance.middleware,
      )
      .concat(
        sagaMiddleware,
      )

    return mWares
  },
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const getDispatch = () => reduxStore.dispatch
export const getStoreState = ({

}) => reduxStore.getState
