import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import HouseStore from './Stores/store'
import history from './history'
const Root = (
    <Provider HouseStore={HouseStore}>
        <App />
    </Provider>
)

ReactDOM.render(
    <Router history={history}>{Root}</Router>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()