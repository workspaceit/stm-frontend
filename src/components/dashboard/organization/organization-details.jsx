import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import stmConfig from "../../../stmConfiguration";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Moment from 'moment';

class OrganizationDetails extends Component {
    state = {
        // org_id: this.props.location.state.org_id,
        org_detail: {

        },
        info: {
            name: "",
            slug: "",
            admin: "",
            created_at: "",
            updated_at: "",
            status: "",
        }
    }
    componentDidMount() {
        const org_id = this.props.match.params.id;
        if (org_id && stmConfig.auth.accessToken) {
            let params = org_id;
            const comp_this = this;

            axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
            axios.get(stmConfig.apiBaseUrl + "/api/organizations/" + params + "/")
                .then(function (response) {
                    let info = { ...comp_this.state.info }
                    info.name = response.data.name;
                    info.slug = response.data.slug;
                    info.admin = response.data.admin_json.username;
                    info.status = response.data.status;
                    info.created_at = response.data.created_at;
                    info.updated_at = response.data.updated_at;
                    console.log(response);
                    
                    comp_this.setState({ info });
                })
                .catch(function (error, response) {
                    console.log('error in catch');

                });
        }
    }
    setUserData = (data) => {
        this.props.setUserData(data)
    }
    selectorg = () => {
        let org_id = {
            org_id: this.props.match.params.id
        };
        const comp_this = this;
        let params = org_id;
        axios.defaults.headers.post["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios.post(stmConfig.apiBaseUrl + "/api/switch-organization/", params)
            .then(function (response) {
                // stmConfig.user.uid = response.data.uid;
                // stmConfig.user.name = response.data.name;
                // stmConfig.user.org.id = response.data.org_id;
                // stmConfig.user.org.slug = response.data.org_slug;
                // stmConfig.user.org.name = response.data.org_name;
                comp_this.setUserData(response.data);
                window.location.href = '/dashboard';

            })
            .catch(function (error, response) {
                console.log('error in catch');

            });
    }
    projectList = () => {
        this.props.history.push({
            pathname: stmConfig.route.projects
        })
    }
    memberList = () => {
        this.props.history.push({
            pathname: stmConfig.route.members
        })
    }
    editOrg = () => {
        this.props.history.push({
            pathname: stmConfig.route.editOrganization + '/' + this.props.match.params.id
        })
    }
    organizationToStore = (organization) => {
        this.props.organizationToStore(organization)
    }
    deleteOrg = () => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this Organization',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        let org_id = {
                            org_id: this.props.match.params.id
                        };
                        const comp_this = this;
                        let params = org_id;
                        axios.defaults.headers.delete["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
                        axios.delete(stmConfig.apiBaseUrl + "/api/" + this.props.match.params.id + "/delete-org/")
                            .then(function (response) {
                                let neworg = comp_this.props.organization.organization.filter(function (organizationon) { return organizationon.id != org_id });
                                comp_this.organizationToStore(neworg);
                                window.location.href = '/dashboard/list-organization';
                            })
                            .catch(function (error, response) {
                                let neworg = comp_this.props.organization.organization.filter(function (organizationon) { return organizationon.id != org_id });
                                comp_this.organizationToStore(neworg);
                                window.location.href = '/dashboard/list-organization';

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

        return (
            <div>
                <div className="pd">
                    <div className="content-inner">
                        <div className="row">
                            <div className="col">
                                <div className="centered-form">
                                    <h1 className="subheader semibold grey fs-28">Organization details</h1>
                                    <hr/>
                                    <div className={'row'}>
                                        <div className={'col-3'}>
                                            <p><strong>Name</strong></p>
                                        </div>
                                        <div className={'col-9'}>
                                            {this.state.info.name}
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-3'}>
                                            <p><strong>Slug</strong></p>
                                        </div>
                                        <div className={'col-9'}>
                                            {this.state.info.slug}
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-3'}>
                                            <p><strong>Status</strong></p>
                                        </div>
                                        <div className={'col-9 text-capitalize'}>
                                            {this.state.info.status}
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-3'}>
                                            <p><strong>Created At</strong></p>
                                        </div>
                                        <div className={'col-9'}>
                                            {this.state.info.created_at}
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-3'}>
                                            <p><strong>Admin</strong></p>
                                        </div>
                                        <div className={'col-9'}>
                                            {this.state.info.admin}
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-3'}>
                                            <p><strong>Updated At</strong></p>
                                        </div>
                                        <div className={'col-9'}>
                                            {this.state.info.updated_at}
                                        </div>
                                    </div>   
                                    <div className="col mt-3 p-0"> 
                                        {/* <button onClick={this.selectorg}>Mark as active</button> */}
                                        <button className={'btn btn-primary btn-sm mr-2'} onClick={this.projectList}>All Projects</button>
                                        <button className={'btn btn-primary btn-sm mr-2'} onClick={this.memberList}>All Members</button>
                                        <button className={'btn btn-info btn-sm mr-2'} onClick={this.editOrg}>Edit</button>
                                        {(this.props.match.params.id != stmConfig.user.org.id) &&
                                            <button className={'btn btn-danger btn-sm mr-2'} onClick={this.deleteOrg}>Delete</button>
                                        }
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
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        organizationToStore(organization) {
            const action = { type: "organization", organization: organization }
            dispatch(action);
        },
    }
}

const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(OrganizationDetails);
export default MappedComponent;