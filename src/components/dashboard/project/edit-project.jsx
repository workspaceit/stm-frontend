import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import Select from 'react-select';
import stmConfig from "../../../stmConfiguration";
import { ToastContainer } from "react-toastify";
import { successAction, deleteAction } from "../../../actions/actionToastify";

const options = [];
class EditProejct extends Component {
    state = {
        project: {},
        options: options,
        error: {
            name: ""
        },
        projectEdit: {
            name: '',
            description: '',
            manager: ""       
        },
        selectedOption : null,
        acces_token: stmConfig.auth.accessToken
    };
    componentDidMount() {
        let comp_this = this;
        let orgSlug = this.props.match.params.slug;
        let id = this.props.match.params.id;
        axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios.get(stmConfig.apiBaseUrl + "/api/" + orgSlug + "/projects/" + id + "/")
            .then(function (response) {                
                let project = response.data;
                let selectedOption = {
                    label: response.data.manager_name,
                    value : response.data.manager
                }
                let projectEdit = {
                    name:  response.data.name,
                    description: response.data.description
                }
                comp_this.setState({project, selectedOption, projectEdit})                 
            })
            .catch(function (error, response) {
                console.log('error in catch');

            });
    }
    setProjectName = (e) => {
        let project_data = { ...this.state.projectEdit };
        project_data.name = e.target.value;
        this.setState({ projectEdit: project_data });
    }
    setProjectDescription = (e) => {
        let project_data = { ...this.state.projectEdit };
        project_data.description = e.target.value;
        this.setState({ projectEdit: project_data });
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
    handleChange = (selectedOption) => {
        console.log(selectedOption, 'selectedOption');
        
        let project_data = { ...this.state.projectEdit };
        project_data.manager = '';
        if (selectedOption){
            project_data.manager = selectedOption.value;
        }
        let newSelectedOption = {
            value: selectedOption.value,
            label: selectedOption.label
        }
        this.setState({ projectEdit: project_data, selectedOption: newSelectedOption });
    }
    resetState = () => {
        let error = {
            name: ""
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
        let params = this.state.projectEdit;
        const prop = this.props;
        let token = this.state.acces_token;
        let orgSlug = this.props.match.params.slug;
        let id = this.props.match.params.id;
        axios.defaults.headers.patch["Authorization"] = "Bearer " + token;
        axios.patch(stmConfig.apiBaseUrl + "/api/" + orgSlug+"/projects/" + id + "/", params)
            .then(function (response) {
                // let message = "Project Details Updated";
                // prop.successAction(message);
                setTimeout(function () {
                    prop.history.push({
                        pathname: stmConfig.route.projects
                    });
                }.bind(this), 0)
            })
            .catch(function (error, response) {
                //prop.deleteAction(error);
            });
    }
    render() {
        console.log(this.state);

        return (
            <React.Fragment>
                <div className="pd">
                    <div className="content-inner">
                        <div className="row">
                            <div className="col">
                                <div className="centered-form">
                                    <h1 className="subheader semibold grey fs-28">Edit Project</h1>
                                    <hr />
                                    <form action="" onSubmit={this.onProjectSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name" className="secondary_color">Name:</label>
                                            <input value={this.state.projectEdit.name} type="text" onChange={this.setProjectName} className="form-control theme_input color_secondary" id="o-name" />
                                            <div className="validation-message username-validation">{this.state.error.name}</div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description" className="secondary_color">Description:</label>
                                            <textarea value={this.state.projectEdit.description}  onChange={this.setProjectDescription} className="form-control theme_input color_secondary" rows="3"></textarea>

                                        </div>
                                        <div className="form-group">
                                            <Select onInputChange={this.handleSearch}
                                                value={this.state.selectedOption}
                                                onChange={this.handleChange}
                                                options={this.state.options}
                                                isClearable
                                            />
                                        </div>

                                        <input type="submit" name="" className={'btn btn-primary btn-sm'} value="save" />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    value: state.value
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


const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(EditProejct);
export default MappedComponent;