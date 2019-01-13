import React, { Component } from 'react'
import './App.css'
import { Route, Switch } from 'react-router-dom'
import House from './components/listOfHouses/house'
import Chart from './components/chart/chart'

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Switch>
          <Route path='/' exact component={House} />
          <Route path='/chart' component={Chart} />
          <Route
            render={() => {
              return <h1>Page not found!</h1>
            }}
          />
        </Switch>
      </div>
    )
  }
}

export default App