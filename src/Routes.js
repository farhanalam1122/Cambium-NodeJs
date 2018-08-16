import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './components/Authentication/Login';
import NewPassword from './components/Authentication/NewPassword';
import Sidebar from './components/common/Sidebar';
import PrivateRoute from './PrivateRoute';

const Routes = () => (
  <main>
    <Switch>
      <Route path='/login' component={Login} />
      <Route path='/forgotPass/:token' component={NewPassword} />
      <PrivateRoute path='/' component={Sidebar} />
    </Switch>
  </main>
)

export default Routes;