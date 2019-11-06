import React, { Component } from 'react';
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import stmConfig from "../../../stmConfiguration";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

class Project extends Component {
    state = {
        project_list: [],
        acces_token: stmConfig.auth.accessToken,
        date_options: { year: "numeric", month: "long", day: "numeric" },
        flag: false
    }
    componentDidMount() {
        let org_slug = stmConfig.user.org.slug;
        const comp_this = this;
        if (org_slug != null) {
            this.getProjects(comp_this, org_slug)
        } else {
            stmConfig.methods.sleep(1500).then(() => {
                org_slug = stmConfig.user.org.slug;
                if (org_slug != null) {
                    this.getProjects(comp_this, org_slug)
                }
            });
        }
    }

    formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", this.state.date_options);
    }

    formatText = (text) => {
        if (text != null) {
            const tail = text.length > 50 ? "..." : "";
            text = text.substring(0, 50) + tail;
        }
        return text;
    }
    projectToStore = (project) => {
        this.props.projectToStore(project);
    }

    getProjects(comp_this, org_slug) {
        axios.defaults.headers.get["Authorization"] = "Bearer " + this.state.acces_token;
        axios.get(stmConfig.apiBaseUrl + "/api/" + org_slug + "/projects/")
            .then(function (response) {
                comp_this.setState({ project_list: response.data.results });
                comp_this.projectToStore(response.data.results);
            })
            .catch(function (error, response) {
                console.log('error in sada');

            });
    }

    projectDetails = (project) => {
        let comp_this = this;
        axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios
            .get(stmConfig.apiBaseUrl + "/api/" + stmConfig.user.org.slug + "/projects/" + project.id + "/tasks/")
            .then(function (response) {
                comp_this.props.history.push({
                    pathname: stmConfig.route.projectTasks + "/" + stmConfig.user.org.slug + "/" + project.id,
                    state: {
                        task: response.data.results,
                        project: project
                    }
                })
            })
            .catch(function (error, response) {
                console.log(error, 'error');
            });


    }
    projectToStore = (project) => {
        this.props.projectToStore(project);
    }
    projectToStore = (project) => {
        this.props.projectToStore(project);
    }
    delete = (id, name) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this Project named: ' + name,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        let comp_this = this;
                        axios.defaults.headers.delete["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
                        axios
                            .delete(stmConfig.apiBaseUrl + "/api/" + id + "/delete-project/")
                            .then(function (response) {                                 
                                let newProject = comp_this.props.project.project .filter(function (project) { return project.id != id });
                                comp_this.projectToStore(newProject);
                            })
                            .catch(function (error, response) {
                                console.log(error, 'error');
                            });
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        return;
                    }
                }
            ]
        })
        return;
    }
    Edit = (project) =>{
        this.props.history.push({
            pathname: stmConfig.route.editProject + "/" + this.props.user.orgSlug + "/" + project.id
        })
    }

    render() {
        const project = this.props.project.project        
        
        return (
            <div>
                <div className="pd">
                    <div className="content-inner">
                        <div className="row">
                            <div className="col">
                                <h1 className="semibold grey fs-28">Project List <NavLink className="create-floating-btn" to={stmConfig.route.createProject}><i className="fas fa-plus "></i><span className={'floating_title'}>Create Project</span></NavLink></h1>
                                <hr />
                                <div className={'row'}>
                                    {project.map(project => {
                                        return (
                                            <div className="col-3 project-list-wrap" key={project.id} onClick={() => this.projectDetails(project)}>
                                                <div className={"list-project  " + (project.status === 'active' ? 'active' : 'inactive')}>
                                                    <div className="text-center project-list-des">
                                                        <p className="pl-buttons clearfix">
                                                            <span className={'pull-right'}>
                                                                <button className={'button-action button-edit transition mr-2'} onClick={
                                                                    (e) => {
                                                                        e.stopPropagation();
                                                                        this.Edit(project)
                                                                    }}>
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                                <button className="button-action button-delete transition" onClick={
                                                                    (e) => {
                                                                        e.stopPropagation();
                                                                        this.delete(project.id, project.name)
                                                                    }}>
                                                                    <i className="fas fa-trash-alt"></i>
                                                                </button>
                                                            </span>
                                                        </p>
                                                        <p className={'project-icon display-4 text-secondary'}><i className="fas fa-clipboard-list"></i></p>
                                                        <div className="admin-detail clearfix">
                                                            <p className="pl-admin">{(project.manager_name) ? project.manager_name :
                                                                "N/A"}</p>
                                                            {/*<p className="pl-org">{stmConfig.user.org.name}</p>*/}
                                                        </div>
                                                        <div className="date-detail clearfix">
                                                            <p className="text-muted pl-create no-margin-btm"><label></label>{this.formatDate(project.created_at)}</p>
                                                        </div>
                                                        <div className="pl-detail clearfix">
                                                            {/*<p className="pl-create no-margin"><label>Description:</label></p>*/}
                                                            {/*<p className="pl-des">{project.description}</p>*/}
                                                        </div>
                                                    </div>
                                                </div>
                                                <h6 className={'mt-2 font-weight-bold text-center'}>{project.name}</h6>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
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
        projectToStore(project) {
            const action = { type: "project", project: project }
            dispatch(action);
        }
    }
}


const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(Project);
export default MappedComponent;