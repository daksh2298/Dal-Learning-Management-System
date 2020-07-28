import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import TitleComponent from "./title";
import {Auth} from "aws-amplify";

export default class Login extends Component {

    state = {
        username: '',
        password: '',
        redirect: false,
        authError: false,
        isLoading: false
    };

    handleUserNameChange = event => {
        this.setState({username: event.target.value});
    };
    handlePwdChange = event => {
        this.setState({password: event.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();
        this.setState({isLoading: true});
        const username = this.state.username;
        const password = this.state.password;
        Auth.signIn(username, password)
            .then(result => {
            console.log("result",result);
            this.setState({isLoading: false});
            if (result) {
                console.log("username",result.username);
                console.log("email",result.attributes.email);
                console.log("token", result.attributes.sub);
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem("username", result.username);
                localStorage.setItem("email", result.attributes.email);
                localStorage.setItem('token', result.attributes.sub);
                localStorage.setItem('session', result);
                this.setState({redirect: true, isLoading: false});
            }
        }).catch(error => {
            console.log("error",error);
            this.setState({authError: true, isLoading: false});
        });
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/upload'/>
        }
    };

    render() {
        const isLoading = this.state.isLoading;
        return (
            <div className="container">
                <TitleComponent title="Learning Management System Login "></TitleComponent>
                <div className="card card-login mx-auto mt-5">
                    <div className="card-header">Login</div>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <div className="form-label-group">
                                    <input className={"form-control " + (this.state.authError ? 'is-invalid' : '')} id="inputUserName" placeholder="Username" type="text" name="username" onChange={this.handleUserNameChange} autoFocus required/>
                                    <label htmlFor="inputEmail">Username</label>
                                    <div className="invalid-feedback">
                                        Please provide a valid username.
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="form-label-group">
                                    <input type="password" className={"form-control " + (this.state.authError ? 'is-invalid' : '')} id="inputPassword" placeholder="******" name="password" onChange={this.handlePwdChange} required/>
                                    <label htmlFor="inputPassword">Password</label>
                                    <div className="invalid-feedback">
                                        Please provide a valid Password.
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" value="remember-me"/>Remember Password
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary btn-block" type="submit" disabled={this.state.isLoading ? true : false}>Login &nbsp;&nbsp;&nbsp;
                                    {isLoading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <span></span>
                                    )}
                                </button>
                            </div>
                        </form>
                        <div className="text-center">
                            <Link className="d-block small mt-3" to={'register'}>Register an Account</Link>
                            <a className="d-block small" href="forgot-password.html">Forgot Password?</a>
                        </div>
                    </div>
                </div>
                {this.renderRedirect()}
            </div>
        );
    }
}


