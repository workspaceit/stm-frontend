import {
    FETCH_ALL_TASKS_COMPLETED,
    FETCH_ALL_TASKS_ATTEMPTED,
    FETCH_ALL_TASKS_ERROR
} from '../actions/tasks';

const initialState = {
    task: [],
    myAllTasks: [],
    loader: false
}
export default function project(state = initialState, action) {
    switch (action.type) {
        case 'task':
            state.task = action.task
            return Object.assign({}, state, {
                task: state.task
            })
        case FETCH_ALL_TASKS_ATTEMPTED:
            return {
                ...state,
                loader: true
            }
        case FETCH_ALL_TASKS_COMPLETED:
            return {
                ...state,
                myAllTasks: action.myAllTasks,
                loader: false
            }
        case FETCH_ALL_TASKS_ERROR:
            return {
                ...state,
                loader: false
            }
        default:
            return Object.assign({}, state)
    }
}