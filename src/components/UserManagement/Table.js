import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllUsers, onUserDelete } from './actions';
import { getAllRoles } from '../RoleManagement/actions';
import Modal from '@material-ui/core/Modal';
import axios from 'axios';
import { config, baseUrl } from '../../types';

import ReactTable from "react-table";
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';

import AddUser from './AddUser';

let deleteId, deleteIndex, resetId;
class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            del: false,
            reset: false,
            index: -1,
            entry: {},
            newpassword: ""
        }
    }

    componentDidMount() {
        this.props.getAllUsers();
        this.props.getAllRoles();
    }

    onEditEntry(entry, i) {
        console.log("ENTRY", entry);
        this.setState({ entry: entry, index: i, open: true });
        console.log(this.state);
    }

    onDeleteEntry(id, index) {
        this.setState({ del: true });
        deleteId = id;
        deleteIndex = index;
    }

    onResetPassword(id) {
        this.setState({ reset: true });
        resetId = id;
    }

    confirmReset = () => {
        this.setState({ reset: false });

        const data = {
            user_id: resetId,
            newPassword: this.state.newpassword
        }

        axios.post(`${baseUrl}/resetPass`, data, config).then(
            res => {
                console.log("PASSWORD", res);
                if (res.data.code === 200) {
                    console.log("res");
                } else {
                    alert(res.data.message);
                }
            }
        ).catch(
            err => alert(err.message)
        )

        this.setState({ newpassword: "" });
    }

    confirmDelete = () => {
        console.log("WORK");
        console.log(deleteId, deleteIndex, "HAHA");
        this.props.onUserDelete(deleteId, deleteIndex);
        this.setState({ del: false });
    }

    addUserClick = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    resetEntry = () => {
        this.setState({
            index: -1,
            entry: {}
        });
    }

    handleCancelDelete = () => {
        this.setState({ del: false });
    }

    handleCancelReset = () => {
        this.setState({ reset: false });
    }

    passwordChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        console.log("USERSSS", this.props.all_users);
        return (
            <div>
                <Modal open={this.state.open} onClose={this.handleClose}>
                    <AddUser handleClose={this.handleClose} fillData={this.state.entry} index={this.state.index} resetEntry={this.resetEntry} />
                </Modal>

                <Modal open={this.state.del} onClose={this.handleCancelDelete} >
                    <div className="container mt-3" style={{ height: "fit-content" }}>
                        <div className="card bg-warning">
                            <div className="card-header">Are you sure you want to delete?</div>
                        </div>
                        <div className="bg-light card-body">
                            <button className="btn btn-danger mx-2" onClick={this.confirmDelete}>YES</button>
                            <button className="btn btn-primary mx-2" onClick={this.handleCancelDelete}>NO</button>
                        </div>
                    </div>
                </Modal>

                <Modal open={this.state.reset} onClose={this.handleCancelReset} >
                    <div className="container mt-3" style={{ height: "fit-content" }}>
                        <div className="card bg-warning">
                            <div className="card-header">Enter the new password</div>
                        </div>
                        <div className="bg-light card-body">
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">New Password</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" name="newpassword" value={this.state.newpassword} onChange={this.passwordChange} placeholder="Password assosciated with the user will be resetted." />
                            </div>
                            <button className="btn btn-primary mx-2" onClick={this.handleCancelReset}>Cancel</button>
                            <button className="btn btn-danger mx-2" onClick={this.confirmReset}>Reset</button>
                        </div>
                    </div>
                </Modal>

            <button className="btn btn-primary my-3" onClick={this.addUserClick}>Add New User</button>
            
            <ReactTable 
            data={this.props.all_users}
            defaultPageSize={10}
            filterable
            className="-striped -highlight"
            columns = {
                [
                    {
                        Header: "Sr. No.",
                        accessor: "sr. no",
                        Cell: row => (
                            <div>
                                <span>{row.index + 1}</span>
                            </div>
                        ),
                        width: 50
                    },
                    {
                        Header: "Username",
                        accessor: "name"
                    },
                    {
                        Header: "First Name",
                        accessor: "fname"
                    },
                    {
                        Header: "Last Name",
                        accessor: "lname"
                    },
                    {
                        Header: "Email",
                        accessor: "email_id",
                        width: 300
                    },
                    {
                        Header: "Contact No.",
                        accessor: "mobile_no"
                    },
                    {
                        Header: "Created By",
                        accessor: "created_by"
                    }, 
                    {
                        Header: "Created On",
                        accessor: "created_on",
                        Cell: row => (
                            <div>{row.original.created_on.split('T')[0]}</div>
                        )
                    }, 
                    {
                        Header: "Updated By",
                        accessor: "updated_by",
                        filterable: false,
                    }, 
                    {
                        Header: "Updated On",
                        accessor: "updated_on",
                        Cell: row => (
                            <div>{row.original.updated_on.split('T')[0]}</div>
                        )
                    }, 
                    {
                        Header: "Status",
                        accessor: "status",
                        filterMethod: (filter, row) => {
                            if (filter.value === "all") {
                              return true;
                            }
                            if (filter.value === "active") {
                              return row[filter.id] === "active";
                            }
                            if (filter.value === "inactive") {
                                return row[filter.id] === "inactive";
                            }   
                            if (filter.value === "pending") {
                                return row[filter.id] === "pending";
                            }                         
                          },
                          Filter: ({ filter, onChange }) =>
                            <select
                              onChange={event => onChange(event.target.value)}
                              style={{ width: "100%" }}
                              value={filter ? filter.value : "all"}
                            >
                              <option value="all">Show All</option>
                              <option value="active">Active</option>
                              <option value="inactive">InActive</option>
                              <option value="pending">Pending</option>
                            </select>
                    },
                    {
                        Header: "Action",
                        filterable: false,
                        Cell: row => (
                            <div>
                                <span style={{ cursor: "pointer" }} onClick={()=>{
                                    this.onEditEntry(row.original, this.props.all_users.indexOf(row.original))
                                }}>
                                    <i className="fa fa-edit fa-lg"></i> Edit 
                                </span>
                                <span> / </span>
                                <span style={{ cursor: "pointer" }} onClick={()=>{
                                    this.onDeleteEntry(row.original.user_id, this.props.all_users.indexOf(row.original))
                                }}>
                                    <i className="fa fa-trash fa-lg"></i>
                                    <span>Delete/ </span>    
                                </span>
                                <span style={{ cursor: "pointer" }} onClick={()=>{
                                    this.onResetPassword(row.original.user_id)
                                }}>
                                    <i class="fa fa-lock"></i>
                                    <span> Reset</span>        
                                </span>
                            </div>
                        ),
                        width: 300
                    },                
                ]
            }
            />
        </div>
        );
    }
}

function mapStateToProps({ all_users }) {
    return { all_users };
}

export default connect(mapStateToProps, { getAllRoles, getAllUsers, onUserDelete })(Table);
