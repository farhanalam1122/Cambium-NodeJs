import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes from './Routes';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class App extends Component {
  render() {
    return (
      <div>
        <ToastContainer hideProgressBar={true} autoClose={2000}/>
        <Routes/>
      </div>
    );
  }
}
