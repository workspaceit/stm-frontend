import React, { Component } from "react";
import axios from 'axios';
import stmConfig from "../../../stmConfiguration";
import { connect } from "react-redux";
import { deleteTask } from '../../../actions/tasks';
import { bindActionCreators } from "redux";
import { withRouter } from 'react-router-dom';
import { taskDetailsChange } from '../../../actions/actionTaskDetails';


class Tasks extends Component {
    componentDidMount() {
        let task = this.props.task;
        let taskid = task.id;
        let project = task.project_json.id;
        let org = stmConfig.user.org.slug;
        let name = task.name;
        //this.props.deleteTask(taskid, project, org, name);
    }
    routeChange(task) {
        let projectId = task.project_json.id;
        let taskId = task.id;
        let orgSlug = stmConfig.user.org.slug;
        let path = stmConfig.route.taskDetails + "/" + orgSlug + "/" + projectId + "/" + taskId;
        this.props.history.push(path);
    }

    taskDelete = (task ) => {
        let taskId = task.id; 
        let project = task.project_json.id;
        let org = stmConfig.user.org.slug;
        let name = task.title;
        //console.log(this.props, 'this.props');
        this.props.deleteTask(taskId, project, org, name);
    };   
    taskStatusChange = (task ) => {
        let taskId = task.id; 
        let projId = task.project_json.id;
        let orgSlug = stmConfig.user.org.slug;
        let param = {
            status: "closed"
        };
        console.log("test");
        this.props.taskDetailsChange(taskId, projId, orgSlug, param);
    };   

    render() {
        let orgSlug = stmConfig.user.org.slug;
        // let const_this = this;
        return (
            <div onClick={(e) => this.routeChange(this.props.task)} className={'col-12 ' + (this.props.task.status === "open" ? "blue" : "red") + '-task task-wrap transition'}>                
                <div className="row align-items-center task-des">
                    <div className="col task-name">
                        <span className={""}>{this.props.task.title}</span>
                    </div>
                    <div className="col task-creator">
                        <p className="text-left  m-0">
                            {this.props.task.created_by_json.name}
                        </p>
                    </div>
                    <div className="col task-assign">
                        <p className="text-left  m-0">
                            {(this.props.task.assigned_json) ? this.props.task.assigned_json.name : 'N/A'}
                        </p>
                    </div>
                    <div className="col task-status">
                        <p className="text-left  m-0">
                            {this.props.task.status}
                        </p>
                    </div>
                    <div className="col task-deadline">
                        <p className="text-left m-0">
                            {this.props.task.deadline ? this.props.task.deadline : "N/A"}
                        </p>
                    </div>
                    <div className="col task-description">
                        <p className="m-0">
                            {this.props.task.description}
                        </p>
                    </div>
                    <div className="col">
                        <span className={"pull-right"}>
                            <button className={'button-action button-done transition mr-3'} onClick={(e) => {
                                e.stopPropagation();
                                this.taskStatusChange(this.props.task);
                            }}>
                                <i className="far fa-check-circle"></i>
                            </button><button className={'button-action button-edit transition mr-3'}>
                                <i className="far fa-edit"></i>
                            </button>
                            <button className={'button-action button-delete transition'} onClick={(e) => {
                                e.stopPropagation();
                                this.taskDelete(this.props.task);
                            }}><i className="far fa-trash-alt"></i></button>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}


// const mapStateToProps = state => {
//     return {
//     }
// };
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
        {
            deleteTask,
            taskDetailsChange
        },
        dispatch
    )
}
export default connect(null, mapDispatchToProps)(Tasks);

export class TaskListHeader extends Component {
    render() {
        return (
            <div className={'row mt-5 mb-3'}>
                <div className={'col'}>
                    <p className={'font-weight-bold m-0'}>Task Name</p>
                </div>
                <div className={'col'}>
                    <p className={'font-weight-bold m-0'}>Created By</p>
                </div>
                <div className={'col'}>
                    <p className={'font-weight-bold m-0'}>Assigned To</p>
                </div>
                <div className={'col'}>
                    <p className={'font-weight-bold m-0'}>Status</p>
                </div>
                <div className={'col'}>
                    <p className={'font-weight-bold m-0'}>Deadline</p>
                </div>
                <div className={'col'}>
                    <p className={'font-weight-bold m-0'}>Description</p>
                </div>
                <div className={'col'}>
                    <p className={'font-weight-bold m-0'}>Actions</p>
                </div>
            </div>
        )
    }
}
