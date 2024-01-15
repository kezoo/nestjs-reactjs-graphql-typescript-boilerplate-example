import { StyleProvider } from '@ant-design/cssinjs'
import { ApolloProvider } from '@apollo/client'
import { ConfigProvider, theme } from 'antd'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import { reduxStore } from './createReduxStore'
import { RouteWrapper } from './routes/routeIndex'
import './styles/index.css'
import { antdThemes } from './theme/antdTheme'
import { initApolloClient } from './utils/httpRequest/httpRequestWithGraphql'

const domNode = document.getElementById('root') as HTMLElement
const root = createRoot(domNode);

root.render(<App />)

function App () {
  return (
    <Provider store={reduxStore}>
      <ApolloProvider client={initApolloClient()}>
        <BrowserRouter>
          <StyleProvider hashPriority="high">
            <ConfigProvider
              theme={{
                algorithm: [theme.defaultAlgorithm, theme.compactAlgorithm],
                token: antdThemes.light,
              }}
              componentSize="middle"
            >
              <Header />
              <RouteWrapper />
              <Footer />
            </ConfigProvider>
          </StyleProvider>
      </BrowserRouter>
      </ApolloProvider>
    </Provider>
  )
}
