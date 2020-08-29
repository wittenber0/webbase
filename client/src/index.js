import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from '@material-ui/core/styles';
import { Route, Router } from 'react-router-dom';
import App from './App';

//Auth
import { Auth0Provider } from "./Auth/react-auth0-spa";
import config from "./Auth/auth0-keys.json";
import { useAuth0 } from "./Auth/react-auth0-spa";
import PrivateRoute from './Auth/private-route';

//Shared
import history from './Shared/browser-history';
import theme from './Shared/theme';

//Pages
import About from './Pages/about';
import Home from './Pages/home';
import MyProfile from './Pages/my-profile';
import Admin from './Pages/admin';
import NotFound from './Pages/not-found';
import Callback from './Pages/login-callback'

const onRedirectCallback = appState => {
  history.push('/callback');
};

const routing = (
  <Router history={history}>
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
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
