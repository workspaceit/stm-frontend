import React, { Component } from 'react';
import { connect } from "react-redux";
import Sidebar from './layout/sidebar';
import ContentHeader from './layout/content-header';
import Main from './main';
import stmConfig from "../../stmConfiguration";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';


class Dashboard extends Component {
    state = {
        text: '',
        sidebarToggle: false
     }
    setUserData = (data) => {
        this.props.setUserData(data)
    }
    sideToggle = (st) => {
        let sidebarToggle = !this.state.sidebarToggle;
        this.setState({ sidebarToggle })
    }

    componentWillMount(){
        const access_token = localStorage.getItem("stm_access_token");
        stmConfig.auth.accessToken = access_token;
        if (access_token === null){
            this.props.history.push(stmConfig.route.login);
        }
        const compThis = this;
        const thisProps = this.props;
        axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios.get(stmConfig.apiBaseUrl + "/api/get-user-info/")
            .then(function (response) {
                stmConfig.user.uid = response.data.uid;
                stmConfig.user.name = response.data.name;
                stmConfig.user.org.id = response.data.org_id;
                stmConfig.user.org.slug = response.data.org_slug;
                stmConfig.user.org.name = response.data.org_name;                                   
                compThis.setUserData(response.data);   
                compThis.setState({text: 'text'});   
            })
            .catch(function (error, response) {
                stmConfig.methods.destroyCredentials();
                thisProps.history.push(stmConfig.route.login);
            });
    }

    componentDidMount(){
        
    }

    render() {
        let windowWidth = window.innerWidth;
        return (
            <React.Fragment>
                <div className={"bg_theme min-100vh transition sideBar "+ ( (this.state.sidebarToggle) || (windowWidth<=767) ? 'closed' : 'open' )} >
                    
                    <Sidebar history={this.props.history} userName={stmConfig.user.name} />
                </div>
                <div className={"body_content min-100vh "+ ( (this.state.sidebarToggle) || (windowWidth<=767) ? 'sidebar-closed' : 'sidebar-open' )}>
                    <span className="sidebar_collaps" onClick={(st) => this.sideToggle(st)}></span>
                    <ContentHeader/>
                    <div className="plr-20 content-detail">
                        <Main/>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 

const mapStateToProps = state => {
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        setUserData(data) {
            const action = { type: "userUpdate", 
                            uid: data.uid, 
                            name: data.name, 
                            orgId: data.org_id, 
                            orgSlug: data.org_slug, 
                            orgName: data.org_name }
            dispatch(action);
        }
    }
}


const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export default MappedComponent;