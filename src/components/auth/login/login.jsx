import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import logo from '../../../resources/images/logo_inline.png';
import flogo from '../../../resources/images/fb_icon.png';
import glogo from '../../../resources/images/google_icon.png';
import axios from 'axios';
import stmConfig from "../../../stmConfiguration";
import { NavLink } from 'react-router-dom';

class Login extends Component {
    state = {
        user: {
            username: "",
            password: "",
        },
        error: {
            username: "",
            password: "",
        },
        invalidauth: ""
    }

    setUsername = (e) => {
        this.resetState();
        let user = { ...this.state.user };
        user.username = e.target.value.trim();
        this.setState({ user });
    }

    setPassword = (e) => {
        this.resetState();
        let user = { ...this.state.user };
        user.password = e.target.value.trim();
        this.setState({ user });
    }

    resetState = () => {
        let error = {
            username: "",
            password: "",
        }
        this.setState({ error });
    }

    componentDidMount() {
        if (localStorage.getItem("stm_access_token") != null) {
            this.props.history.push(stmConfig.route.dashboard);
        } else if (this.props.location.state && this.props.location.state.username) {
            let user = { ...this.state.user };
            user.username = this.props.location.state.username;
            this.setState({ user });
        }
    }

    onLoginSubmit = (e) => {
        e.preventDefault();
        this.resetState();
        let comp_this = this;
        let error_update = { ...this.state.error };
        if (comp_this.state.user.username.length < 1 || comp_this.state.user.password.length < 1) {
            if (comp_this.state.user.username.length < 1) {
                error_update.username = 'Username is required';
            }
            if (comp_this.state.user.password.length < 1) {
                error_update.password = 'password is required';
            }
            comp_this.setState({ error: error_update });
            return;

        }
        let params = new URLSearchParams();
        params.append("client_id", stmConfig.auth.clientId);
        params.append("client_secret", stmConfig.auth.clientSecret);
        params.append("grant_type", "password");
        params.append("username", this.state.user.username);
        params.append("password", this.state.user.password);
        axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        const prop = this.props;
        axios.post(stmConfig.apiBaseUrl + "/o/token/", params)
            .then(function (response) {
                if (response.data.access_token) {
                    stmConfig.auth.accessToken = response.data.access_token;
                    localStorage.setItem("stm_access_token", response.data.access_token);
                    prop.history.push({
                        pathname: stmConfig.route.dashboard,
                        state: {
                            access_token: response.data.access_token
                        }
                    });
                } else {
                    alert('Something went wrong. Please contact aminisrator or try again.');
                }
            })
            .catch(function (error) {
                let invalidauth = { ...comp_this.state.invalidauth }
                invalidauth.invalidauth = 'Invalid Username or Password given.'
                comp_this.setState(invalidauth);
                console.log(comp_this.state.invalidauth);

            });

    }
    responseFacebook = (response) => {

        console.log(response);
        let userData = response;
        let sEmails = userData.email.split("@");
        let first_name = userData.name.split(" ");
        let username = sEmails[0];
        first_name = first_name[0];
        let user = {
            user: {
                username: username,
                email: userData.email,
                first_name: userData.name,
                last_name: first_name,
                password: "wsit97480",
                confirm_password: "wsit97480",
            }
        }
        let comp_this = this;

        let params = new URLSearchParams();
        params.append("user_email", response.email);
        axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        axios.post(stmConfig.apiBaseUrl + "/api/verify-email/", params)
            .then(function (response) {
                console.log(response, 'response 2');

                if (response.data === 'User dose not not exists') {
                    let params = user;
                    axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                    axios.post(stmConfig.apiBaseUrl + "/api/user-register/", params)
                        .then(function (response) {
                            if (response.statusText == "Created") {
                                let params = new URLSearchParams();
                                params.append("client_id", stmConfig.auth.clientId);
                                params.append("client_secret", stmConfig.auth.clientSecret);
                                params.append("grant_type", "password");
                                params.append("username", response.data.user.username);
                                params.append("password", "wsit97480");
                                axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                                axios.post(stmConfig.apiBaseUrl + "/o/token/", params)
                                    .then(function (response) {
                                        if (response.data.access_token) {
                                            stmConfig.auth.accessToken = response.data.access_token;
                                            localStorage.setItem("stm_access_token", response.data.access_token);
                                            comp_this.props.history.push({
                                                pathname: stmConfig.route.dashboard,
                                                state: {
                                                    access_token: response.data.access_token
                                                }
                                            });
                                        } else {
                                            alert('Something went wrong. Please contact aminisrator or try again.');
                                        }
                                    })
                                    .catch(function (error) {
                                        let invalidauth = { ...comp_this.state.invalidauth }
                                        invalidauth.invalidauth = 'Invalid Username or Password given.'
                                        comp_this.setState(invalidauth);
                                        console.log(comp_this.state.invalidauth);

                                    });
                            }


                        })
                        .catch(function (error, response) {

                        });
                }

            })
            .catch(function (error) {

            });


    }
    responseGoogle = (response) => {
        console.log(response.profileObj);
        let userData = response.profileObj;
        let sEmails = userData.email.split("@");
        let first_name = userData.givenName;
        let username = sEmails[0];
        let user = {
            user: {
                username: username,
                email: userData.email,
                first_name: userData.name,
                last_name: first_name,
                password: "wsit97480",
                confirm_password: "wsit97480",
            }
        }
        let comp_this = this;
        let params = new URLSearchParams();
        params.append("user_email", response.w3.U3);
        axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        axios.post(stmConfig.apiBaseUrl + "/api/verify-email/", params)
            .then(function (response) {
                if (response.data === 'User dose not not exists') {
                    let params = user;
                    axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                    axios.post(stmConfig.apiBaseUrl + "/api/user-register/", params)
                        .then(function (response) {
                            if (response.statusText == "Created") {
                                let params = new URLSearchParams();
                                params.append("client_id", stmConfig.auth.clientId);
                                params.append("client_secret", stmConfig.auth.clientSecret);
                                params.append("grant_type", "password");
                                params.append("username", response.data.user.username);
                                params.append("password", "wsit97480");
                                axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                                axios.post(stmConfig.apiBaseUrl + "/o/token/", params)
                                    .then(function (response) {
                                        if (response.data.access_token) {
                                            stmConfig.auth.accessToken = response.data.access_token;
                                            localStorage.setItem("stm_access_token", response.data.access_token);
                                            comp_this.props.history.push({
                                                pathname: stmConfig.route.dashboard,
                                                state: {
                                                    access_token: response.data.access_token
                                                }
                                            });
                                        } else {
                                            alert('Something went wrong. Please contact aminisrator or try again.');
                                        }
                                    })
                                    .catch(function (error) {
                                        let invalidauth = { ...comp_this.state.invalidauth }
                                        invalidauth.invalidauth = 'Invalid Username or Password given.'
                                        comp_this.setState(invalidauth);
                                        console.log(comp_this.state.invalidauth);

                                    });
                            }


                        })
                        .catch(function (error, response) {

                        });
                }
                else {
                    console.log("Google Response", response);
                    if (response.statusText == "OK") {
                        let params = new URLSearchParams();
                        params.append("client_id", stmConfig.auth.clientId);
                        params.append("client_secret", stmConfig.auth.clientSecret);
                        params.append("grant_type", "password");
                        params.append("username", response.data.user.username);
                        params.append("password", "wsit97480");
                        axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
                        axios.post(stmConfig.apiBaseUrl + "/o/token/", params)
                            .then(function (response) {
                                // console.log("Response Yes");
                                if (response.data.access_token) {
                                    console.log("Response Yes", response);
                                    stmConfig.auth.accessToken = response.data.access_token;
                                    localStorage.setItem("stm_access_token", response.data.access_token);
                                    comp_this.props.history.push({
                                        pathname: stmConfig.route.dashboard,
                                        state: {
                                            access_token: response.data.access_token
                                        }
                                    });
                                } else {
                                    alert('Something went wrong. Please contact aminisrator or try again.');
                                }
                            })
                            .catch(function (error) {
                                //console.log("Response No");
                                let invalidauth = { ...comp_this.state.invalidauth }
                                invalidauth.invalidauth = 'Invalid Username or Password given.'
                                comp_this.setState(invalidauth);
                                console.log(comp_this.state.invalidauth);

                            });
                    }
                    else {
                        
                    }

                }


            })
            .catch(function (error) {

            });
    }

    render() {

        return (
            <div>
                <div className="login_wrap">
                    <div className="container">
                        <div className="row justify-content-md-center">
                            <div className="col col-md-6 login_box_wrap">
                                <div className="login_box">
                                    <div className="logo_wrap text-center">
                                        <NavLink to={stmConfig.route.home}> <img src={logo} alt="logo" /></NavLink>
                                    </div>

                                    <form action="" onSubmit={this.onLoginSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="username" className="secondary_color">User name:</label>
                                            <input type="text" onChange={this.setUsername} value={this.state.user.username} className="form-control black_input color_secondary" id="u_name" />
                                            <div className="validation-message username-validation">{this.state.error.username}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="username" className="secondary_color">Password:</label>
                                            <input type="password" onChange={this.setPassword} className="form-control black_input color_secondary" id="u_pass " />
                                            <div className="validation-message password-validation">{this.state.error.password}</div>
                                        </div>
                                        <div className="checkbox custom_checkbox">
                                            <input type="checkbox" />
                                            <label> Remember me</label>
                                        </div>
                                        {/* <Link type="submit" className="dbtn_primary login_btn"  to='/dashboard'>Login</Link> */}
                                        <input type="submit" className="btn btn-primary" value="Login" />

                                        <p className={'mt-2'}>Don't Have Any Account?<Link to='/registration'>Register</Link> </p>
                                        <div className="validation-message username-validation">{this.state.invalidauth}</div>

                                    </form>
                                    <div className={'socialMediaWrap'}>
                                        <FacebookLogin
                                            appId=""
                                            appSecret=""
                                            render={renderProps => (
                                                <button className={'socialLoginBtn slFacebook'} onClick={renderProps.onClick}><span className={'sl_wrap'}><img src={flogo} alt="logo" /></span><span className={'slBtnText'}>Login With Facebook</span></button>
                                            )}
                                            autoLoad={false}
                                            fields="name,email,picture"
                                            callback={this.responseFacebook} />
                                        <GoogleLogin
                                            clientId=""
                                            buttonText="Login"
                                            render={renderProps => (
                                                <button className={'socialLoginBtn slGoogle'} onClick={renderProps.onClick}><span className={'sl_wrap'}><img src={glogo} alt="logo" /></span><span className={'slBtnText'}>Login With Google</span></button>
                                            )}
                                            onSuccess={this.responseGoogle}
                                            onFailure={this.responseGoogle}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
