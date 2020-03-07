import React from 'react';
import logo from './logo.svg';
import './App.css';
import ButtonAppBar from './Components/AppBar/app-bar'

function App(props) {
  return (
    <div className="App">
      <ButtonAppBar history={props.history}></ButtonAppBar>
      <header className="App-header">
        {props.children}
      </header>
    </div>
  );
}

export default App;
