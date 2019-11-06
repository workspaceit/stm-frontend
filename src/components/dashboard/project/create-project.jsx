import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import stmConfig from "../../../stmConfiguration";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { successAction, deleteAction } from "../../../actions/actionToastify";
import { bindActionCreators } from "redux";

const options = [];

class CreateProject extends Component {    
    state = {
        project: {
            name: "",
            description: "",
            manager: ""
        },
        options: options,
        error: {
            name: ""
        },
        acces_token: stmConfig.auth.accessToken
    };

    setProjectName = (e) => {
        let project_data = { ...this.state.project };
        project_data.name = e.target.value.trim();
        this.setState({ project: project_data });
    }
    setProjectDescription = (e) => {
        let project_data = { ...this.state.project };
        project_data.description = e.target.value.trim();
        this.setState({ project: project_data });
    }

    resetState = () => {
        let error = {
            name: "",
            description: ""
        }
        this.setState({ error: error });
    }

    onProjectSubmit = (e) => {
        e.preventDefault();
        this.resetState();
        let error_data = { ...this.state.error };
        if (this.state.project.name.length < 1) {
            error_data.name = 'Project Name is Required';
            this.setState({ error: error_data });
        }
        let params = this.state.project;
        const prop = this.props;
        let token = this.state.acces_token;
        axios.defaults.headers.post["Authorization"] = "Bearer " + token;
        axios.post(stmConfig.apiBaseUrl + "/api/" + stmConfig.user.org.slug+"/projects/", params)
            .then(function (response) {
                //console.log(response.data.id, "sss");
                let message = "New Project Created";
                prop.successAction(message);
                setTimeout(function() {
                    prop.history.push({
                        pathname: stmConfig.route.projects,
                        state: {
                            projectId: response.data.id
                        }
                    });
                }.bind(this), 2000)               
            })
            .catch(function (error, response) {
                let message = "Project Can't be Created";
                prop.deleteAction(message);
            });
    }

    handleChange = (selectedOption) => {
        let project_data = { ...this.state.project };
        project_data.manager = '';
        if (selectedOption){
            project_data.manager = selectedOption.value;
        }
        this.setState({ project: project_data });
        //console.log(this.state.project);
    }

    handleSearch = (searchKey) => {

        if (searchKey.trim().length > 1) {
            let options = [];
            let comp_this = this;
            axios.defaults.headers.get["Authorization"] = "Bearer " + this.state.acces_token;
            axios.get(stmConfig.apiBaseUrl + "/api/all-members-for-project/?org_id=" +stmConfig.user.org.id+"&search_key=" + searchKey)
                .then(function (response) {
                    response.data.map(item => {
                        options.push({
                            value: item.uid,
                            label: item.name
                        });
                    })
                    comp_this.setState({ options })
                    // console.log(response.data);
                })
                .catch(function (error, response) {
                    console.log('error in catch');

                });
        }
    }

    render() {
        return (
            <div>
                <div className="pd">
                    <div className="content-inner">
                        <div className="row clearfix">
                            <div className="col">
                                <div className="centered-form">
                                    <h1 className="subheader semibold grey fs-28">Create Project</h1>
                                    <hr />                                
                                    <ToastContainer autoClose={2000} />
                                    <form action="" onSubmit={this.onProjectSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name" className="secondary_color">Name:</label>
                                            <input type="text" onChange={this.setProjectName} className="form-control theme_input color_secondary" id="o-name" />
                                            <div className="validation-message username-validation">{this.state.error.name}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description" className="secondary_color">Description:</label>
                                            <textarea onChange={this.setProjectDescription} className="form-control theme_input color_secondary" rows="3"></textarea>

                                        </
                                        div>
                                        <div className="form-group">
                                            <Select onInputChange={this.handleSearch}
                                                onChange={this.handleChange}
                                                options={this.state.options}
                                                isClearable
                                            />
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

// export default CreateProject;
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
  )(CreateProject);