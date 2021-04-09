import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import useToken from './useToken'

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const {token} = useToken();
    return (
        <Route {...rest} render={(props) => (!token? <Redirect to='/login' />:<Component {...props} />)}/>
    )
}

export default ProtectedRoute;
