import React from 'react';
import {connect} from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
// import Sidebar from './components/common/Sidebar';


const PrivateRoute = ({ component: Component, ...rest, auth }) => {

    console.log("PRIVATE", auth);
    console.log("ROUTE");
    return (
        <Route {...rest} render={(props) => (
        auth
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
            }} />
        )} />
    );
    }

function mapStatetoProps(state){
    return {auth: state.auth};
}
  
export default connect(mapStatetoProps)(PrivateRoute);