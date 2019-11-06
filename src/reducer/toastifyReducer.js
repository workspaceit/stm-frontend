import { SUCCESS, DELETE, NOTICE } from '../actions/actionToastify';

const initialState = {
    successValue: 0,
    deleteValue: 0,
    NoticeValue: 0,
};
  
export default function addToaster(state = initialState, action) {
    switch (action.type) {
        case SUCCESS:
            return { 
                ...state, 
                successValue: 1
            };
        case DELETE:
            return { 
                ...state, 
                deleteValue: 1
            };
        case NOTICE:
            return { 
                ...state, 
                NoticeValue: 1
            };
        default:
            return state;
    }
}