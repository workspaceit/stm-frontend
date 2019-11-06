const initialState = {
    uid: null,
    name: '',
    orgId: null,
    orgSlug: null,
    orgName: null,
}
export default function sidebar(state = initialState, action) {
    switch (action.type) {
        case 'userUpdate':
            let uid = action.uid;
            let name = action.name;
            let orgId = action.orgId;
            let orgSlug = action.orgSlug;
            let orgName = action.orgName;
            return Object.assign({}, state, {
                uid : action.uid,
                name : action.name,
                orgId : action.orgId,
                orgSlug : action.orgSlug,
                orgName : action.orgName
            })
        default:
            return Object.assign({}, state)
    }
}