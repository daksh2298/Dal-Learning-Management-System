import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import TitleComponent from "./title";
import {Auth} from "aws-amplify";

export default class Confirm extends Component {

    state = {
        confirmationCode: '',
        redirect: false,
        authError: false,
        isSubmitLoading: false,
        isResendLoading: false
    };

    handleCodeChange = event => {
        this.setState({confirmationCode: event.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();
        this.setState({isCon: true});
        const confirmationCode = this.state.confirmationCode;

        console.log("confirmationCode",confirmationCode);

        Auth.confirmSignUp(localStorage.user, confirmationCode)
            .then(result => {
            console.log("result",result);
            this.setState({isSubmitLoading: false});
            if (result === "SUCCESS") {
                this.setState({redirect: true, authError: true});
            }else {
                this.setState({redirect: false, authError: true});
            }
        }).catch(error => {
            console.log("error",error);
            this.setState({ authError: true, isSubmitLoading: false });
        });
    };

    resendConfirmationCode = event => {
        event.preventDefault();
        this.setState({isResendLoading: true});

        Auth.resendSignUp(localStorage.user)
            .then(result => {
                console.log("result",result);
                this.setState({isResendLoading: false});
                if (!result) {
                    this.setState({redirect: false, authError: true});
                }
            }).catch(error => {
            console.log("error",error);
            this.setState({ authError: true, isResendLoading: false });
        });
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }
    };

    render() {
        const isResendLoading = this.state.isResendLoading;
        const isSubmitLoading = this.state.isSubmitLoading;
        return (
            <div className="container">
                <TitleComponent title="Learning Management System Confirm "></TitleComponent>
                <div className="card card-login mx-auto mt-5">
                    <div className="card-header">Login</div>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <div className="form-label-group">
                                    <input className={"form-control " + (this.state.authError ? 'is-invalid' : '')} id="authcode" placeholder="Confirmation code" type="text" name="authcode" onChange={this.handleCodeChange} autoFocus required/>
                                    <label htmlFor="inputEmail">Confirmation code</label>
                                    <div className="invalid-feedback">
                                        Please provide a valid confirmation code.
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary btn-block" type="submit" disabled={this.state.isSubmitLoading ? true : false} onClick={this.handleSubmit}>Submit &nbsp;&nbsp;&nbsp;
                                    {isSubmitLoading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <span></span>
                                    )}
                                </button>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary btn-block" type="submit" disabled={this.state.isResendLoading ? true : false} onClick={this.resendConfirmationCode} >Resend Confirmation &nbsp;&nbsp;&nbsp;
                                    {isResendLoading ? (
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


