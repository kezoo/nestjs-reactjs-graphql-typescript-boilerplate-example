import { all } from 'redux-saga/effects'
import watchBaseSaga from './reducers/baseReducer/base.action'

export const rootSaga = function* () {
  yield all([
    watchBaseSaga(),
  ])
}
