import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import stmConfig from "../../../stmConfiguration";
import logo from '../../../resources/images/logo.png';

class Header extends Component {
    state = {}
    render() {
        return (
            <div className="landin-nav">
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <div className="container">
                        <div className="navbar-header col-12">
                            <NavLink className="navbar-brand float-left" to={stmConfig.route.home}><img src={logo} alt="logo" /> </NavLink>
                            <div className={'nav-area float-right'}>
                                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse" id="navbarText">
                                    <ul class="navbar-nav mr-auto">
                                        <li className={'nav-item'}>
                                            <NavLink to={stmConfig.route.login}>
                                                Login
                                    </NavLink>
                                        </li>
                                        <li className={'nav-item'}>
                                            <NavLink to={stmConfig.route.registration}>
                                                Registration
                                    </NavLink>
                                        </li>
                                        <li className={'nav-item'}>
                                            <NavLink to={stmConfig.route.about}>
                                                About
                                    </NavLink>
                                        </li >
                                        <li className={'nav-item'}>
                                            <NavLink to={stmConfig.route.contact}>
                                                Contact
                                    </NavLink>
                                        </li >
                                    </ul>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </nav>               

            </div>
        );
    }
}

export default Header;