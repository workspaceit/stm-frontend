import React, { Component } from 'react';
import { connect } from "react-redux"; 
import { NavLink } from 'react-router-dom';
import stmConfig from "../../../stmConfiguration";
import axios from "axios";

class ContentHeader extends Component {

    logoutHandler = (e) => {
        let params = new URLSearchParams();
        const compThis = this.props;
        params.append("client_id", stmConfig.auth.clientId);
        params.append("token", stmConfig.auth.accessToken);
        axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        axios
            .post(stmConfig.apiBaseUrl + "/o/revoke_token/", params)
            .then(function (response) {
                stmConfig.methods.destroyCredentials();
                compThis.history.push(stmConfig.route.login);
            })
            .catch(function (error) {
            });
    }

    render() {
        return (
          <div className="content-header">
              <div className="row">
                  <div className="col">
                      <h1 className="float-left header_title semibold grey fs-28">Dashboard</h1>
                      <div className="header_right float-right">
                          <div className="row">
                              <div className="col header_search">
                                  <input type="text" name="search" placeholder="Go To any Project or Task"
                                         className="header_search_input transition"/>
                              </div>
                              <div className="col add_new_button">
                                  <div className="dropdown">
                                      <button className="btn btn-secondary dropdown-toggle transition" type="button"
                                              id="addNew"
                                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                          <i className="fas fa-plus"></i> New
                                      </button>
                                      <div className="dropdown-menu" aria-labelledby="addNew">
                                          <a className="dropdown-item" href="#">Task</a>
                                          <a className="dropdown-item" href="#">Project</a>
                                          <a className="dropdown-item" href="#">Conversion</a>
                                          <a className="dropdown-item" href="#">Invite</a>
                                      </div>
                                  </div>
                              </div>
                              <div className="col help_button">
                                  <div className="dropdown">
                                      <button className="btn btn-secondary dropdown-toggle" type="button"
                                              id="helpButton"
                                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                          <i className="far fa-question-circle"></i>
                                      </button>
                                      <div className="dropdown-menu" aria-labelledby="helpButton">
                                            <a className="dropdown-item" href="#">Profile Settings</a>
                                            <a className="dropdown-item" href="#">Add Skills</a>                                            
                                      </div>
                                  </div>
                              </div>
                              <div className="col profile_button">
                                  <div className="dropdown">
                                      <button className="btn btn-secondary dropdown-toggle" type="button"
                                              id="profileButton"
                                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                          Me
                                      </button>
                                      <div className="dropdown-menu" aria-labelledby="profileButton">
                                            <a className="dropdown-item" href="#">Profile Settings</a>
                                            <a className="dropdown-item" href="#">Add Skills</a>
                                            <NavLink to={stmConfig.route.home} onClick={this.logoutHandler}>
                                                <i className="fas fa-sign-out-alt text-danger"></i><span className="ml-2 text-danger">Logout</span>
                                            </NavLink>
                                      </div>
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

export default ContentHeader;