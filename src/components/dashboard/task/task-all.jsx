import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import stmConfig from "../../../stmConfiguration";
import { getAllTasksAction } from '../../../actions/tasks'
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Tasks, { TaskListHeader } from "../task/tasklist-template";
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

class TasksAll extends Component {
    componentDidMount() {
        this.props.getAllTasksAction();
    }
    render() {
        let myAllTasks = this.props.myTasks;
        return (
            <div>
                <div className="pd">
                    <div className="content-inner">
                        <div className="row">
                            <div className="col">
                                <h1 className="subheader semibold grey fs-28">All Tasks <NavLink className="create-floating-btn" to={stmConfig.route.createProject}><i className="fas fa-plus "></i><span className={'floating_title'}>Create Project</span></NavLink></h1>
                                <hr />
                                <div className={'row'}>
                                    <div className="col">
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
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        myTasks: state.task.myAllTasks
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
        { getAllTasksAction, },
        dispatch
    )
}
const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(TasksAll);
export default MappedComponent;