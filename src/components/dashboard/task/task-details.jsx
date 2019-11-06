import React, { Component } from "react";
import axios from 'axios';
import Select from 'react-select';
import stmConfig from "../../../stmConfiguration";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { connect } from "react-redux";
import { getTaskDetailsAction, getTaskComments, postCommentAction, taskDetailsChange } from '../../../actions/actionTaskDetails';
import { bindActionCreators } from "redux";

class TaskDetails extends Component {
    state = {
        date_options: { year: "numeric", month: "long", day: "numeric", minute: "numeric", hour: "numeric" },
        comment: "",
        commentError: "",
        selectedOption: null,
        task_details: {},
        status: [
            { value: 'open', label: 'Open' },
            { value: 'closed', label: 'Closed' },
            { value: 'disputed', label: 'Disputed' }
        ],
        project: "",
        assigned_to: [],
        assigned_member: {}
    }

    componentDidMount() {
        let taskId = this.props.match.params.id;
        let projId = this.props.match.params.projectid;
        let orgSlug = this.props.match.params.slug;
        this.props.getTaskDetailsAction(taskId, projId, orgSlug);
        this.props.getTaskComments(taskId, projId, orgSlug);
    }

    formatDate = (date) => {
        return new Date(date).toLocaleString("en-US", this.state.date_options);
    }

    formatDatepicker(date) {
        if (date === null) {
            return date;
        }
        return moment(date);
    }

    setComment = (e) => {
        let comment = { ...this.state.comment };
        comment = e.target.value;
        this.setState({ comment: comment });
    }

    postComment = (pc) => {
        console.log("Comment: ", this.state.comment.length);
        if (this.state.comment.length > 0 ) {
            this.setState({ commentError: "" });
            let comment = this.state.comment.trim();
            let taskId = this.props.match.params.id;
            this.state.comment = ''
            this.props.postCommentAction(taskId, comment);
        }
        else {
            this.setState({ commentError: "Empty Comment Not Allowed" });
        }
    }

    handleAssigneChange = (selectedOption) => {
        let taskId = this.props.match.params.id;
        let projId = this.props.match.params.projectid;
        let orgSlug = this.props.match.params.slug;

        let assigned_to_data = {};
        if (selectedOption) {
            assigned_to_data.id = selectedOption.value;
            assigned_to_data.name = selectedOption.label;
        }
        let param = {
            assigned_json: {
                uid: assigned_to_data.id,
                name: assigned_to_data.name
            }
        };
        this.props.taskDetailsChange(taskId, projId, orgSlug, param);
    }

    handleStatusChange = selectedOption => {
        let taskId = this.props.match.params.id;
        let projId = this.props.match.params.projectid;
        let orgSlug = this.props.match.params.slug;
        let param = {
            status: selectedOption.value
        };

        this.props.taskDetailsChange(taskId, projId, orgSlug, param);
    };    
    
    handleDeadlineChange = date => {
        let taskId = this.props.match.params.id;
        let projId = this.props.match.params.projectid;
        let orgSlug = this.props.match.params.slug;
        let param = {
            deadline: date.format("Y-M-D H:M:S")
        };
        this.props.taskDetailsChange(taskId, projId, orgSlug, param);
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
        let task = this.props.taskDetails.taskDetails.taskDetails;
        let comments = this.props.comments;
        let member = this.props.member;

        // console.log(member, "Member");

        const { selectedOption } = this.state;

        let assigned_member = task.assigned_json;

        if (!assigned_member) {
            assigned_member = {
                name: "",
                id: ""
            };
        }

        return (
            <div>
                <div className="pd">
                    <div className="content-inner">
                        <div className="row clearfix">
                            <div className="col">                                
                                <div className="task-list-meta">
                                    <div className="row clearfix">
                                        <div className={'col-12 mb-1'}>
                                            <h4 className={'text-capitalize'}>{task.title}</h4>
                                        </div>
                                        <div className="col-xs-12 col-md-4 col-xl-3 mb-3 task-details-col">
                                            <p className="text-left">
                                                <label className={'d-block'}>Assigned to: </label>{" "}
                                            </p>                                                                                 
                                            <Select
                                                value={assigned_member.name}
                                                placeholder={assigned_member.name}
                                                onInputChange={this.handleUserSearch}
                                                onChange={this.handleAssigneChange}
                                                options={this.state.assigned_to}
                                                isClearable
                                            />
                                        </div>
                                        <div className="col-xs-12 col-md-4 col-xl-3 mb-3 task-details-col">
                                            <p className="text-left">
                                                <label className={'d-block'}>Status: </label>
                                            </p>
                                            <Select
                                                value={selectedOption}
                                                onChange={this.handleStatusChange}
                                                options={this.state.status}
                                                placeholder={task.status}
                                            />
                                        </div>                                       
                                        <div className="col-xs-12 col-md-4 col-xl-3 mb-3 task-details-col">
                                            <label className={'d-block'}>Deadline: </label>
                                            <DatePicker className="form-control fs-14"
                                                selected={this.formatDatepicker(task.deadline) }
                                                onChange={ this.handleDeadlineChange }
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={60}
                                                timeCaption="Time"
                                                dateFormat="LLL"
                                            />
                                        </div>
                                        <div className="col-xs-12 col-md-12 col-xl-3 mb-3 task-details-col border-left border-md-0">
                                            <p className="text-left">
                                                <span className={'text-muted'}>Assigned by:</span> {task.created_by_json.name}                                     
                                            </p>
                                            <p className="text-left mt-2">                                             
                                                <span className={'text-muted'}>Created At:</span> {this.formatDate(task.created_at)}                                                
                                            </p>
                                            <p className="text-left mt-2">                                             
                                                <span className={'text-muted'}>Last Update:</span> {this.formatDate(task.updated_at)}                                                
                                            </p>
                                        </div> 
                                    </div>
                                </div>
                                <hr />
                                <p className={'text-muted'}>description:</p>
                                <p className="text-justify">{task.description}</p>

                                <hr />                                
                                <form action="">
                                    <div className="form-group">
                                        <label className="" htmlFor="comment">
                                            Post a Comment:
                                        </label>
                                        <textarea
                                            id="comment" 
                                            onChange={this.setComment}
                                            placeholder='Post a Comment'
                                            type="text"
                                            className="form-control comment-text fs-14"
                                            value = {this.state.comment}
                                        />
                                        <span className={'text-danger'}> { this.state.commentError } </span>
                                    </div>
                                    <input onClick={this.postComment} type="button" className="btn btn-primary fs-14" defaultValue="Submit" />
                                    <h5 className={'mt-5'}>Comments</h5>
                                    <hr />
                                    <div className={'row m-0 commentlist'}>
                                        <div className={'col'}>
                                            { 
                                                (comments.init !=0 ) ?
                                                comments.results.map(( comment, i ) => {
                                                    return(
                                                        comment.comment_description ? <Comment key={i} comment={comment} /> : null
                                                    )
                                                }).reverse()
                                                : null
                                            }                                        
                                        </div>                
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Comment extends Component {
    state = {
        date_options: { year: "numeric", month: "long", day: "numeric", minute: "numeric", hour: "numeric" },
        comment: ""
    }
    formatDate = (date) => {
        return new Date(date).toLocaleString("en-US", this.state.date_options);
    }
    render() {
        let comment = this.props.comment;
        return (            
            <div className={'row comment-row'}>
                <div className={'col-6'}>
                    <strong>{ comment.created_by_json.name }</strong>
                </div>
                <div className={'col-6 text-right'}>
                    <span className={'text-muted'}>{ this.formatDate(comment.created_at) }</span>
                </div>
                <div className={'col-12 mt-2'}>
                    <p>{ comment.comment_description }</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        taskDetails: state,
        comments: state.taskDetails.taskComments,
        member: state.member
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
        { 
            getTaskDetailsAction, 
            getTaskComments, 
            postCommentAction, 
            taskDetailsChange
        },
        dispatch
    )
}
const MappedComponent = connect(mapStateToProps, mapDispatchToProps)(TaskDetails);
export default MappedComponent;