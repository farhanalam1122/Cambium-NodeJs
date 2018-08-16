import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Link to="/Dashboard" className="pl-3">
          <div style={{ 'backgroundColor': '#ffad0a' }} class="jumbotron jumbotron-fluid text-center">
            <div class="container">
              <h1 class="display-4">RETURNS</h1>
            </div>
          </div>
        </Link>
        <div style={{ 'backgroundColor': '#548dff' }} class="jumbotron jumbotron-fluid text-center">
          <div class="container">
            <h1 class="display-4">REIMBURSEMENTS</h1>
          </div>
        </div>

        <div style={{ 'backgroundColor': '#c984ff' }} class="jumbotron jumbotron-fluid text-center">
          <div class="container">
            <h1 class="display-4">FULFILLMENTS</h1>
          </div>
        </div>
      </div>
    );
  }
}
