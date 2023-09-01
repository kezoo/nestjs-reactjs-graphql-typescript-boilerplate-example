// import { ApolloProvider } from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import { reduxStore } from './createReduxStore'
import { RouteWrapper } from './routes/routeIndex'
import { initApolloClient } from './utils/app.helper'
// import { BrowserRouter } from "react-router-dom"
// import Footer from './components/Footer'
// import Header from './components/Header'
// import { store } from './createStore'
// import { RouteWrapper } from './routes/routeIndex'
// import './styles/index.css'
// import { initApolloClient } from './utils/app.helper'

const domNode = document.getElementById('root') as HTMLElement
const root = createRoot(domNode);

root.render(<App />)

function App () {
  return (
    <Provider store={reduxStore}>
      <BrowserRouter>
        <ApolloProvider client={initApolloClient()}>
          <Header />
          <RouteWrapper />
          <Footer />
        </ApolloProvider>
      </BrowserRouter>
    </Provider>
  )
}
/* function App () {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ApolloProvider client={initApolloClient()}>
          <Header />
          <RouteWrapper />
          <Footer />
        </ApolloProvider>
      </BrowserRouter>
    </Provider>
  )
} */
