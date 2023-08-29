import { connectRouter } from 'connected-react-router'
import { combineReducers } from 'redux'

interface ConfigureReducerProps {
  history: any
}
export default function configureReducer({ history }: ConfigureReducerProps) {
  const reducer = combineReducers({
    router: connectRouter(history),
    // user: userReducer,
  })
  return reducer
}
