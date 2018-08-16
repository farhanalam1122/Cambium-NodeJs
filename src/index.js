import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import registerServiceWorker from './registerServiceWorker';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import { AUTH, USER } from './types'
import App from './App';
import reducers from './reducers';

// const composeEnhancers =
//   typeof window === 'object' &&
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//       // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
//     }) : compose;


// const createStoreWithMiddleware = composeEnhancers(
//   applyMiddleware(
//    ReduxPromise,thunk
//   ))(createStore);


const createStoreWithMiddleware = applyMiddleware(thunk, ReduxPromise)(createStore);
const store = createStoreWithMiddleware(reducers)
// store.subscribe(() => {
//   store.getState()
// });

let cookieValue = document.cookie.split('=')[1]
console.log('Cookie Value', cookieValue);

let loggedInUser = sessionStorage.getItem("user");
console.log('loggedInUser', loggedInUser);

if (cookieValue && loggedInUser) {
  store.dispatch({ type: AUTH, payload: true });
  store.dispatch({ type: USER, payload: loggedInUser});
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  , document.getElementById('root'));

registerServiceWorker();
