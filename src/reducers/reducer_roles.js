import { ADD_ROLE_SUCCESS, GET_ALL_ROLES, EDIT_ROLE, ROLE_DELETE } from '../types';

export default function (state = [], action) {
    switch (action.type) {
        case ADD_ROLE_SUCCESS:
            return [...state, action.payload];
        case GET_ALL_ROLES:
            return action.payload;
        case EDIT_ROLE:
            let x = state.slice();
            x[action.payload.index] = action.payload.info;
            return x;
        case ROLE_DELETE:
            let temp = state.slice();
            temp.splice(action.payload, 1);
            return temp;
        default:
            return state;
    }
}

