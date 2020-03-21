import React, { useEffect, Suspense } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "./react-auth0-spa";
import NotFound from '../Pages/not-found';
import AuthService from '../Shared/auth-service';

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect, user } = useAuth0();

  if(!loading && user){
    AuthService.validate(user.sub, 'Profile').then((r)=>{
      if (r) {
        return <Component />
      }else{
        return <NotFound />
      }
    }).catch( () => {
      return <NotFound />
    });

  }else{
    return <NotFound />
  }
};

export default PrivateRoute;
