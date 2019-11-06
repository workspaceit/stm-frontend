import React, { Component } from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import axios from 'axios';
import stmConfig from "../../../stmConfiguration";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

const options = [];

class memberList extends Component {
    state = {
        selectedOption: {
            member_ids: []
        },
        user_remove:{
            remove_users: []
        },
        options: options,
        acces_token: stmConfig.auth.accessToken,
        user_data : [],
        org_id: stmConfig.user.org.id
    }
    
    handleChange = (selectedOption) => {
        let tempState = {...this.state.selectedOption}
        tempState.member_ids = [];
        selectedOption.forEach(element => {
            tempState.member_ids.push(element.value);
        });
        this.setState({selectedOption: tempState})
        console.log(tempState);
    }

    handleSearch = (searchKey) => {

        if (searchKey.trim().length>1) {
            let options = [];
            let comp_this = this;
            axios.defaults.headers.get["Authorization"] = "Bearer " + this.state.acces_token;
            axios.get(stmConfig.apiBaseUrl + "/api/all-members/?org_id="+this.state.org_id+"&search_key=" + searchKey)
                .then(function (response) {
                    response.data.map(item => {
                        options.push({
                            value: item.uid,
                            label: item.name
                        });
                        return true
                    })
                    comp_this.setState({options})
                    // console.log(response.data);
                })
                .catch(function (error, response) {
                    console.log('error in catch');

                });
        }
    }

    componentDidMount(){
        let org_id = stmConfig.user.org.id
        if (org_id && org_id !== '') {
            this.GetData();
        }        
    }
    memberToStore = (member) =>{
        this.props.memberToStore(member)
    }
    GetData = () =>{
        let org_id = stmConfig.user.org.id;
        let params = org_id;
        
        const comp_this = this;
        axios.defaults.headers.get["Authorization"] = "Bearer " + this.state.acces_token;
        axios.get(stmConfig.apiBaseUrl + "/api/organizations-members/?org_id=" + params)
            .then(function (response) {
                comp_this.setState({ user_data: response.data });
                comp_this.props.update();
                comp_this.memberToStore(response.data);
                
            })
            .catch(function (error, response) {
                console.log('error in catch');

            });
    }
    resetstate=() =>{
        let user_remove = {
            remove_users: []
        }
        this.setState({ user_remove});
    }
    deleteMember = (user) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete '+user.name,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        let org_id = this.state.org_id;
                        const comp_this = this;
                        this.state.user_remove.remove_users.push(user.uid);
                        let params = this.state.user_remove;
                        
                        axios.defaults.headers.patch["Authorization"] = "Bearer " + this.state.acces_token;
                        axios.patch(stmConfig.apiBaseUrl + "/api/organizations/" + org_id + "/", params)
                            .then(function (response) {
                                comp_this.resetstate();
                                comp_this.GetData();
                            })
                            .catch(function (error, response) {
                                console.log('error in remove');

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
    addMember = () => {
        let org_id = stmConfig.user.org.id;
        let param = this.state.selectedOption;
        console.log('add', param);
        const comp_this = this;
        axios.defaults.headers.patch["Authorization"] = "Bearer " + this.state.acces_token;
        axios.patch(stmConfig.apiBaseUrl + "/api/organizations/" + org_id + "/", param)
            .then(function (response) {                
                comp_this.GetData();
            })
            .catch(function (error, response) {
                console.log('error in catch');

            });
        
    }
    render() { 
        let member = []
        member = this.props.member.members;
        return ( 
            <div>
                <div className="pd">
                    <div className="content-inner">
                        <div className="row">
                            <div className="col">
                                <div className="centered-form">
                                    <h1 className="subheader semibold grey fs-28">Member List</h1>

                                    <hr />
                                    <div className="row clearfix">
                                        <div className="col-9">
                                            <Select onInputChange={this.handleSearch}
                                                onChange={this.handleChange}
                                                options={this.state.options}
                                                isMulti
                                            />
                                        </div>
                                        <div className="col-3">
                                            <button className="add-member-btn btn btn-primary btn-sm" onClick={this.addMember}>Add</button>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th className={'text-right'}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {member.map(user => {
                                                    return(
                                                        <tr key={user.uid }>
                                                            <td>{user.name}</td>
                                                            <td className={'text-right'}><button className="dbtn_primary" onClick={()=>this.deleteMember(user)}><i className="fas fa-times"></i></button></td>
                                                        </tr>
                                                        );
                                                })}
                                            </tbody>
                                        </table>
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
        update() {
            const action = { type: "update"}
            dispatch(action);
        },
        memberToStore(member){
            const action = { type: "member", member: member}
            dispatch(action);
        }
    }
}


const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(memberList);
export default MappedComponent;