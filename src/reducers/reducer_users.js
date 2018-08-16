import { ADD_USER_SUCCESS, GET_ALL_USERS, EDIT_USER, USER_DELETE } from '../types';

export default function (state = [], action) {
    switch (action.type) {
        case ADD_USER_SUCCESS:
            return [...state, action.payload];
        case GET_ALL_USERS:
            return action.payload;
        case EDIT_USER:
            let x = state.slice();
            x[action.payload.index] = action.payload.info;
            return x;
        case USER_DELETE:
            let temp = state.slice();
            temp.splice(action.payload, 1);
            console.log("TEMP", temp);
            return temp;
        default:
            return state;
    }
}
