import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom"

import {Provider} from "mobx-react";
import mainStore from "./stores/mainStore";

const stores = {
  mainStore,
  TestPageStore: mainStore.TestPageStore
}


ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
        <Provider {...stores}>
          <App />
        </Provider>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
