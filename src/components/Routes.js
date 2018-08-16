import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import ChangePassword from './Authentication/ChangePassword';
import RoleList from './RoleManagement/RoleList';
import Table from './UserManagement/Table';
import Barcoder from './BarcodeManagement/Barcoder';
import Product from './ProductManagement/Product';
import Workflow from './WorkflowManagement/Workflow';
import BarcodeManagement from './BarcodeManagement/BarcodeManagement';
import Home from './Home';

const Routes = (prop) => (
  <main>
    <Switch>
      <Route exact path='/Dashboard' component={Dashboard} />
      <Route path='/GenerateBarcode' component={Barcoder} />
      <Route path='/UserManagement/Users' component={Table} />
      <Route path='/RoleManagement/Roles' component={RoleList} />
      <Route path='/ChangePassword' component={ChangePassword} />
      <Route path='/BarcodeManagement' render={(props) => <BarcodeManagement {...props} handleDrawerClose={prop.handleDrawerClose} handleDrawerOpen={prop.handleDrawerOpen} />} />
      <Route path='/ProductManagement' component={Product} />     
      <Route path='/WorkflowManagement' component={Workflow} /> 
      <Route path='/home' component={Home} />
    </Switch>
  </main>
)

export default Routes;