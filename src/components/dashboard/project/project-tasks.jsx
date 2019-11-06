import React, { Component } from 'react';
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import stmConfig from "../../../stmConfiguration";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Tasks, { TaskListHeader } from "../task/tasklist-template";

class ProjectTasks extends Component {
  state = {
    id: '',
    project: {},
    task: [],
    orgSlug: ''
  }
  taskDetails = (task, id, orgSlug) => {
    //console.log(this.props, "History");
    this.props.history.push({
      pathname: stmConfig.route.taskDetails + "/" + orgSlug + "/" + id + "/" + task.id,
      state: {
        task_detail: task,
        project: id,
        orgSlug: orgSlug
      }
    })
  }

  componentDidMount() {
    let project = {}
    let task = []
    const orgSlug = this.props.match.params.slug;
    const projectId = this.props.match.params.id;
    let comp_this = this;
    axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
    axios.get(stmConfig.apiBaseUrl + "/api/" + orgSlug + "/projects/" + projectId + "/")
      .then(function (response) {
        project = response.data
        axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios
          .get(stmConfig.apiBaseUrl + "/api/" + orgSlug + "/projects/" + projectId + "/tasks/")
          .then(function (response) {
            task = response.data.results
            comp_this.setState({ project, task, orgSlug });
          })
          .catch(function (error, response) {
            console.log(error, 'error');
          });

      })
      .catch(function (error, response) {
        console.log('error in sada');

      });

  }
  delete = (task, project, org, name) => {
    
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to delete this task named: ' + name,
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            let comp_this = this;
            axios.defaults.headers.delete["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
            axios
              .delete(stmConfig.apiBaseUrl + "/api/" + org + "/projects/" + project.id + "/tasks/" + task + "/")
              .then(function (response) {
                let newTask = comp_this.state.task.filter(function (taskon) { return taskon.id != task });
                comp_this.setState({ task: newTask })
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
  render() {
    let project = this.state.project
    let task = this.state.task
    let orgSlug = this.state.orgSlug;


    return <React.Fragment>
      <div className="content-inner">
        <h1 className="semibold grey fs-28">
          {stmConfig.user.org.name}
          <NavLink className="create-floating-btn" to={
            {
              pathname: stmConfig.route.createTask,
              state: { project_id: this.props.match.params.id }
            }
          }><i className="fas fa-plus "></i><span className={'floating_title'}>Create Task</span></NavLink>
        </h1>
        <h4>{project.name}</h4>
        <hr />
        <TaskListHeader />
        <div className={'row'}>
          {
            task.map((task, i) => {
              return (<Tasks key={i} task={task} history={this.props.history} />)
            })
          }
        </div>        
      </div>
    </React.Fragment>
  }
}


const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = (dispatch) => {
  return {

  }
}


const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(ProjectTasks);
export default MappedComponent;