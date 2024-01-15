import { all } from 'redux-saga/effects'
import watchBaseSaga from './reducers/baseReducer/base.action'
import { watchCommonRequestSagas } from './utils/httpRequest/restLib/restWithSaga'

export const rootSaga = function* () {
  yield all([
    watchBaseSaga(),
    watchCommonRequestSagas(),
  ])
}
