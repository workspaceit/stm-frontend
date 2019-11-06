const initialState = {
    project: [],
    currentProject: null
}
export default function project(state = initialState, action) {
    switch (action.type) {
        case 'project':
            state.project = action.project
            return Object.assign({}, state, {
                project: state.project
            })
        case 'currentProject':
            state.currentProject = action.currentProject
            return Object.assign({}, state, {
                currentProject: state.currentProject
            })
        default:
            return Object.assign({}, state)
    }
}