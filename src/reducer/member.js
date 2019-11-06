const initialState = {
    members: []
  }
  export default function sidebar(state = initialState, action) {
    switch (action.type) {
      case 'member':
        state.members = action.member
        return Object.assign({}, state, {
           members: state.members
        })
      default:
        return Object.assign({}, state)
    }
  }