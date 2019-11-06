import React, { Component } from 'react';
import stmConfig from "../../../stmConfiguration";
import axios from 'axios';

class editOrganization extends Component {
    state = {
        organization: {
          name: "",
          email: "",
          description: "asdasd"
        },
        error:{
            name: "",
            slug: "",
            email: ""
        },
        acces_token : stmConfig.auth.accessToken
      };
    componentDidMount(){
        const org_id = this.props.match.params.id;
        if (org_id && stmConfig.auth.accessToken){
            let params = org_id;
            const comp_this = this;
            
            axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
            axios.get(stmConfig.apiBaseUrl + "/api/organizations/" + params + "/")
                .then(function (response) {
                    let organization = { ...comp_this.state.info}
                    
                    organization.name = response.data.name;                                
                    organization.email = '';                                
                    organization.description = '';                                
                    comp_this.setState({ organization});  
                })
                .catch(function (error, response) {
                    console.log('error in catch');
                    
                });
        }
    }
    setOrganizationName = (e) =>{
        let organization_data = { ...this.state.organization };
        organization_data.name = e.target.value.trim();
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
            email: "",
            description: ""
        }
        this.setState({ error: error });
    }
    onOrganizationSubmit = (e) =>{
        e.preventDefault();
        this.resetState();
        let error_data = { ...this.state.error };
        if (this.state.organization.name.length < 1 || this.state.organization.email.length < 1) {
            if (this.state.organization.name.length < 1) {
                error_data.name = 'Organization Name is Required';
                this.setState({ error: error_data });
            }
            if (this.state.organization.email.length < 1) {
                error_data.email = "Email is Required";
                this.setState({ error: error_data });
            }

            return;
        }
        let params = this.state.organization;
        let comp_this = this;
        let token = this.state.acces_token;
        axios.defaults.headers.patch["Authorization"] = "Bearer " + token;
        axios.patch(stmConfig.apiBaseUrl + "/api/organizations/" + this.props.match.params.id + '/', params)
            .then(function (response) {
                stmConfig.user.org.id = response.data.id;
                stmConfig.user.org.slug = response.data.slug;
                stmConfig.user.org.name = response.data.name;
                comp_this.props.history.push({
                    pathname: stmConfig.route.detailsOrganization + '/' +response.data.id,
                    state: {
                        org_id: response.data.id
                    }
                });

            })
            .catch(function (error, response) {

                Object.keys(error.response.data).map(key => {
                    // console.log(key);

                    if (key == "slug") {
                        alert(key + " is already registered or not available");
                    }
                });

            });
    }
    render() {
        console.log(this.state);
        
        return (
            <React.Fragment>
                <div className="content-inner">
                    <h1 className="semibold grey fs-28">Edit Organization</h1>

                    <hr />

                    <form action="" onSubmit={this.onOrganizationSubmit}>
                        <div className="form-group">
                            <label htmlFor="name" className="secondary_color">Name:</label>
                            <input value={this.state.organization.name} type="text" onChange={this.setOrganizationName} className="form-control theme_input color_secondary" id="o-name" />
                            <div className="validation-message username-validation">{this.state.error.name}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="secondary_color">Email:</label>
                            <input type="email"  value={this.state.organization.email} onChange={this.setOrganizationMail} className="form-control theme_input color_secondary" id="o-email" />
                            <div className="validation-message email-validation">{this.state.error.email}</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description" className="secondary_color">Description:</label>
                            <textarea onChange={this.setOrganizationDescription} className="form-control theme_input color_secondary" rows="3" value={this.state.organization.description}> </textarea>

                        </div>


                        <input type="submit" name="" className="dbtn_primary login_btn" value="save" />
                    </form>


                </div>
            </React.Fragment>
        );
    }
}

export default editOrganization;