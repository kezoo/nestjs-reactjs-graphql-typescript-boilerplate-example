import { ApolloProvider } from '@apollo/client'
import 'antd/dist/antd.css'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from "react-router-dom"
import Footer from './components/Footer'
import Header from './components/Header'
import { store } from './createStore'
import reportWebVitals from './reportWebVitals'
import { RouteWrapper } from './routes/routeIndex'
import './styles/index.css'
import { initApolloClient } from './utils/app.helper'

render(
  <Provider store={store}>
    <BrowserRouter>
      <ApolloProvider client={initApolloClient()}>
        <Header />
        <RouteWrapper />
        <Footer />
      </ApolloProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
