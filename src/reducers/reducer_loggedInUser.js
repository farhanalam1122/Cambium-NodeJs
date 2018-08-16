import { USER } from '../types';

export default function (state = "MENU", action) {
    switch (action.type) {
        case USER:
            return action.payload;
        default:
            return state;
    }
}