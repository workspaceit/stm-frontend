import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../../resources/images/logo_inline.png';
import axios from 'axios';
import stmConfig from "../../../stmConfiguration";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class Registration extends Component {

    state = {
        user_data: {
            user: {
                username: "",
                email: "",
                first_name: "",
                last_name: "",
                password: "",
                confirm_password: ""
            },
            phone_number: "",
            dob: ""
        },
        error_data: {
            email: "",
            username: "",
            first_name: "",
            password: ""
        },
        selectedDate: moment()
    }

    // initailDate = () => {
    //     selectedDate
    //     return moment()
    // }

      handleChange = (date) => {
        this.setState({
            selectedDate: date
        });
      }

    setFirstname = (e) => {
        let user_data = { ...this.state.user_data };
        user_data.user.first_name = e.target.value.trim();
        this.setState({ user_data });
    }

    setLirstname = (e) => {
        let user_data = { ...this.state.user_data };
        user_data.user.last_name = e.target.value.trim();
        this.setState({ user_data });
    }
    setEmail = (e) => {
        let user_data = { ...this.state.user_data };
        user_data.user.email = e.target.value.trim();
        this.setState({ user_data });
    }
    setPhone = (e) => {
        let user_data = { ...this.state.user_data };
        user_data.phone_number = e.target.value.trim();
        this.setState({ user_data });
    }
    setPassword = (e) => {
        let user_data = { ...this.state.user_data };
        user_data.user.password = e.target.value.trim();
        this.setState({ user_data });
    }
    setUsername = (e) => {
        let user_data = { ...this.state.user_data };
        user_data.user.username = e.target.value.trim();
        this.setState({ user_data });
    }
    setRePassword = (e) => {
        let user_data = { ...this.state.user_data };
        user_data.user.confirm_password = e.target.value.trim();
        this.setState({ user_data });
    }

    onResgistrationSubmit = (e) => {        
        e.preventDefault();
        this.resetState();
        if (this.state.user_data.user.username.length < 1 || this.state.user_data.user.email.length < 1 || this.state.user_data.user.first_name.length < 1 || this.state.user_data.user.password.length < 1) {
            let error_data = {
                email: "",
                username: "",
                first_name: "",
                password: ""
            }
            if (this.state.user_data.user.username.length < 1) {
                error_data.username = "User Name Required"
            }
            if (this.state.user_data.user.email.length < 1) {
                error_data.email = "Email Required"
            }
            if (this.state.user_data.user.first_name.length < 1) {
                error_data.first_name = "First Name Required"
            }
            if (this.state.user_data.user.password.length < 1) {
                error_data.password = "Password Required"
            }
            this.setState({error_data});
            return;
        }
        if (this.state.user_data.user.password !== this.state.user_data.user.confirm_password){
            alert('Password did not match');
            return;
        }
        this.state.user_data.dob = this.state.selectedDate.format("Y-M-D");
        let params = this.state.user_data;
        let comp_this = this;

        // axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        const prop = this.props;
        axios.post(stmConfig.apiBaseUrl + "/api/user-register/", params)
            .then(function (response) {
                if (response.data.uid) {
                    prop.history.push({
                        pathname: stmConfig.route.login,
                        state: {
                            username: response.data.user.username
                        }
                    });
                    
                } else {
                    
                }
            })
            .catch(function (error, response) {
                // console.log(error.response);
                
                Object.keys(error.response.data).map(key => {
                    // console.log(key);

                    if (key == "email"){
                        let error_data = { ...comp_this.state.error_data };
                        error_data.email = error.response.data[key];
                        comp_this.setState({ error_data });
                    }
                    if (key == "username"){
                        let error_data = { ...comp_this.state.error_data };
                        error_data.username = error.response.data[key];
                        comp_this.setState({ error_data });
                    }
                    // console.log(error.response.data[key]);
                });
            });
        // this.props.history.push({
        //   pathname: "/dashboard",
        //     state: { access_token: "user access_token" }
        // });
    }

    resetState  = () =>{
        let error_data = {
            email: "",
            username: "",
        }
        this.setState({error_data});
    }

    componentDidMount() {
        if (localStorage.getItem("stm_access_token") != null) {
            this.props.history.push(stmConfig.route.dashboard);
        }
    }

    render() {
        return (
            <div>
                <div className="login_wrap">
                    <div className="container">
                        <div className="row clearfix">
                            <div className="col-md-8 col-sm-8 col-xs-12 col-md-offset-2 col-sm-offset-2 login_box_wrap w-100 h-100">
                                <div className="login_box">
                                    <div className="logo_wrap text-center">
                                        <NavLink to={stmConfig.route.home}> <img src={logo} alt="logo" /></NavLink> 
                                    </div>
                                    <form action="" onSubmit={this.onResgistrationSubmit}>
                                        <div className="row clearfix">
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group">
                                                    <label htmlFor="email" className="secondary_color">First name:</label>
                                                    <input type="text" onChange={this.setFirstname} className="form-control black_input color_secondary" id="f_name" />
                                                    <div className="validation-message username-validation">{this.state.error_data.first_name}</div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email" className="secondary_color">Email:</label>
                                                    <input type="email" onChange={this.setEmail} className={"form-control black_input color_secondary " + ((this.state.error_data.email != '')  ? 'invalid-field' : '')} id="mail" />
                                                    <p className="validation-message email-validation">{this.state.error_data.email}</p>
                                                    
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email" className="secondary_color">Phone:</label>
                                                    <input type="text" onChange={this.setPhone} className="form-control black_input color_secondary" id="phone" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email" className="secondary_color">Password:</label>
                                                    <input type="password" onChange={this.setPassword} className="form-control black_input color_secondary" id="pass" />
                                                    <div className="validation-message username-validation">{this.state.error_data.password}</div>

                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group">
                                                    <label htmlFor="email" className="secondary_color">Last name:</label>
                                                    <input type="text" onChange={this.setLastname} className="form-control black_input color_secondary" id="l_name" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email" className="secondary_color">User Name:</label>
                                                    <input type="text" onChange={this.setUsername} className={"form-control black_input color_secondary " + ((this.state.error_data.username != '') ? 'invalid-field' : '')} id="u_name" />
                                                    <div className="validation-message username-validation">{this.state.error_data.username}</div>

                                                </div>
                                                                                                
                                                <div className="form-group">
                                                    <label className="secondary_color">Date Of Birth:</label>
                                                    <DatePicker className="form-control" selected={this.state.selectedDate}
                                                    onChange={this.handleChange}
                                                    dateFormat="LL"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="email" className="secondary_color">Confirm Password:</label>
                                                    <input type="password" onChange={this.setRePassword} className="form-control black_input color_secondary" id="cpass" />
                                                </div>
                                            </div>
                                        </div>

                                        <input type="submit" name="" className="reg_btn dbtn_primary login_btn" value="Register" />
                                        <NavLink className="dbtn_primary login_btn" to='/login'>Login</NavLink>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        );
    }
}

export default Registration;