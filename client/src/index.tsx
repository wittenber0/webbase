import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from '@mui/material/styles'
import { Router } from 'react-router-dom';
import App from './App';

//Auth
import { Auth0Provider } from "@auth0/auth0-react";
import config from "./Auth/auth0-keys.json";

//Shared
import history from './Shared/browser-history';
import theme from './Shared/theme';

const routing = (

    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      redirectUri={window.location.origin+'/callback'}
    >
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <App history={history}/>
        </Router>
      </ThemeProvider>
    </Auth0Provider>

)
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
