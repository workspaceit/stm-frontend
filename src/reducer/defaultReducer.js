import { combineReducers } from 'redux'
import sidebar from './sidebar'
import member from './member'
import user from './user'
import organization from './organization'
import project from './project'
import task from './task'
import taskDetails from './taskDetails'
import addToaster from './toastifyReducer'

export default combineReducers({
    sidebar,
    member,
    user,
    organization,
    project,
    task,
    taskDetails, 
    addToaster
})