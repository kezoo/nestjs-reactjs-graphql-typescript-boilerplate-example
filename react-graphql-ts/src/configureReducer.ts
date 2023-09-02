import { combineReducers } from 'redux'
import baseReducer from './reducers/baseReducer/base.reducer'

interface ConfigureReducerProps {
}
export default function configureReducer({ }: ConfigureReducerProps) {
  const reducer = combineReducers({
    base: baseReducer,
  })

  /* const rootReducer = (state: any, action: any) => {
    if (action.type === 'RESET_ALL_STATE') {
      state = undefined
    }

    return reducer(state, action)
  } */

  return reducer
}
