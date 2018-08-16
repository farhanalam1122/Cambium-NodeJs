import { combineReducers } from 'redux';
import RoleReducer from './reducer_roles';
import AllUsers from './reducer_users';
import AllBarcodes from './reducer_barcode';
import Auth from './reducer_auth';
import User from './reducer_loggedInUser';

const rootReducer = combineReducers({
  auth: Auth,
  user: User,
  all_roles: RoleReducer,
  all_users: AllUsers,
  all_barcodes: AllBarcodes
});

export default rootReducer;
