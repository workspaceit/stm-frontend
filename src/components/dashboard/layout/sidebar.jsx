import React, { Component } from 'react';
import { connect } from "react-redux";
import logo from '../../../resources/images/logo.png';
import userpic from '../../../resources/images/user.jpg';
import { NavLink } from 'react-router-dom';
import stmConfig from "../../../stmConfiguration";
import axios from "axios";
import Loader from '../../../resources/images/loader.gif';

class Sidebar extends Component {
    state = {
        orgnization_submenu: false,
        project_submenu: false,
        task_submenu: false,
        organization: [],
        project: [],
        member: [],
        orgToggle: false,
        loaderClass: "page_loader"
    }

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

    divStyle2 = {
        'width': '100%'
    };

    menuToggler = (e, type) => {
        e.preventDefault();
        switch (type) {
            case 'organization':
                let orgnization_submenu = !this.state.orgnization_submenu;
                this.setState({ orgnization_submenu });
                break;

            default:
                break;
        }

    }
    toggle = (e) => {
        let orgToggle = !this.state.orgToggle;

        this.setState({ orgToggle })
    }
    setUserData = (data) => {
        this.props.setUserData(data)
    }
    changeOrg = (id) => {
        let org_id = {
            org_id: id
        };
        const comp_this = this;
        let params = org_id;
        axios.defaults.headers.post["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios.post(stmConfig.apiBaseUrl + "/api/switch-organization/", params)
            .then(function (response) {
                stmConfig.user.uid = response.data.uid;
                stmConfig.user.name = response.data.name;
                stmConfig.user.org.id = response.data.org_id;
                stmConfig.user.org.slug = response.data.org_slug;
                stmConfig.user.org.name = response.data.org_name;
                comp_this.setUserData(response.data);
                comp_this.getAllProject();
                comp_this.getAllMembers();
                window.location.href = '/dashboard';

            })
            .catch(function (error, response) {
                console.log('error in catch');

            });
    }
    addMember = () => {
        this.props.history.push({
            pathname: stmConfig.route.members
        })
    }
    memberList = () => {
        this.props.history.push({
            pathname: stmConfig.route.members
        })
    }
    addOrg = () => {
        this.props.history.push({
            pathname: stmConfig.route.createorganizations
        })
    }
    moreOrg = () => {
        this.props.history.push({
            pathname: stmConfig.route.listOrganization
        })
    }
    projectList = () => {
        this.props.history.push({
            pathname: stmConfig.route.projects
        })
    }
    organizationToStore = (organization) => {
        this.props.organizationToStore(organization)
    }
    getAllOrg = () => {
        const comp_this = this;
        axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios.get(stmConfig.apiBaseUrl + "/api/organizations/")
            .then(function (response) {
                comp_this.setState({ organization: response.data.results })
                comp_this.organizationToStore(response.data.results)
                comp_this.getAllMembers();
                comp_this.getAllProject();                
            })
            .catch(function (error, response) {
                console.log('error in catch');

            });
            const loaderClass = this.state.loaderClass + " hide";
            comp_this.setState({ loaderClass })
    }
    projectToStore = (project) => {
        this.props.projectToStore(project);
    }
    getAllProject = () => {
        const access_token = localStorage.getItem("stm_access_token");
        const comp_this = this;
        axios.defaults.headers.get["Authorization"] = "Bearer " + access_token;
        axios.get(stmConfig.apiBaseUrl + "/api/" + this.props.user.orgSlug + "/projects/")
            .then(function (response) {
                comp_this.setState({ project: response.data.results })
                comp_this.projectToStore(response.data.results)
            })
            .catch(function (error, response) {
                console.log('error in catch');

            });

    }
    memberToStore = (member) => {
        this.props.memberToStore(member)
    }
    getAllMembers = () => {
        let params = this.props.user.orgId;
        const comp_this = this;
        axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios.get(stmConfig.apiBaseUrl + "/api/organizations-members/?org_id=" + params)
            .then(function (response) {
                comp_this.setState({ member: response.data });
                comp_this.memberToStore(response.data);
            })
            .catch(function (error, response) {
                console.log('error in catch');

            });
    }
    selectProject = (project) => {
        console.log(project, 'project');
        let url = stmConfig.route.projectTasks + "/" + stmConfig.user.org.slug + "/" + project.id;
        window.location.replace(url);
        
        // let comp_this = this;
        // axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        // axios
        //     .get(stmConfig.apiBaseUrl + "/api/" + stmConfig.user.org.slug + "/projects/" + project.id + "/tasks/")
        //     .then(function (response) {                
        //         comp_this.props.history.push({
        //             pathname: stmConfig.route.projectTasks + "/" + stmConfig.user.org.slug + "/" + project.id,
        //             state: {
        //                 task: response.data.results,
        //                 project: project
        //             }
        //         })
        //     })
        //     .catch(function (error, response) {
        //         console.log(error, 'error');
        //     });

    }
    addProject = () => {
        this.props.history.push({
            pathname: stmConfig.route.createProject
        })
    }
    componentDidMount() {
        this.getAllOrg();
    }
    render() {
        let organization = this.state.organization;
        let project = this.props.project.project;
        let member =  this.props.member.members;
        let count = 0;
        let ProjectCount = 0;
        let memberCount = 0;
        return (

            <div className="sidebar_inner">
                <div className={this.state.loaderClass}>
                    <div className="page_lead_wrap">
                        <div className="page_loader_container">
                            <img src={Loader} alt="" />
                        </div>
                    </div>
                </div>
                <div className="logo text-center">
                    <a className="sidebar_logo_wrap">
                        <img src={logo} alt="logo" />
                    </a>
                </div>

                <div className="user clearfix" >
                    <div className="user_pic pull-left">
                        <img src={userpic} alt="userpic" style={this.divStyle2} />
                    </div>
                    <div className="user_info pull-left">
                        <p className="username_text_1">{this.props.userName}</p>
                        <p className="username_text_2"><em>UI/UX Developer</em></p>
                    </div>
                </div>
                <div className={'organization_wrap'}>
                    <div className={'header'}>
                        <p>Organization</p>
                        <p>{this.props.user.orgName}</p>
                        <span className={'toggler'} onClick={(e) => this.toggle(e)}>
                            {(this.state.orgToggle ?
                                <i className="fas fa-chevron-up"></i> :
                                <i className="fas fa-chevron-down"></i>)}

                        </span>
                    </div>

                    <div className={"org_drop " + (this.state.orgToggle ? 'open' : 'closed') + ""}>
                        <ul>
                            {
                                organization.map((organization, index) => {
                                    if (count < 5 && (organization.id !== stmConfig.user.org.id)) {
                                        count++;
                                        return <li key={index} onClick={() => this.changeOrg(organization.id)} className={'clearfix'}><span><i className="fas fa-atom"></i> </span> <span> {organization.name} </span></li>
                                    }
                                    return true
                                })
                            }

                        </ul>
                        <div className={'org_control clearfix'}>
                            <p className={'addMore'} onClick={this.addOrg}><i className={'fas fa-plus'}></i> Add Organization</p>

                                <p onClick={this.moreOrg} className={'morebtn'}>See More...</p>

                        </div>
                    </div>
                </div>
                <div className="components">
                    <ul className="list-group menu_list">
                        <li className="list-group-item cstm-list-group-item">
                            <NavLink to={stmConfig.route.dashboard}>
                                <i className="fas fa-columns blueish-white"></i><span className="ml-10 blueish-white">Home</span>
                            </NavLink>
                        </li>


                        {/* <li className="list-group-item cstm-list-group-item">
                            <a href="#" onClick={(e) => this.menuToggler(e, type = "organization")}>
                                <i className="fas fa-clock blueish-white"></i><span className="ml-10 blueish-white">Organization</span>
                            </a>
                            <ul className={"submenu " + this.state.orgnization_submenu}>
                                <li><NavLink to={stmConfig.route.createorganizations}>
                                    <i className="fas fa-clock blueish-white"></i><span className="ml-10 blueish-white">Create</span>
                                </NavLink></li>
                                <li><NavLink to={stmConfig.route.members}>
                                    <i className="fas fa-clock blueish-white"></i><span className="ml-10 blueish-white"> Members</span>
                                </NavLink></li>
                            </ul>
                        </li> */}

                        {/* <li className="list-group-item cstm-list-group-item">
                            <NavLink to={stmConfig.route.listorganization}>
                                <i className="fas fa-clock blueish-white"></i><span className="ml-10 blueish-white">Organizations List</span>
                            </NavLink>
                        </li> */}

                        <li className="list-group-item cstm-list-group-item">
                            {/* <a href="#">

                            </a> */}
                            <NavLink to={stmConfig.route.tasklist}>
                                <i className="fas fa-project-diagram blueish-white"></i><span className="ml-10 blueish-white">My Tasks</span>
                            </NavLink>
                        </li>
                        {/* <li className="list-group-item cstm-list-group-item">
                            <NavLink to={stmConfig.route.tasks}>
                                <i className="fas fa-tasks blueish-white"></i><span className="ml-10 blueish-white">Tasks</span>
                            </NavLink>
                        </li> */}
                    </ul>

                    <div className={'project_wrap'}>
                        <div className={'header'}>
                            <p>My Projects</p>
                        </div>

                        <ul className={'side_projectList'}>
                            {
                                project.map((project, index) => {
                                    if (ProjectCount < 5) {
                                        ProjectCount++;
                                        return <li key={index} className={'clearfix'} onClick={() => this.selectProject(project)}>
                                            <span><i className="fas fa-atom"></i> </span> <span> {project.name } </span>
                                        </li>

                                    }
                                    return true
                                })
                            }
                        </ul>

                        <div className={'project_control clearfix'}>
                            <p className={'addMore'} onClick={this.addProject}><i className={'fas fa-plus'}></i> Add Project</p>
                            {/* {(ProjectCount >= 5) && */}
                                <p onClick={this.projectList} className={'morebtn'}>See More...</p>
                            {/* } */}

                        </div>
                    </div>


                    <div className={'members_wrap'}>
                        <div className={'header'}>
                            <p>Members</p>
                        </div>

                        <ul className={'memberList'}>
                            {
                                member.map((member, index) => {
                                    if (memberCount < 5) {
                                        memberCount++;
                                        let name = member.name;
                                        let acronym = name.split(/\s/).reduce((response, word) => response += word.slice(0, 2), '')
                                        return (
                                            <li key={index}>
                                                {/* <img src={'https://static1.squarespace.com/static/573d831a4c2f85faa4503bec/t/594246d2197aea41fb4a7b3c/1497707994871/'} /> */}
                                                {acronym}
                                            </li>
                                        )
                                    }
                                    return true
                                })
                            }
                        </ul>

                        <div className={'project_control clearfix'}>
                            <p className={'addMore'} onClick={this.addMember}><i className={'fas fa-plus'}></i> Add Member</p>
                            {(memberCount >= 5) &&
                                <p onClick={this.memberList} className={'morebtn'}>See More...</p>
                            }

                        </div>
                    </div>
                    {/* <ul className="list-group menu_list">
                        <li className="list-group-item cstm-list-group-item">
                            <NavLink to={stmConfig.route.home} onClick={this.logoutHandler}>
                                <i className="fas fa-sign-out-alt blueish-white"></i><span className="ml-10 blueish-white">Logout</span>
                            </NavLink>
                        </li>
                    </ul> */}
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        setUserData(data) {
            const action = {
                type: "userUpdate",
                uid: data.uid,
                name: data.name,
                orgId: data.org_id,
                orgSlug: data.org_slug,
                orgName: data.org_name
            }
            dispatch(action);
        },
        memberToStore(member) {
            const action = { type: "member", member: member }
            dispatch(action);
        },
        organizationToStore(organization) {
            const action = { type: "organization", organization: organization }
            dispatch(action);
        },
        projectToStore(project) {
            const action = { type: "project", project: project }
            dispatch(action);
        },

    }
}


const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(Sidebar);
export default MappedComponent;