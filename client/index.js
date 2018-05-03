import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import store from './store'
import history from './history'

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>, document.getElementById('app'))