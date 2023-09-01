import { combineReducers } from 'redux'
import baseReducer from './reducers/baseReducer/base.reducer'

interface ConfigureReducerProps {
}
export default function configureReducer({ }: ConfigureReducerProps) {
  const reducer = combineReducers({
    base: baseReducer,
  })
  return reducer
}
