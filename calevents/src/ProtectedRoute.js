import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import useToken from './useToken'
//preventing user from accessing pages unless login
//done by checking whether there is token stored in local storage

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const {token} = useToken();
    return (
        <Route {...rest} render={(props) => (!token? <Redirect to='/login' />:<Component {...props} />)}/>
    )
}

export default ProtectedRoute;
