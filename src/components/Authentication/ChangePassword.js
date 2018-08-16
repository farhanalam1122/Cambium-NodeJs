import React, { Component } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { config, baseUrl } from '../../types';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: "",
            password1: "",
            password2: "",
            submit: "",
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.setState({ submit: "" });
    }

    handleSubmit = () => {
        if (this.state.password1 === this.state.password2) {
            this.setState({ submit: "correct" });

            let data = {
                "oldPassword": this.state.oldPassword,
                "newPassword": this.state.password1
            };

            this.setState({ password1: "", password2: "", oldPassword: "" });
            console.log(data, "data");

            let url = `${baseUrl}/changePass`;

            axios.post(url, data, config).then(
                res => {
                    console.log(res);
                    if (res.data.code === 200) {
                        toast.success("Password Updated Successfully");
                        this.setState({ submit: "redirect" });
                    } else {
                        toast.error("Old Password was incorrect");
                    }
                }
            ).catch(err => {
                toast.error("Something went Wrong.");
            });

        } else {
            this.setState({ submit: "incorrect" });
        }
    }

    render() {
        return (
            <div className="container mt-5">

                <div class="form-group">
                    <label for="exampleInputPassword1">Old Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Enter your Old Password"
                        name="oldPassword"
                        onChange={this.handleChange}
                        value={this.state.oldPassword} />
                </div>

                <div class="form-group">
                    <label for="exampleInputPassword2">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword2"
                        placeholder="Enter your New Password"
                        name="password1"
                        onChange={this.handleChange}
                        value={this.state.password1} />
                </div>

                <div class="form-group">
                    <label for="exampleInputPassword3">New Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword3"
                        placeholder="Enter Same Password As Above"
                        name="password2"
                        onChange={this.handleChange}
                        value={this.state.password2} />
                </div>

                {this.state.submit === "incorrect" ? <small>Password did not match. Enter them again</small> : null}
                {this.state.submit === "redirect" ? <Redirect to="/Dashboard" /> : null}

                <br />
                <button type="button" className="btn btn-primary mt-3" onClick={this.handleSubmit}>Submit</button>
            </div>
        )
    }
}

export default ChangePassword;