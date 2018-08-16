import React, { Component } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { baseUrl } from '../../types';

class NewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submit: "",
            password1: "",
            password2: ""
        }
    }

    handleSubmit = () => {
        if (this.state.password1 === this.state.password2) {
            this.setState({ submit: "correct" });

            let data = {
                "newPassword": this.state.password1
            }
            this.setState({ password1: "", password2: "" });
            let token = this.props.match.params.token;
            console.log(token, "token");
            console.log(data, "data")
            let url = `${baseUrl}/forgotPass/${token}`;
            axios.post(url, data).then(
                res => {
                    console.log(res);
                    if (res.data.code === 200) {
                        toast.success("Password Updated Successfully");
                        this.setState({ submit: "redirect" })
                    } else {
                        toast.error("Token Expired");
                    }
                }
            ).catch(err => {
                toast.error("Something went Wrong.");
            });

        } else {
            this.setState({ submit: "incorrect" });
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.setState({ submit: "" });
    }

    render() {
        console.log("TOKEN", this.props.match.params.token);

        return (
            <div className="container mt-5">

                <div class="form-group">
                    <label for="exampleInputPassword1">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Enter your New Password"
                        name="password1"
                        onChange={this.handleChange}
                        value={this.state.password1} />
                </div>

                <div class="form-group">
                    <label for="exampleInputPassword2">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword2"
                        placeholder="Enter Same Password As Above"
                        name="password2"
                        onChange={this.handleChange}
                        value={this.state.password2} />
                </div>

                {this.state.submit === "incorrect" ? <small>Password did not match. Enter them again</small> : null}
                {this.state.submit === "redirect" ? <Redirect to="/login" /> : null}

                <br />
                <button type="button" className="btn btn-primary mt-3" onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}


export default NewPassword;