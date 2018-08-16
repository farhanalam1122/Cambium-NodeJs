import axios from 'axios';
import { toast } from 'react-toastify';

import { GET_ALL_BARCODES, SEARCH_BARCODES, STATUS_BARCODES, CLEAR_BARCODES, CHANGE_STATUS, config, baseUrl } from '../../types';

export function getAllBarcodes(barcodes) {
    console.log("Getting Barcodes");
    let url = `${baseUrl}/barcode/generateBarcode`
    
    return (dispatch) => {
        axios.get(url, config).then(
            res => {
                if (res.data.code === 200) {
                    let data = {
                        "noOfBarcodes": barcodes
                    };
                    return axios.post(`${baseUrl}/barcode/getBarcodes`, data, config)
                } else {
                    toast.warn(res.data.message);
                }
            }
        ).then(
            res => {
                console.log("RESULT", res);
                if (res.data.code === 200) {
                    dispatch({ type: GET_ALL_BARCODES, payload: res.data.data })
                    toast.success("100 Barcodes Successfully Fetched");
                } else {
                    toast.warn(res.data.message);
                }
            }
        ).catch(err => {
            toast.error(err.message);
        })
    }
}

export function statusBarcodes(Details) {
    return (
        dispatch => {
            axios.post(`${baseUrl}/barcode/viewBarcodes`, Details, config)
                .then(res => {
                    console.log(Details);
                    console.log(res);
                    if (res.data.code === 200) {
                        dispatch({ type: STATUS_BARCODES, payload: res.data.data })
                        toast.success("Barcodes Successfully Fetched");
                    } else {
                        toast.warn(res.data.message);
                    }
                })
                .catch(err => {
                    toast.error(err.message);
                })
        });
}

export function searchBarcodes(Details) {
    return (
        dispatch => {
            axios.post(`${baseUrl}/barcode/searchBarcodes`, Details, config)
                .then(res => {
                    console.log(Details);
                    console.log(res);
                    if (res.data.code === 200) {
                        dispatch({ type: SEARCH_BARCODES, payload: res.data.data })
                        toast.success("Barcodes Successfully Fetched");
                    } else {
                        toast.warn(res.data.message);
                    }
                })
                .catch(err => {
                    toast.error(err.message);
                })
        });
}

export function clearBarcodes() {
    return {
        type: CLEAR_BARCODES,
        payload: []
    }
}

export function handleMultipleStatus(ids, mode) {
    let data = {}
    if (mode === "used") {
        data = {
            "used": [],
            "unused": ids
        }
    }
    else {
        data = {
            "used": ids,
            "unused": []
        }
    }
    return (
        dispatch => {
            axios.post(`${baseUrl}/barcode/changeBarcodeStatus`, data, config)
                .then(res => {
                    // console.log(Details);
                    console.log(res);
                    if (res.data.code === 200) {
                        dispatch({ type: CHANGE_STATUS, payload: ids })
                        toast.success("Status Successfully Changed");
                    } else {
                        toast.warn(res.data.message);
                    }
                })
                .catch(err => {
                    toast.error(err.message);
                })
        });
}

export function handleSingleStatus(id, mode) {
    let data = {}
    if (mode === "used") {
        data = {
            "id": id,
            "status": "unused"
        }
    }
    else {
        data = {
            "id": id,
            "status": "used"
        }
    }
    return (
        dispatch => {
            axios.post(`${baseUrl}/barcode/changeStatusOfOneBarcode`, data, config)
                .then(res => {
                    // console.log(Details);
                    console.log(res);
                    if (res.data.code === 200) {
                        let arrayId = [];
                        arrayId.push(id)
                        dispatch({ type: CHANGE_STATUS, payload: arrayId })
                        toast.success("Status Successfully Changed");
                    } else {
                        toast.warn(res.data.message);
                    }
                })
                .catch(err => {
                    toast.error(err.message);
                })
        });
}
