import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PostUserInfo, EditUserInfo } from './actions';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import _ from 'lodash';

class AddUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      password: "",
      fname: "",
      lname: "",
      email_id: "",
      mobile_no: "",
      status: "Active",
      assigned_roles: [],
      user_id: -1,
      index: -1,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.user_id === -1) {
      this.props.PostUserInfo(this.state);
    } else {
      this.props.EditUserInfo(this.state);
    }
    this.setState({
      name: "",
      password: "",
      fname: "",
      lname: "",
      email_id: "",
      mobile_no: "",
      status: "Active",
      assigned_roles: [],
      user_id: -1,
      index: -1,
    });
    this.props.handleClose();
  }

  handleSelectChange = (assigned_roles) => {
    assigned_roles = assigned_roles.split(',');
    this.setState({ assigned_roles });
    console.log(this.state.assigned_roles);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.index !== -1) {
      let temp = props.fillData;
      let ind = props.index;
      props.resetEntry();
      return {
        name: temp.name,
        password: temp.password,
        fname: temp.fname,
        lname: temp.lname,
        email_id: temp.email_id,
        mobile_no: temp.mobile_no,
        status: temp.status,
        assigned_roles: temp.assigned_roles,
        user_id: temp.user_id,
        index: ind,
      };
    }
  }

  render() {
    const roles = [];
    let info = {};
    this.props.all_roles.forEach((role) => {
      info = {
        "label": role.role_name,
        "value": role.role_id
      }
      roles.push(info);
    })
    let sortedRoles = _.sortBy(roles, 'label');
    return (
      <div className="container">
        <div className="mt-5 card" style={{ height: "fit-content" }}>
          <div className="bg-warning card-header" style={{ borderBottom: "1px solid black" }}>
            {this.state.user_id === -1 ? <h3>Add New User</h3> : <h3>Edit New User</h3>}
          </div>

          <div className="card-body bg-white">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group row mt-3">
                <label htmlFor="ussername" className="col-sm-2 col-form-label">Username</label>
                <div className="col-sm-10">
                  <input type="text" className="form-control" id="username" placeholder="Username" name="name" value={this.state.name} onChange={this.handleChange} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                  {this.state.user_id === -1 ?
                    <input type="password" className="form-control" id="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} />
                    :
                    <input className="form-control" type="text" placeholder="Cannot change password from here" disabled />}
                </div>
              </div>
              <br />

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="fname">First Name</label>
                  <input type="text" className="form-control" id="fname" placeholder="First Name" name="fname" value={this.state.fname} onChange={this.handleChange} />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="lname">Last Name</label>
                  <input type="text" className="form-control" id="lname" placeholder="Last Name" name="lname" value={this.state.lname} onChange={this.handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="email">Email</label>
                  <input type="email" className="form-control" id="email" placeholder="Email" name="email_id" value={this.state.email_id} onChange={this.handleChange} />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input type="number" className="form-control" id="mobile" placeholder="Mobile" name="mobile_no" value={this.state.mobile_no} onChange={this.handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Status</label>
                <select className="form-control" id="exampleFormControlSelect1" name="status" value={this.state.status} onChange={this.handleChange}>
                  <option>active</option>
                  <option>pending</option>
                  <option>inactive</option>
                </select>
              </div>

              <div className="section">
                <label>Roles</label>
                <Select
                  closeOnSelect={false}
                  disabled={false}
                  multi
                  onChange={this.handleSelectChange}
                  options={sortedRoles}
                  placeholder="Assign Roles to this User"
                  removeSelected={true}
                  rtl={false}
                  simpleValue
                  pageSize={5}
                  value={this.state.assigned_roles}
                />
              </div>

              <br />

              <button type="submit" className="btn btn-primary mb-2 float-right mx-3">Submit</button>
              <button type="button" onClick={this.props.handleClose} className="btn btn-danger mb-2 float-right mx-3">Cancel</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStatetoProps(state) {
  return {
    all_roles: state.all_roles,
    all_users: state.all_users
  };
}

export default connect(mapStatetoProps, { PostUserInfo, EditUserInfo })(AddUser);
