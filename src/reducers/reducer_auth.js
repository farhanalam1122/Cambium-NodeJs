import { AUTH } from '../types';

export default function (state = false, action) {
    switch (action.type) {
        case AUTH:
            console.log(`SETTING TO ${action.payload}`);
            return action.payload;
        default:
            return state;
    }
}
