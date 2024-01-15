import { put, takeEvery } from 'redux-saga/effects'
import { TEST_BASE_ACTION, TEST_BASE_ACTION_SAGA } from './base.action.constant'

function* testBaseAction (actionParams: any) {
  yield put({ type: TEST_BASE_ACTION, data: actionParams })
}

export default function* watchBaseSaga () {
  yield takeEvery(TEST_BASE_ACTION_SAGA, testBaseAction)
}
