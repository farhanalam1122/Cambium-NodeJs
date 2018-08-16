import axios from 'axios';
import { toast } from 'react-toastify';

import { ADD_USER_SUCCESS, GET_ALL_USERS, EDIT_USER, USER_DELETE, baseUrl, config } from '../../types';

export function PostUserInfo(Users) {
    let { user_id, index, assigned_roles, ...User } = Users;
    console.log(User, "USERRR");
    return (
        (dispatch) => {
            console.log(assigned_roles);
            axios.post(`${baseUrl}/add`, User, config)
                .then(res => {
                    console.log('RESULT', res);
                    if (res.status === 200 && res.data.code === 200) {
                        dispatch({ type: ADD_USER_SUCCESS, payload: res.data.user });
                        toast.success("User Added Successfully");
                    } else {
                        toast.warn("Sorry, Unable to Add User");
                    }
                })
                .catch(err => {
                    toast.error(err.message);
                });
        });
}

export function getAllUsers() {
    console.log(`getallusers ${baseUrl} /allusers ${document.cookie}`);
    console.log("CONFIG", config);
    return (
        (dispatch) => {
            axios.get(`${baseUrl}/allusers`, config)
                .then(
                    res => {
                        console.log(res);
                        if (res.status === 200) {
                            dispatch({ type: GET_ALL_USERS, payload: res.data });

                            // toast.success("All Users Fetched Successfully");

                        } else {
                            toast.warn("Sorry, Unable to Get all Users");
                        }
                    })
                .catch(err => {
                    console.log(err.message);
                    toast.error(err.message);
                });
        }
    );
}


export function EditUserInfo(Users) {
    let { password, index, ...User } = Users;
    console.log("USEE", User);
    return (
        dispatch => {
            axios.post(`${baseUrl}/update`, User, config)
                .then(
                    res => {
                        if (res.data.code === 200) {
                            let editedUser = {
                                info: res.data.data,
                                index: index
                            }
                            dispatch({ type: EDIT_USER, payload: editedUser });
                            toast.success("User edited Successfully");
                        }
                        else {
                            toast.warn(res.data.message);
                        }
                    }
                )
                .catch(err => {
                    console.log(err);
                    toast.error(err.message);
                })
        }
    )
}


export function onUserDelete(id, index) {
    return (
        dispatch => {
            axios.post(`${baseUrl}/delete`, { "user_id": id }, config)
                .then(
                    res => {
                        if (res.data.code === 200) {
                            dispatch({ type: USER_DELETE, payload: index });
                            toast.success("User deleted Successfully");
                        } else {
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