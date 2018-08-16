import axios from 'axios';
import { toast } from 'react-toastify';

import { ADD_ROLE_SUCCESS, GET_ALL_ROLES, EDIT_ROLE, ROLE_DELETE, config, baseUrl } from '../../types';

export function getAllRoles() {
    return (
        (dispatch) => {
            axios.get(`${baseUrl}/roleManagement/allRoles`, config)
                .then(
                    res => {
                        console.log(res);
                        if (res.data.code === 200) {
                            dispatch({ type: GET_ALL_ROLES, payload: res.data.data });
                            // toast.success("All Roles fetched Successfully");
                        } else {
                            toast.warn("Sorry, Unable to Get all Roles");
                        }
                    })
                .catch(err => {
                    toast.error(err.message);
                });
        }
    );
}

export function addRole(Roles) {
    let { role_id, index, assigned_users, ...Role } = Roles;
    return (
        (dispatch) => {
            console.log(assigned_users)
            // console.log(Roles);
            axios.post(`${baseUrl}/roleManagement/add`, Role, config)
                .then(res => {
                    // console.log('RESULT', res);
                    console.log(Role);
                    if (res.status === 200 && res.data.code === 200) {
                        dispatch({ type: ADD_ROLE_SUCCESS, payload: res.data.data });
                        toast.success("Role Added Successfully");
                    } else {
                        toast.warn(res.data.message);
                    }
                })
                .catch(err => {
                    toast.error(err.message);
                });
        });
}

export function EditRole(Roles) {
    let { index, ...Role } = Roles;
    return (
        dispatch => {
            axios.post(`${baseUrl}/roleManagement/update`, Role, config)
                .then(
                    res => {
                        if (res.data.code === 200) {
                            let editedRole = {
                                info: res.data.data,
                                index: index
                            }
                            dispatch({ type: EDIT_ROLE, payload: editedRole });
                            toast.success("Successfully Edited Role");
                        }
                        else {
                            toast.warn(res.data.message);
                        }
                    }
                )
                .catch(err => {
                    toast.error(err.message);
                })
        }
    )
}

export function DeleteRole(id, index) {
    return (
        dispatch => {
            console.log("IDDD", id);
            axios.get(`${baseUrl}/roleManagement/delete/${id}`, config)
                .then(
                    res => {
                        if (res.data.code === 200) {
                            console.log(res);
                            dispatch({ type: ROLE_DELETE, payload: index });
                            toast.success("SUccessfully deleted role");
                        } else {
                            toast.warn("res.data.message");
                        }
                    }
                )
                .catch(err => {
                    toast.error(err.message)
                })
        }
    )
}
