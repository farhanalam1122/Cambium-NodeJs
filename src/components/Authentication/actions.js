import axios from 'axios';
import { toast } from 'react-toastify';

import { AUTH, USER, baseUrl } from '../../types';

export function login(entry) {
    return (dispatch => {

        console.log( baseUrl );

        axios.post(`${baseUrl}/login`, entry).then(res => {
            console.log(res);
            if (res.data.code === 200) {
                document.cookie = "connect.sid=" + res.data.data["connect.sid"] + ";path=/";

                sessionStorage.setItem("user", res.data.data.user.name);

                console.log("LOGIN")
                toast.success("Logged in Successfuly");
                dispatch({
                    type: AUTH,
                    payload: true
                });
                dispatch({
                    type: USER,
                    payload: res.data.data.user.name
                })
            }
            else {
                toast.warn("Username and Password did not Match");
            }
        }).catch(err => {
            toast.error("Could not connect to the server.");
        });
    });
}

export function logout() {
    document.cookie = `connect.sid=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    sessionStorage.removeItem("user");
    toast.success("Logged Out");
    return {
        type: AUTH,
        payload: false
    };
}

export function forgotPass(email) {
    console.log("EMAIL", email);
    let data = {
        "email_id": email
    }

    axios.post(`${baseUrl}/forgotPass`, data).then(
        res => {
            console.log(res);
            if (res.data.code === 200) {
                toast.success("Activation Link has been sent to your email");
            } else {
                toast.error("No user assosciated with such email found");
            }
        }
    ).catch(err => {
        toast.error("Server could not be connected");
    })
}
