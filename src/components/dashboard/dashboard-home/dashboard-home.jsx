import React, { Component } from 'react';
import axios from "axios";
import stmConfig from '../../../stmConfiguration';
import {connect} from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { getAllTasksAction } from '../../../actions/tasks'
import { bindActionCreators } from "redux";
import Tasks, { TaskListHeader } from "../task/tasklist-template";

class DashboardHome extends Component {    
    componentDidMount() {
        this.props.getAllTasksAction();
    }

    render() {
        let myAllTasks = this.props.myTasks.task.myAllTasks;
        // console.log('props', myAllTasks) ;
        let projects = this.props.project.project;
        if (projects.length > 0)
        {
            projects;
        }

        return (
            <React.Fragment>
                <div className="content-inner">

                    <div className="row m-0">
                        <div className="col">
                            <div className="col-12 py-5 text-center welcome_content">
                                <ToastContainer />
                                <h2>Welcome to DO.DID.DONE, {stmConfig.user.name}!</h2>
                                <p className="text-secondary">Check out any upcoming tasks and recent projects <br/>below!</p>
                            </div>
                            <div className="col-12 py-5 dashboard_activities">
                                <div id="dashboardActivity">
                                    <div className="card">
                                        <div className="card-header" id="dueTask">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link" data-toggle="collapse"
                                                        data-target="#dueTaskCollaps" aria-expanded="true"
                                                        aria-controls="dueTaskCollaps">
                                                    Tasks Due Soon
                                                </button>
                                            </h5>
                                        </div>

                                        <div id="dueTaskCollaps" className="collapse show" aria-labelledby="dueTask"
                                             data-parent="#accordion">
                                            <div className="card-body">
                                                <TaskListHeader />
                                                <div className={'row'}>
                                                    {
                                                        myAllTasks.map((task, i) => {
                                                            return (<Tasks key={i} task={task} history={this.props.history} />)
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="recentProjects">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link collapsed" data-toggle="collapse"
                                                        data-target="#projectsCollaps" aria-expanded="false"
                                                        aria-controls="projectsCollaps">
                                                    Recent Projects
                                                </button>
                                            </h5>
                                        </div>
                                        <div id="projectsCollaps" className="collapse" aria-labelledby="recentProjects"
                                             data-parent="#accordion">
                                            <div className="card-body">
                                                <div className={'recent-projects'}>
                                                    {
                                                        projects.map((project, i)=> {
                                                            return ( <Project key={i} project={project} /> )
                                                        })
                                                    }
                                                    <a className={'project-widget db-new-proj'} href={stmConfig.route.createProject+'/'}>
                                                        <div className={'project-widget-area transition'}>
                                                            <i className="fas fa-plus"></i>
                                                        </div>
                                                        <div className={'project-name'}>
                                                            <span>New Project</span>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

class Project extends Component {
    render() {
        return (
            <a className={'project-widget'} href={stmConfig.route.projectTasks+'/'+stmConfig.user.org.slug+'/'+this.props.project.id}>
                <div className={'project-widget-area transition'}>
                    <i className="fas fa-clipboard-list"></i>
                    <div className={'project-hover-props transition'}>
                        <span>{this.props.project.manager_name}</span>
                    </div>
                </div>
                <div className={'project-name'}>
                    <span>{this.props.project.name}</span>
                </div>
            </a>
        )
    }
}


const mapStateToProps = state => {
    return {
        myTasks: state,
        project: state.project
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
        { getAllTasksAction, },
         dispatch
        )
}
const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(DashboardHome);
export default MappedComponent;