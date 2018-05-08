import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import workInterval from './workInterval';
import breakInterval from './breakInterval';
import health from './health';
import idleTime from './idletime';


const reducer = combineReducers({ workInterval, breakInterval, health, idleTime })
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  // createLogger({ collapsed: true })
))
const store = createStore(reducer, middleware)

export default store
export * from './workInterval'
export * from './breakInterval'
export * from './health'

