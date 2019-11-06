import React, { Component } from 'react';
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import stmConfig from "../../../stmConfiguration";

class ProjectTasks extends Component {
  state = {
    project: {
      id: null,
      name: ""
    },
    task_list: [],
    currentProject: ''
  }
  taskToStore = (task) =>{
    this.props.taskToStore(task);
  }

  taskLoader = () => {    
    let project = this.props.location.pathname.split("/").pop();
    // let project = {};
    
    const comp_this = this;
    axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
    axios
      .get(stmConfig.apiBaseUrl + "/api/" + stmConfig.user.org.slug + "/projects/" + project + "/tasks/")
      .then(function (response) {
        comp_this.taskToStore(response.data.results);
      })
      .catch(function (error, response) {
        console.log("error in catch");
      });
  }
  taskDetails = (task, id) => {
    this.props.history.push({
      pathname: stmConfig.route.taskDetails,
      state: {
        task_detail: task,
        project_id: id
      }
    })
  }
  test = () =>{
    this.setState({currentProject: 'asdasdas'})
  }
  componentDidMount() {
    // this.setState({currentProject : this.props.project.currentProject})
    // this.props.currentProject(this.props.project.currentProject);
    this.taskLoader();
    console.log('cdm');
  }

  render() {
    console.log(this.props, 'asdasdsadsa');
    const task = this.props.task.task

    return <React.Fragment>
      <div className="body_content plr-20 content-detail min-100vh">
        <h1 className="semibold grey fs-28">
          {stmConfig.user.org.name}
          <NavLink className="create-floating-btn" to={
            {
              pathname: stmConfig.route.createTask,
              state: { project_id: this.state.project.id }
            }
          }><i className="fas fa-plus "></i></NavLink>
        </h1>
        <h4>{this.state.project.name}</h4>
        <hr />
        {task.map(task_list => {
          return <div key={task_list.id} className="col-md-12 task-wrap" onClick={() => this.taskDetails(task_list, this.state.project.id)}>
            <div className={"box-one shadow " + (task_list.status === "open" ? "blue" : "red") + "-border task-wrap-border"}>
              <div className="task-des">
                <p className="task-name-list">
                  {task_list.title}
                </p>
                <div className="task-list-meta">
                  <div className="row clearfix">
                    <div className="col-md-3">
                      <p className="text-left margin-right">
                        <label>
                          Created By:
                                  </label> {task_list.created_by_json.name}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <p className="text-left margin-right">
                        <label>
                          Assigned to:
                                  </label>
                        {(task_list.assigned_json) ? task_list.assigned_json.name : 'N/A'}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <p className="text-left margin-right">
                        <label>Status:</label>
                        {task_list.status}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <p className="text-left">
                        <label>
                          Deadline:
                                  </label> {task_list.deadline ? task_list.deadline : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="task-list-description">
                  {task_list.description}
                </p>
              </div>
            </div>
          </div>;
        })}
      </div>
    </React.Fragment>;
  }
}

 
const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = (dispatch) => {
  return {
      taskToStore(task) {
          const action = { type: "task", task: task }
          dispatch(action);
      },
      currentProject(id) {
        const action = { type: "currentProject", currentProject: id }
        dispatch(action);
    }
  }
}


const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(ProjectTasks);
export default MappedComponent;