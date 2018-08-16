import React, { Component } from 'react';
// import axios from 'axios';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import Modal from '@material-ui/core/Modal';

import { login, forgotPass } from './actions';

import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordType: 'password',
      display: '',
      forgot: '',
      resetemail: ''
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleClick = (e) => {
    if(e.target.checked){
      this.setState({passwordType: 'text'});
    }else{
      this.setState({passwordType: 'password'});
    }
  }

  handleCancelReset = () => {
    this.setState({ forgot: false });
  }

  forgotPassword = () => {
    this.setState({ forgot: true });
  }

  confirmReset = () => {
    forgotPass(this.state.resetemail);
    this.setState({ forgot: false, resetemail: "" });
  }

  onSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.email);
    console.log(this.state.password);
    let entry = {
      "username": this.state.email,
      "password": this.state.password
    };
    this.setState({ email: '', password: '' });
    this.props.login(entry)
  }

  render() {
    return (
      <div>



      

       <Modal open={this.state.forgot} onClose={this.handleCancelReset} >
          <div className="container mt-3" style={{ height: "fit-content" }}>
            <div className="card bg-warning">
              <div className="card-header">Enter the email. An Activation Link will be sent this to this email.</div>
            </div>
            <div className="bg-light card-body">
              <div className="form-group">
                <label htmlFor="changePassword">Email</label>
                <input type="email" className="form-control" id="changePassword" name="resetemail" value={this.state.resetemail} onChange={this.handleChange} placeholder="Reset Password link will be sent to your Registered email" />
              </div>
              <button className="btn btn-primary mx-2" onClick={this.handleCancelReset}>Cancel</button>
              <button className="btn btn-danger mx-2" onClick={this.confirmReset}>Submit</button>
            </div>
            <form>
            </form>
          </div>
        </Modal>


        

        <div className="grid mt-5">

          <form onSubmit={this.onSubmit} className="form login">

            <header className="login__header">
              <h3 className="login__title">Login</h3>
            </header>

            <div className="login__body">

              <div className="form__field">
                <input type="text" placeholder="Username" name="email" value={this.state.email} onChange={this.handleChange} required />
              </div>

              <div className="form__field">
                <input type={this.state.passwordType} placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} required />
              </div><br />


              <input id="showpassword" type="checkbox" className="mr-1" onClick={this.handleClick}/>
              <label htmlFor="showpassword">Show Password</label>


            </div>

            <footer className="login__footer">
              <input type="submit" value="Login" />
              <p><span className="icon icon--info">?</span><a href="#" onClick={this.forgotPassword}>Forgot Password</a></p>
            </footer>

          </form>
          {this.props.auth && <Redirect to='/home' /> }

        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(mapStateToProps, { login })(Login);
