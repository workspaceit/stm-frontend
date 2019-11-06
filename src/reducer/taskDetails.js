import {
    FETCH_TASK_DETAILS_COMPLETED,
    FETCH_TASK_DETAILS_ATTEMPTED,
    FETCH_TASK_DETAILS_ERROR,
    FETCH_TASK_COMMENT_COMPLETED,
    FETCH_TASK_COMMENT_ATTEMPTED,
    FETCH_TASK_COMMENT_ERROR,
    FETCH_TASK_POST_COMMENT_COMPLETED,
    FETCH_TASK_POST_COMMENT_ATTEMPTED,
    FETCH_TASK_POST_COMMENT_ERROR
} from '../actions/actionTaskDetails';

const initialState = {
    taskDetails: {
        project_json: {},
        assignee_json: {},
        assigned_json: {},
        created_by_json: {}
    },
    taskComments: {
        init: 0,
        results: {}
    },
    postComments: {},
    loader: false
}
export default function taskDetails(state = initialState, action) {
    switch (action.type) {
        case FETCH_TASK_DETAILS_ATTEMPTED:
            return {
                ...state,
                loader: true
            }
        case FETCH_TASK_DETAILS_COMPLETED:
            return {
                ...state,
                taskDetails: action.taskDetails,
                loader: false
            }
        case FETCH_TASK_DETAILS_ERROR:
            return {
                ...state,
                loader: false
            }
        case FETCH_TASK_COMMENT_ATTEMPTED:
            return {
                ...state,
                loader: true,
                init: 0
            }
        case FETCH_TASK_COMMENT_COMPLETED:
            return {
                ...state,
                taskComments: action.taskComments,
                loader: false,
                init: 1
            }
        case FETCH_TASK_COMMENT_ERROR:
            return {
                ...state,
                loader: false,
                init: 0
            }
        case FETCH_TASK_POST_COMMENT_ATTEMPTED:
            return {
                ...state,
                loader: true
            }
        case FETCH_TASK_POST_COMMENT_COMPLETED:
            return {
                ...state,
                postComments: action.postComments,
                loader: false
            }
        case FETCH_TASK_POST_COMMENT_ERROR:
            return {
                ...state,
                loader: false
            }
        default:
            return Object.assign({}, state)
    }
}