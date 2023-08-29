import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { applyMiddleware, createStore } from 'redux'
import configureReducer from './configureReducer'
import { ObjectAnyProp } from './pages/todo/Todo.interface'

export const history = createBrowserHistory()

interface ConfigureStoreProps {
  initialState: ObjectAnyProp
}
export default function configureStore(p: ConfigureStoreProps) {
  const {
    initialState,
    // apiRequest,
  } = p

  const reducer = configureReducer({
    history,
  })

  /* const { sagaMiddleware, runSagas } = initSagas({
    appendSagas() {
      return [watchTestSagas(), watchHandleUserSaga()]
    }
  }) */
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(
      routerMiddleware(history),
    )
  )
  // runSagas()
  return store
}
