import axios from "axios";
import stmConfig from "../stmConfiguration";
import { confirmAlert } from 'react-confirm-alert';
import {successAction, deleteAction, noticeAction} from "./actionToastify";

export const FETCH_ALL_TASKS_ATTEMPTED = 'FETCH_ALL_TASKS_ATTEMPTED';
export const FETCH_ALL_TASKS_COMPLETED = 'FETCH_ALL_TASKS_COMPLETED';
export const FETCH_ALL_TASKS_ERROR = 'FETCH_ALL_TASKS_ERROR';
export const FETCH_DELETE_TASKS_ATTEMPTED = 'FETCH_DELETE_TASKS_ATTEMPTED';
export const FETCH_DELETE_TASKS_COMPLETED = 'FETCH_DELETE_TASKS_COMPLETED';
export const FETCH_DELETE_TASKS_ERROR = 'FETCH_DELETE_TASKS_ERROR';

const getAllTasksDispatcher = (myAllTasks) => ({
    type: FETCH_ALL_TASKS_COMPLETED,
    myAllTasks
});
const getAllTasksAttemptedDispatcher = () => ({ 
    type: FETCH_ALL_TASKS_ATTEMPTED 
});
const getMyAllTasksErrorDispatcher = () => ({ 
    type: FETCH_ALL_TASKS_ERROR 
});
const getDeleteTasksDispatcher = (deleteTask) => ({
    type: FETCH_DELETE_TASKS_COMPLETED,
    deleteTask
})
const getDeleteTasksAttemptedDispatcher = () => ({
    type: FETCH_DELETE_TASKS_ATTEMPTED
})
const getDeleteTasksErrorDispatcher = () => ({
    type: FETCH_DELETE_TASKS_ERROR
})

export function getAllTasksAction(orgSlug) {
    return (dispatch, getState) => {
        const orgSlug = stmConfig.user.org.slug;
        const projectId = stmConfig.user.org.id;
        let comp_this = this;
        axios.defaults.headers.get["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
        axios.get(stmConfig.apiBaseUrl + "/api/task/my_tasks/")
        .then(function (response) {
            const myAllTasks = response.data;
            dispatch(getAllTasksAttemptedDispatcher())
            dispatch(getAllTasksDispatcher(myAllTasks))
        })
        .catch(function (error, response) {
            console.log(error);
            dispatch(getMyAllTasksErrorDispatcher())
        });
    }
}

export function deleteTask(taskId, project, org, name) {
    return (dispatch, getState) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to delete this task named: ' + name,
            buttons: [{
                    label: 'Yes',
                    onClick: () => {
                        let comp_this = this;
                        axios.defaults.headers.delete["Authorization"] = "Bearer " + stmConfig.auth.accessToken;
                        axios
                            .delete(stmConfig.apiBaseUrl + "/api/" + org + "/projects/" + project + "/tasks/" + taskId + "/")
                            .then(function (response) {
                                dispatch(getAllTasksAction(org));
                                let successmessage = "Task has been Deleted";
                                dispatch(deleteAction(successmessage));
                            })
                            .catch(function (error, response) {
                                console.log(error, 'error');
                                let message = "Can't Delete Task"
                                dispatch(deleteAction(message));
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
}