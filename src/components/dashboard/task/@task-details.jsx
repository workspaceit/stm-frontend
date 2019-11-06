import React, { Component } from "react";
import axios from 'axios';
import Select from 'react-select';
import stmConfig from "../../../stmConfiguration";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { Breadcrumbs } from 'react-breadcrumbs-dynamic'

const options = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'disputed', label: 'Disputed' }
];
const option_assigned = [];

class TaskDetails extends Component {
  state = {
    selectedOption: null,
    task_details: {},
    project: "",
    assigned_to: option_assigned,
    assigned_member: {},
    deadline: null
  };

  formatDate(date) {
    if (date === null) {
      return date;
    }
    return moment(date);
  }

  componentDidMount() {
    let comp_this = this;
    let status = {}
    let orgSlug = this.props.match.params.slug;
    let projectId = this.props.match.params.projectid;
    let taskId = this.props.match.params.id;
    axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
    axios
      .get(stmConfig.apiBaseUrl + "/api/" + orgSlug + "/projects/" + projectId + "/tasks/" + taskId + "/")
      .then(function (response) {
        switch (response.data.status) {
          case "open":
            status ={
              value: 'open',
              label: 'Open' 
            }
            break;
          case "closed":
            status ={
              value: 'closed',
              label: 'Closed' 
            }
            break;
          case "disputed":
            status ={
              value: 'disputed',
              label: 'Disputed' 
            }
            break;
        
          default:
            break;
        }
        comp_this.setState({task_details: response.data,
                            project: projectId, 
                            assigned_member: response.data.assigned_json,
                            deadline: comp_this.formatDate(response.data.deadline),
                            selectedOption: status
                          })
      })
      .catch(function (error, response) {
        console.log(error, 'error');
      });
  }

  handleChange = selectedOption => {
    let comp_this = this;
    let param = {
      status: selectedOption.value
    };

    let selected_state = selectedOption;
    axios.defaults.headers.patch["Authorization"] =
      "Bearer " + stmConfig.auth.accessToken;
    axios
      .patch(
        stmConfig.apiBaseUrl +
        "/api/" +
        stmConfig.user.org.slug +
        "/projects/" +
        comp_this.props.location.state.project +
        "/tasks/" +
        comp_this.props.location.state.task_detail.id +
        "/",
        param
      )
      .then(function (response) {
        comp_this.setState({ selectedOption: selected_state });
        console.log("done", comp_this.state.selectedOption);
      })
      .catch(function (error, response) {
        console.log("error in catch");
      });
  };

  handleDeadlineChange = date => {
    let comp_this = this;
    let param = {
      deadline: date.format("Y-M-D H:M:S")
    };
    axios.defaults.headers.patch["Authorization"] =
      "Bearer " + stmConfig.auth.accessToken;
    axios
      .patch(
        stmConfig.apiBaseUrl +
        "/api/" +
        stmConfig.user.org.slug +
        "/projects/" +
        comp_this.props.location.state.project +
        "/tasks/" +
        comp_this.props.location.state.task_detail.id +
        "/",
        param
      )
      .then(function (response) {
        comp_this.setState({ deadline: date });
      })
      .catch(function (error, response) {
        console.log("error in catch");
      });
  };

  handleUserChange = selectedOption => {
    let assigned_to_data = {};
    if (selectedOption) {
      assigned_to_data.id = selectedOption.value;
      assigned_to_data.name = selectedOption.label;
    }
    let comp_this = this;
    let param = {
      assigned_json: {
        uid: assigned_to_data.id,
        name: assigned_to_data.name
      }
    };

    axios.defaults.headers.patch["Authorization"] =
      "Bearer " + stmConfig.auth.accessToken;
    axios
      .patch(
        stmConfig.apiBaseUrl +
        "/api/" +
        stmConfig.user.org.slug +
        "/projects/" +
        comp_this.props.location.state.project +
        "/tasks/" +
        comp_this.props.location.state.task_detail.id +
        "/",
        param
      )
      .then(function (response) {
        comp_this.setState({ assigned_member: assigned_to_data });
        console.log("done assignment", comp_this.state.assigned_member);
      })
      .catch(function (error, response) {
        console.log("error in catch");
      });
  };

  handleUserSearch = searchKey => {
    if (searchKey.trim().length > 1) {
      let option_assigned = [];
      let comp_this = this;
      axios.defaults.headers.get["Authorization"] =
        "Bearer " + this.state.acces_token;
      axios
        .get(
          stmConfig.apiBaseUrl +
          "/api/all-members-for-project/?org_id=" +
          stmConfig.user.org.id +
          "&search_key=" +
          searchKey
        )
        .then(function (response) {
          response.data.map(item => {
            option_assigned.push({
              value: item.uid,
              label: item.name
            });
          });
          comp_this.setState({ assigned_to: option_assigned });
        })
        .catch(function (error, response) {
          console.log("error in catch");
        });
    }
  };
  render() {
    let task_list = this.props.location.state.task_detail;
    const { selectedOption } = this.state;
    
    let assigned_member = this.state.assigned_member;
    console.log(assigned_member, 'assigned_member');

    if (!assigned_member) {
      assigned_member = {
        name: "",
        id: ""
      };
    }
    // console.log("assigned_member", task_list);

    return (
      <div>
        <div className="pd">
          <div className="content-inner">
            <div className="row clearfix">
              <div className="col">
                <h1 className="subheader semibold grey fs-28">Task Details</h1>                
                <hr />
                <div className="task-list-meta">
                  <div className="row clearfix">
                    <div className={'col-12 mb-1'}>
                      <h6 className={'text-capitalize'}>{task_list.title}</h6>
                    </div>
                    <div className="col-3 margin-right">
                      <p className="text-left">
                        <label>Assigned to: </label>{" "}
                        {/* {task_list.created_by_json.name} */}
                      </p>
                      <Select
                        value={assigned_member.name}
                        placeholder={assigned_member.name}
                        onInputChange={this.handleUserSearch}
                        onChange={this.handleUserChange}
                        options={this.state.assigned_to}
                        isClearable
                      />
                    </div>
                    <div className="col-3 margin-right">
                      <p className="text-left">
                        <label>Assigned by: </label>{" "}
                        {task_list.created_by_json.name}
                      </p>
                    </div>
                    <div className="col-3 margin-right">
                      <p className="text-left">
                        <label>Status: </label>
                        {/* {task_list.status} */}
                      </p>
                      <Select
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={options}
                        placeholder={task_list.status}
                      />
                    </div>
                    <div className="col-3">
                      <label>Deadline: </label>
                      <DatePicker className="form-control"
                        selected={this.state.deadline}
                        onChange={this.handleDeadlineChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={60}
                        timeCaption="Time"
                        dateFormat="LLL"
                      />
                    </div>
                  </div>
                </div>
                <hr />

                <p className="text-justify">{task_list.description}</p>

                <hr />
                <h4>Comments</h4>
                <hr />
                <form action="">
                  <div className="form-group">
                    <label className="sr-only" htmlFor="email">
                      Email address:
                    </label>
                    <textarea
                      type="email"
                      className="form-control comment-text"
                    />
                  </div>
                  <input type="text" className="btn btn-primary btn-sm" defaultValue="Submit" />
                </form>                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TaskDetails;
