const initialState = {
    organization: []
  }
  export default function organization(state = initialState, action) {
    switch (action.type) {
      case 'organization':
        state.organization = action.organization
        return Object.assign({}, state, {
            organization: state.organization
        })
      default:
        return Object.assign({}, state)
    }
  }