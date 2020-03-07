import React, { Component } from 'react';
import ReactDom from 'react'

class App extends Component {
  render() {
    return (
      <div>
  		<div>
    		<h1>h1</h1>
    		<h2 id="count-down">here</h2>
    		<button onclick="getBinanceInfo()">get binance info</button>
  		</div>
  	<div>
    )
  }
}

const root = document.querySelector('#app')
ReactDOM.render(<App />, root)