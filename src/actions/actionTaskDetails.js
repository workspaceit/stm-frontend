import axios from "axios";
import stmConfig from "../stmConfiguration";
import {successAction, deleteAction, noticeAction} from "./actionToastify";
import { getAllTasksAction } from "./tasks";

//Task Details
export const FETCH_TASK_DETAILS_ATTEMPTED = 'FETCH_TASK_DETAILS_ATTEMPTED';
export const FETCH_TASK_DETAILS_COMPLETED = 'FETCH_TASK_DETAILS_COMPLETED';
export const FETCH_TASK_DETAILS_ERROR = 'FETCH_TASK_DETAILS_ERROR';
//Task Comments Get
export const FETCH_TASK_COMMENT_ATTEMPTED = 'FETCH_TASK_COMMENT_ATTEMPTED';
export const FETCH_TASK_COMMENT_COMPLETED = 'FETCH_TASK_COMMENT_COMPLETED';
export const FETCH_TASK_COMMENT_ERROR = 'FETCH_TASK_COMMENT_ERROR';
//Task Comments POST
export const FETCH_TASK_POST_COMMENT_ATTEMPTED = 'FETCH_TASK_POST_COMMENT_ATTEMPTED';
export const FETCH_TASK_POST_COMMENT_COMPLETED = 'FETCH_TASK_POST_COMMENT_COMPLETED';
export const FETCH_TASK_POST_COMMENT_ERROR = 'FETCH_TASK_POST_COMMENT_ERROR';

//Task Details
const getTaskDetailsDispatcher = (taskDetails) => ({
    type: FETCH_TASK_DETAILS_COMPLETED,
    taskDetails
})
const getTaskDetailsAttemptedDispatcher = () => ({
    type: FETCH_TASK_DETAILS_ATTEMPTED
})
const getTaskDetailsErrorDispatcher = () => ({
    type: FETCH_TASK_DETAILS_ERROR
})

//Task Comments
const getTaskCommentsDispatcher = (taskComments) => ({
    type: FETCH_TASK_COMMENT_COMPLETED,
    taskComments
})
const getTaskCommentsAttemptedDispatcher = () => ({
    type: FETCH_TASK_COMMENT_ATTEMPTED
})
const getTaskCommentsErrorDispatcher = () => ({
    type: FETCH_TASK_COMMENT_ERROR
})

//Task Post Comments
const getTaskPostCommentsDispatcher = (postComments) => ({
    type: FETCH_TASK_POST_COMMENT_COMPLETED,
    postComments
})
const getTaskPostCommentsAttemptedDispatcher = () => ({
    type: FETCH_TASK_POST_COMMENT_ATTEMPTED
})
const getTaskPostCommentsErrorDispatcher = () => ({
    type: FETCH_TASK_POST_COMMENT_ERROR
})

//Function For get Task Details
export function getTaskDetailsAction(taskId, projId, orgSlug) {
    return (dispatch, getState) => {
        dispatch(getTaskDetailsAttemptedDispatcher())
        axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios.get(stmConfig.apiBaseUrl + "/api/" + orgSlug + "/projects/" + projId + "/tasks/" + taskId + "/")
        .then(function (response) {
            const taskDetails = response.data;
            dispatch(getTaskDetailsDispatcher(taskDetails))
            //Get Comment Data
            dispatch(getTaskCommentsAttemptedDispatcher())
            axios.get(stmConfig.apiBaseUrl + "/api/d3/tasks/" + taskId + "/comments/")
            .then(function (response) {
                const taskComments = response.data;
                dispatch(getTaskCommentsDispatcher(taskComments))
            })
            .catch(function (error, response) {
                console.log(error);
                dispatch(getTaskCommentsErrorDispatcher())
            });
        })
        .catch(function (error, response) {
            console.log(error);
            dispatch(getTaskDetailsErrorDispatcher())
        });
    }
}

export function getTaskComments(taskId) {
    return (dispatch, getState) => {
        axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        dispatch(getTaskCommentsAttemptedDispatcher())
        axios.get(stmConfig.apiBaseUrl + "/api/d3/tasks/" + taskId + "/comments/")
        .then(function (response) {
            const taskComments = response.data;
            dispatch(getTaskCommentsDispatcher(taskComments))
        })
        .catch(function (error, response) {
            console.log(error);
            dispatch(getTaskCommentsErrorDispatcher())
        });
    }
}

export function postCommentAction(taskId, comment) {
    return (dispatch, getState) => {
        dispatch(getTaskPostCommentsAttemptedDispatcher())
        axios.defaults.headers.post["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios.post(stmConfig.apiBaseUrl + "/api/d3/tasks/" + taskId + "/comments/", {
            comment_description: comment
        })
        .then(function (response) {
            const postComments = response.data;
            dispatch(getTaskPostCommentsDispatcher(postComments));
            let successmessage = "New Comment Added";
            dispatch(successAction(successmessage));
            let taskId = getState().taskDetails.taskDetails.id;
            dispatch(getTaskComments(taskId));
        })
        .catch(function (error, response) {
            console.log(error);
            let message = "Can't Post a Comment. Please try again later."
            dispatch(deleteAction(message));
            dispatch(getTaskPostCommentsErrorDispatcher())
        });
    }
}

export function taskDetailsChange(taskId, projId, orgSlug, param) {
    return (dispatch, getState) => {
        axios.defaults.headers.patch["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios.patch(stmConfig.apiBaseUrl + "/api/" + orgSlug + "/projects/" + projId + "/tasks/" + taskId + "/", param)
        .then(function (response) {
            console.log("Param: ", param);
            let message = '';
            
            if (param.assigned_json) {
                message = "Task Assignee has Changed to " + param.assigned_json.name;
            }
            else if (param.status) {
                message = "Task Status has Changed to " + param.status;
            }
            else if (param.deadline) {
                message = "Task Deadline has Changed to " + param.deadline;
            }
            else {
                message = "Task has been updated";
            }
            console.log("Switch: ", message);
            dispatch(getTaskDetailsAction(taskId, projId, orgSlug));
            dispatch(successAction(message));
            dispatch(getAllTasksAction(orgSlug));            
        })
        .catch(function (error, response) {
            let message = "Can't Update this task. Please try again later."
            dispatch(deleteAction(message));
            dispatch(getTaskPostCommentsErrorDispatcher())
        });
    }
}