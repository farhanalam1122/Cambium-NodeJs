import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addRole, EditRole } from './actions';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import _ from 'lodash';

class AddRole extends Component {
  constructor(props) {
    super(props);

    this.state = {
      role_name: "",
      status: "Active",
      assigned_users: [],
      role_id: -1,
      index: -1,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    console.log(this.state.role_id);
    e.preventDefault();
    if (this.state.role_id === -1) {
      this.props.addRole(this.state);
    } else {
      this.props.EditRole(this.state);
    }
    this.setState({
      role_name: "",
      status: "Active",
      assigned_users: [],
      role_id: -1,
      index: -1,
    });
    this.props.handleClose();
  }

  handleSelectChange = (assigned_users) => {
    assigned_users = assigned_users.split(',');
    this.setState({ assigned_users });
    console.log(this.state.assigned_users);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.index !== -1) {
      let temp = props.fillData;
      let ind = props.index;
      props.resetEntry();
      return {
        role_name: temp.role_name,
        status: temp.status,
        assigned_users: temp.assigned_users,
        role_id: temp.role_id,
        index: ind,
      };
    }
  }

  render() {
    const users = [];
    let info = {};
    this.props.all_users.forEach((user) => {
      info = {
        "label": user.name,
        "value": user.user_id
      }
      users.push(info);
    })
    let sortedUsers = _.sortBy(users, 'label');
    return (
      <div className="container">
        <div className="mt-5 card" style={{ height: "fit-content" }}>
          <div className="bg-warning card-header" style={{ borderBottom: "1px solid black" }}>
            {this.state.index === -1 ? <h3>Add New Role</h3> : <h3>Edit Role</h3>}
          </div>

          <div className="card-body bg-white">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group row mt-4">
                <label htmlFor="role_name" className="col-sm-2 col-form-label">Rolename</label>
                <div className="col-sm-12">
                  <input type="text" className="form-control" id="role_name" placeholder="Rolename" name="role_name" value={this.state.role_name} onChange={this.handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Status</label>
                <select className="form-control" id="exampleFormControlSelect1" name="status" value={this.state.status} onChange={this.handleChange}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="section">
                <label>Users</label>
                <Select
                  closeOnSelect={false}
                  disabled={false}
                  multi
                  onChange={this.handleSelectChange}
                  options={sortedUsers}
                  placeholder="Assign Users to this Role"
                  removeSelected={true}
                  rtl={false}
                  simpleValue
                  pageSize={5}
                  value={this.state.assigned_users}
                />
              </div>

              <br />

              <button type="submit" className="btn btn-primary mb-2 float-right mx-3">Save</button>
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

export default connect(mapStatetoProps, { addRole, EditRole })(AddRole);



// class AddRole extends Component {
//     constructor(props) {
//         super(props);
//         this.onInputChange=this.onInputChange.bind(this);
//         this.handleFields=this.handleFields.bind(this);
//     }
//     handleFields(){
//         this.props.handleFields(this.props.showFields);
//         this.props.handleRole('',-1);
//     }

//     onInputChange(event){
//         this.props.handleRole(event.target.value,this.props.roleInfo.index) 
//     }

//     onFormSubmit(event){
//         event.preventDefault();
//         this.props.addRole(this.props.roleInfo.index,this.props.roles,this.props.roleInfo.name);
//         this.props.handleFields(this.props.showFields);
//         this.props.handleRole('',-1);
//     }

//     render() {
//         return (
//         <div>
//             <div className="row">
//             <div className="col-md-4">
//             <h1>List of Role Details</h1>
//             </div>
//             <div className="col-md-2 ml-auto">
//             <button className="btn btn-primary btn-lg" onClick={this.handleFields} >Add a new role</button>
//             </div>
//             </div>            
//             {this.props.showFields &&
//             <div><br/>
//             <form onSubmit={(e)=>this.onFormSubmit(e)} className="input-group">
//             <input type="text" placeholder="Add a new Role Name" className="form-control" value={this.props.roleInfo.name} onChange={this.onInputChange} required/>
//             &nbsp;&nbsp;
//             <span className="input-group-btn">
//                 <button type="submit" className="btn btn-success">Save</button>
//             </span>
//             &nbsp;&nbsp;
//             <span className="input-group-btn">
//                 <button onClick={this.handleFields} className="btn btn-danger">Cancel</button>
//             </span>
//             </form>
//             </div>
//             } 
//         </div>
//         )
//     }
// }

// function mapStatetoProps(state){
//     return {
//         showFields: state.showFields, 
//         roleInfo: state.roleInfo,
//         roles: state.roles
//     };
// } 


// export default connect(mapStatetoProps, {addRole, handleFields, handleRole})(AddRole);
