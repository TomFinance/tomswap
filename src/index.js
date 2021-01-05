import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import './assets/css/font.css'
import './assets/css/common.css'
import './assets/css/style.css'
import './assets/css/slick.css'

import App from './App'
const ScrollToTop = () => {
  window.scrollTo(0, 0)
  return null
}

const history = createBrowserHistory()

ReactDOM.render(
  <Router history={history}>
    <Route component={ScrollToTop} />
    <App />
  </Router>,
  document.getElementById('root')
)