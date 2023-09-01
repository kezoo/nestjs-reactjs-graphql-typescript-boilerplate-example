import { applyMiddleware, createStore } from 'redux'
import configureReducer from './configureReducer'
import { ObjectAnyProp } from './pages/todo/Todo.interface'

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
    )
  )
  // runSagas()
  return store
}
