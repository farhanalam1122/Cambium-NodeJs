import { GET_ALL_BARCODES, SEARCH_BARCODES, STATUS_BARCODES, CLEAR_BARCODES, CHANGE_STATUS } from '../types';

export default function (state = [], action) {
    switch (action.type) {
        case GET_ALL_BARCODES:
            console.log('Getting all barcodes');
            return action.payload;
        case SEARCH_BARCODES:
            console.log('Getting all barcodes');
            return action.payload;
        case STATUS_BARCODES:
            console.log('Getting all barcodes');
            return action.payload;
        case CLEAR_BARCODES:
            return action.payload;
        case CHANGE_STATUS:
            var data = state.slice();
            action.payload.forEach(id => {
                data.forEach((object, index) => {
                    if (object._id === id) {
                        data.splice(index, 1);
                    }
                })
            })
            return data;
        default:
            return state;
    }
}
