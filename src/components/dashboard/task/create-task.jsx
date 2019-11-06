import React, { Component } from 'react';
import axios from 'axios';
import stmConfig from "../../../stmConfiguration";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { successAction, deleteAction } from "../../../actions/actionToastify";
import { bindActionCreators } from "redux";



class CreateTask extends Component {
    state = {
        task: {
            title: "",
            description: "",
        },
        error: {
            title: "",
            description: "",
        },
        acces_token: stmConfig.auth.accessToken
    };

    setTaskTitle = (e) => {
        let task_data = { ...this.state.task };
        task_data.title = e.target.value.trim();
        this.setState({ task: task_data });
    }
    setTaskDescription = (e) => {
        let task_data = { ...this.state.task };
        task_data.description = e.target.value.trim();
        this.setState({ task: task_data });
    }

    resetState = () => {
        let error = {
            title: "",
            description: ""
        }
        this.setState({ error: error });
    }

    onTaskSubmit = (e) => {
        e.preventDefault();
        this.resetState();
        let error_data = { ...this.state.error };
        if (this.state.task.title.length < 1) {
            error_data.title = 'Task Title is Required';
            this.setState({ error: error_data });
        }
        let params = this.state.task;
        const prop = this.props;
        const comp_this = this;
        let token = this.state.acces_token;
        axios.defaults.headers.post["Authorization"] = "Bearer " + token;
        axios.post(stmConfig.apiBaseUrl + "/api/" + stmConfig.user.org.slug + "/projects/" + this.props.location.state.project_id + "/tasks/", params)
            .then(function (response) {
                let project = response.data.project_json

                axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
                axios
                    .get(stmConfig.apiBaseUrl + "/api/" + stmConfig.user.org.slug + "/projects/" + project.id + "/tasks/")
                    .then(function (response) {
                        let message = "New Task Created";
                        prop.successAction(message);
                        setTimeout(function() {
                            comp_this.props.history.push({
                                pathname: stmConfig.route.projectTasks + "/" + stmConfig.user.org.slug + "/" +  project.id + "/",
                            })
                        }.bind(this), 2000)                        
                    })
                    .catch(function (error, response) {
                        console.log(error, 'error');
                        prop.deleteAction(error);
                    });

            })
            .catch(function (error, response) {

            });
    }

    render() {
        return (
            <div>
                <div className="pd">
                    <div className="content-inner">
                        <div className="row">
                            <div className="col">
                                <div className="centered-form">
                                    <h1 className="subheader semibold grey fs-28">Create Task</h1>
                                    <hr />
                                    <form action="" onSubmit={this.onTaskSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name" className="secondary_color">Name:</label>
                                            <input type="text" onChange={this.setTaskTitle} className="form-control theme_input color_secondary" id="o-name" />
                                            <div className="validation-message username-validation">{this.state.error.name}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description" className="secondary_color">Description:</label>
                                            <textarea onChange={this.setTaskDescription} className="form-control theme_input color_secondary" rows="3"></textarea>

                                        </div>
                                        <input type="submit" name="" className="btn btn-submit btn-sm btn-block" value="save" />
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

const mapStateToProps = state => ({
    value: state.value
  });
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { successAction, deleteAction },
         dispatch
    )
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateTask);