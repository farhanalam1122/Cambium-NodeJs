import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import ReactTable from "react-table";
import "react-table/react-table.css";
import 'font-awesome/css/font-awesome.min.css';
import AddRole from './AddRole';

import { getAllRoles, DeleteRole } from './actions';
import { getAllUsers } from '../UserManagement/actions';

let deleteId, deleteIndex;
class RoleList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            del: false,
            index: -1,
            entry: {},
        }
    }

    componentDidMount() {
        this.props.getAllRoles();
        this.props.getAllUsers();
    }

    onEditEntry(entry, i) {
        this.setState({ entry: entry, index: i, open: true });
    }

    onDeleteEntry(id, index) {
        this.setState({ del: true });
        deleteId = id;
        deleteIndex = index;
    }

    confirmDelete = () => {
        this.props.DeleteRole(deleteId, deleteIndex);
        this.setState({ del: false });
    }

    addRoleClick = () => {
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

    render() {
        console.log(this.props.all_roles);
        return (
            <div>
                <Modal open={this.state.open} onClose={this.handleClose}>
                    <AddRole handleClose={this.handleClose} fillData={this.state.entry} index={this.state.index} resetEntry={this.resetEntry} />
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

                <button className="btn btn-primary my-3" onClick={this.addRoleClick}>Add New Role</button>

                <ReactTable
                    data={this.props.all_roles}
                    defaultPageSize={10}
                    filterable
                    // pivotBy={["role_name", "assigned_users"]}
                    noDataText="Roles not found"
                    className="-striped -highlight"
                    columns={
                        [
                            {
                                Header: "Sr. No.",
                                accessor: "sr. no",
                                Cell: row => (
                                    <div>
                                        <span>{row.index + 1}</span>
                                    </div>
                                ),
                                width: 50,
                            },
                            {
                                Header: "Rolename",
                                accessor: "role_name"
                            },
                            {
                                Header: "Users Associated",
                                accessor: "assigned_users"
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
                                filterable: false
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
                                    if (filter.value === "Active") {
                                        return row[filter.id] === "Active";
                                    }
                                    if (filter.value === "Inactive") {
                                        return row[filter.id] === "Inactive";
                                    }
                                },
                                Filter: ({ filter, onChange }) =>
                                    <select
                                        onChange={event => onChange(event.target.value)}
                                        style={{ width: "100%" }}
                                        value={filter ? filter.value : "all"}
                                    >
                                        <option value="all">Show All</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                            },
                            {
                                Header: "Action",
                                filterable: false,
                                Cell: row => (
                                    <div>
                                        <span style={{ cursor: "pointer" }} onClick={() => {
                                            this.onEditEntry(row.original, this.props.all_roles.indexOf(row.original))
                                        }}>
                                            <i className="fa fa-edit fa-lg"></i> Edit
                                        </span>
                                        <span> / </span>
                                        <span style={{ cursor: "pointer" }} onClick={() => {
                                            this.onDeleteEntry(row.original.role_id, this.props.all_roles.indexOf(row.original))
                                        }}>
                                            <i className="fa fa-trash fa-lg"></i>
                                            <span> Delete</span>
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

function mapStateToProps({ all_roles }) {
    return { all_roles };
}

export default connect(mapStateToProps, { getAllUsers, getAllRoles, DeleteRole })(RoleList);











// let self;
// class RoleList extends Component {
//   constructor(props) {
//     super(props);
//     self= this;
//   }

//   componentDidMount(){
//     this.props.getAllRoles();
//   }

//   renderRole(roleData){
//     console.log(roleData);
//     return(
//         <tr key={roleData.id}>
//             <td>{roleData.role}</td>
//             <td>Admin</td>
//             <td></td>
//             <td>
//               <button onClick={()=>self.handleEdit(roleData.id,roleData.role)} className="btn btn-primary">Edit</button>
//               &nbsp;&nbsp;
//               <button onClick={()=>{if (window.confirm('Are you sure you wish to delete this item?')) self.handleDelete(roleData.id,self.props.roles)}} className="btn btn-danger">Delete</button>
//             </td>
//         </tr>
//     );
//   }

//   handleEdit(i,role){
//     if(!this.props.showFields)
//     this.props.handleFields(this.props.showFields);
//     this.props.editRole(i,role);
//   }

//   handleDelete(i,all_roles){
//     this.props.handleRole('');
//     if(this.props.showFields)
//     this.props.handleFields(this.props.showFields);
//     this.props.deleteRole(i,all_roles);
//   }

//   render() {
//     return (
//         <table className="table table-hover">
//             <thead>
//               <tr>
//                 <th>Role</th>
//                 <th>Updated By</th>
//                 <th>Updated On</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {this.props.roles.map(this.renderRole)}
//             </tbody>
//         </table>
//     );
//   }
// }

// function mapStateToProps(state){
//     return { 
//       roles: state.roles, 
//       showFields: state.showFields
//     };
// }

// export default connect(mapStateToProps, {getAllRoles, editRole, deleteRole, handleFields, handleRole})(RoleList);
