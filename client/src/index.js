import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from '@material-ui/core/styles';
import { Router } from 'react-router-dom';
import App from './App';

//Auth
import { Auth0Provider } from "@auth0/auth0-react";
import config from "./Auth/auth0-keys.json";

//Shared
import history from './Shared/browser-history';
import theme from './Shared/theme';

const onRedirectCallback = appState => {
  history.push('/callback');
};

const routing = (
  <Router history={history}>
    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      redirectUri={window.location.origin+'/callback'}
    >
      <ThemeProvider theme={theme}>
        <App history={history}/>
      </ThemeProvider>
    </Auth0Provider>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
