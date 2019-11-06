const initialState = {
  uid: 0,
  name: "",
  org_id: null,
  org_name: null,
  org_slug: null,
  members: []

}
export default function sidebar(state = initialState, action) {
  switch (action.type) {
    case 'update':
      state.uid = state.uid + 1
      return Object.assign({}, state, {
        uid: state.uid
      })
    case 'members':
      state.uid = state.uid + 1
      return Object.assign({}, state, {
        uid: state.uid
      })
    default:
      return Object.assign({}, state)
  }
}