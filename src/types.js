module.exports = {
    baseUrl: 'http://10.128.104.105:3002',
    baseUrl2: 'http://10.128.104.105:3001',
    config: {
        headers: { "connect.sid": document.cookie.split('=')[1] }
    },

    //Authentication
    AUTH: 'AUTH',
    USER: 'USER',

    //UserManagement
    ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',
    GET_ALL_USERS: 'GET_ALL_USERS',
    EDIT_USER: 'EDIT_USER',
    USER_DELETE: 'USER_DELETE',

    //RoleManagement
    ADD_ROLE_SUCCESS: 'ADD_ROLE_SUCCESS',
    GET_ALL_ROLES: 'GET_ALL_ROLES',
    EDIT_ROLE: 'EDIT_ROLE',
    ROLE_DELETE: 'ROLE_DELETE',

    //BarcodeManagement
    GET_ALL_BARCODES: 'GET_ALL_BARCODES',
    STATUS_BARCODES: 'STATUS_BARCODES',
    SEARCH_BARCODES: 'SEARCH_BARCODES',
    CLEAR_BARCODES: 'CLEAR_BARCODES',
    CHANGE_STATUS: 'CHANGE_STATUS'
}