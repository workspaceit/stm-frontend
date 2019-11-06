import React, { Component } from 'react';
import axios from 'axios';
import stmConfig from "../../../stmConfiguration";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { successAction, deleteAction } from "../../../actions/actionToastify";
import { bindActionCreators } from "redux";

class CreateOrganization extends Component {
  state = {
    organization: {
      name: "",
      slug: "",
      email: "",
      description: ""
    },
    error:{
        name: "",
        slug: "",
        email: ""
    },
    acces_token : stmConfig.auth.accessToken
  };

  setOrganizationName = (e) => {
      let organization_data = { ...this.state.organization };
      organization_data.name = e.target.value.trim();
      this.setState({ organization: organization_data });
  }
  setOrganizationSlug = (e) => {
      let organization_data = { ...this.state.organization };
      organization_data.slug = e.target.value.trim();
      this.setState({ organization: organization_data });
  }
  setOrganizationMail = (e) => {
      let organization_data = { ...this.state.organization };
      organization_data.email = e.target.value.trim();
      this.setState({ organization: organization_data });
  }
  setOrganizationDescription = (e) => {
      let organization_data = { ...this.state.organization };
      organization_data.description = e.target.value.trim();
      this.setState({ organization: organization_data });
  }  
  
    resetState = () => {
        let error = {
            name: "",
            slug: "",
            email: "",
            description: ""
        }
        this.setState({ error: error });
    }

    onOrganizationSubmit = (e) => {
        e.preventDefault();
        this.resetState();
        let error_data = { ...this.state.error };
        if (this.state.organization.name.length < 1 || this.state.organization.email.length < 1 || this.state.organization.slug.length < 1) {
            if (this.state.organization.name.length < 1) {
                error_data.name = 'Organization Name is Required';
                this.setState({ error: error_data });
            }
            if (this.state.organization.slug.length < 1) {
                error_data.slug = "Slug is Required";
                this.setState({ error: error_data });
            }
            if (this.state.organization.email.length < 1) {
                error_data.email = "Email Name is Required";
                this.setState({ error: error_data });
            }

            return;
        }
        let params = this.state.organization;
        let comp_this = this;
        const prop = this.props;
        let token = this.state.acces_token;
        axios.defaults.headers.post["Authorization"] = "Bearer " + token;
        axios.post(stmConfig.apiBaseUrl + "/api/organizations/", params)
            .then(function (response) {
                stmConfig.user.org.id = response.data.id;
                stmConfig.user.org.slug = response.data.slug;
                stmConfig.user.org.name = response.data.name;   
                let message = "New Organization Created";
                prop.successAction(message); 
                setTimeout(function () {
                    prop.history.push({
                        pathname: stmConfig.route.detailsOrganization + '/' + response.data.id
                    })
                }.bind(this), 2000)       

            })
            .catch(function (error, response) {

                Object.keys(error.response.data).map(key => {
                    if (key == "slug") {
                        //alert(key + " is already registered or not available");
                        let error = key + " is already registered or not available";
                        prop.deleteAction(error);
                    }
                });

            });
    }
    render() {
        return (
            <div className="content-inner">
                <div className="row">
                    <div className="col">
                        <div className="centered-form">
                            <h1 className="subheader semibold grey fs-28">Create Organization</h1>

                            <hr />

                            <form action="" onSubmit={this.onOrganizationSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name" className="secondary_color">Name:</label>
                                    <input type="text" onChange={this.setOrganizationName} className="form-control theme_input color_secondary" id="o-name" />
                                    <div className="validation-message username-validation">{this.state.error.name}</div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="slug" className="secondary_color">Slug:</label>
                                    <input type="text" onChange={this.setOrganizationSlug} className="form-control theme_input color_secondary" id="o-slug" />
                                    <div className="validation-message slug-validation">{this.state.error.slug}</div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="secondary_color">Email:</label>
                                    <input type="text" onChange={this.setOrganizationMail} className="form-control theme_input color_secondary" id="o-email" />
                                    <div className="validation-message email-validation">{this.state.error.email}</div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description" className="secondary_color">Description:</label>
                                    <textarea onChange={this.setOrganizationDescription} className="form-control theme_input color_secondary" rows="3"></textarea>

                                </div>


                                <input type="submit" name="" className="btn btn-submit btn-sm btn-block" value="save" />
                            </form>


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
)(CreateOrganization);

//export default CreateOrganization;