import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import ReactTable from "react-table";
import "react-table/react-table.css";

import axios from 'axios';
import { config, baseUrl2, baseUrl } from '../types';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import Modal from '@material-ui/core/Modal';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

// TabContainer.propTypes = {
//     children: PropTypes.node.isRequired,
// };

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            barcode: '',
            display: "false",
            details: [],
            startDate: null,
            endDate: null,
            open: false,
            scan: false,
            scanvalue: '',
            currentRow: null,
            recalled: 6,
            challan: 5,
            content: '',
            value: 0,
            selectedOption: "trackingId",
            productName: ''
        }
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
    }

    handleChangeTabs = (event, value) => {
        this.setState({ value });
    };

    handleSubmit1 = (e) => {
        e.preventDefault();
        let data = {}
        if (this.state.selectedOption === "trackingId") {
            data = {
                "trackingId": this.state.barcode
            }
        }
        else {
            data = {
                "orderIdFnsku": this.state.barcode
            }
        }
        console.log(this.state);
        axios.post(`${baseUrl2}/aws/searchReturns`, data, config)
            .then(res => {
                console.log(data);
                console.log(res);
                if (res.data.code === 200) {
                    this.setState({ details: res.data.data });
                    if (this.state.details.length !== 0)
                        toast.success("Report details fetched");
                    else
                        toast.success("No reports found");
                }
                else {
                    toast.warn(res.data.message);
                }
            })
            .catch(err => {
                toast.error(err.message);
            })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            "startDate": this.state.startDate,
            "endDate": this.state.endDate,
            "productName": this.state.productName
        }
        console.log(this.state);
        axios.post(`${baseUrl2}/aws/searchReturns`, data, config)
            .then(res => {
                console.log(data);
                console.log(res);
                if (res.data.code === 200) {
                    this.setState({ details: res.data.data });
                    if (this.state.details.length !== 0)
                        toast.success("Report details fetched");
                    else
                        toast.success("No reports found");
                }
                else {
                    toast.warn(res.data.message);
                }
            })
            .catch(err => {
                toast.error(err.message);
            })
    }

    handleStatus(row, mode) {
        let data = {
            "orderId": row["order-id"],
            "fnsku": row["fnsku"],
            "status": mode
        }
        axios.post(`${baseUrl2}/aws/updateReturnsStatus`, data, config)
            .then(res => {
                console.log(data);
                console.log(res);
                if (res.data.code === 200) {
                    let info = this.state.details.slice();
                    info.forEach((object) => {
                        if (object.id === row.id) {
                            object.status = mode
                        }
                    })
                    this.setState({ details: info });
                    toast.success(res.data.message);
                }
                else {
                    toast.warn(res.data.message);
                }
            })
            .catch(err => {
                toast.error(err.message);
            })
    }

    handleScan(row) {
        this.setState({
            scan: true,
            currentRow: row
        });

    }

    handleScanSave = (e) => {
        let data = {
            "returns_data_id": this.state.currentRow.id,
            "barcode": this.state.scanvalue.toLowerCase()
        }
        console.log(data);
        e.preventDefault();
        axios.post(`${baseUrl}/barcode/assignBarcodeToReport`, data, config)
            .then(res => {
                if (res.data.code === 200) {
                    let info = this.state.details.slice();
                    info.forEach((object) => {
                        if (object.id === this.state.currentRow.id) {
                            object.barcode_assigned = "true"
                        }
                    })
                    this.setState({
                        scanvalue: '',
                        details: info,
                        currentRow: null
                    })
                    toast.success(res.data.message);
                    this.handleClose();
                }
                else {
                    toast.warn(res.data.message);
                }
            })
            .catch(err => {
                toast.error(err.message);
            })
    }

    handleComments = (content) => {
        this.setState({
            content: content,
            open: true
        });
    }

    handleClose = () => {
        this.setState({
            open: false,
            content: '',
            scan: false,
            reportId: ''
        });
    }

    render() {
        console.log(this.state.details)
        return (
            <div>
                <Modal open={this.state.open} onClose={this.handleClose}>
                    <div className="container mt-5" style={{ height: "fit-content" }}>
                        <div className="card bg-warning card-header" style={{ borderBottom: "1px solid black" }}>
                            <h4>Customer comments</h4>
                        </div>
                        <div className="bg-light card-body">
                            <h6>{this.state.content}</h6>
                        </div>
                    </div>
                </Modal>

                <Modal open={this.state.scan} onClose={this.handleClose}>
                    <div className="container mt-5" style={{ height: "fit-content" }}>
                        <div className="card bg-warning card-header" style={{ borderBottom: "1px solid black" }}>
                            <h4>Scan Barcode</h4>
                        </div>
                        <form onSubmit={this.handleScanSave}>
                            <div className="bg-light card-body">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">BARCODE ID: </span>
                                    </div>
                                    <input type="text" name="scanvalue" value={this.state.scanvalue} className="form-control" placeholder="Scan your Barcode" aria-label="Username" onChange={this.handleChange} aria-describedby="basic-addon1" />
                                </div>

                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </Modal>

                <div className="tabs">
                    <AppBar position="static" color="inherit" style={{ 'box-shadow': '0px 0px' }}>
                        <Tabs value={this.state.value}
                            onChange={this.handleChangeTabs}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="RETURNS" style={{ 'outline-style': 'none' }} />
                            <Tab label="REIMBURSEMENTS" style={{ 'outline-style': 'none' }} />
                            <Tab label="FULLFILLMENTS" style={{ 'outline-style': 'none' }} />
                        </Tabs>
                    </AppBar>
                    {this.state.value === 0 &&
                        <TabContainer>
                            <div className="container">
                                <center>
                                    <Link to="/WorkflowManagement" className="pl-3"><button className="btn btn-info">Received Returns Product</button></Link>
                                </center>
                                <br />
                                <form onSubmit={this.handleSubmit1} >
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-check text-center">
                                                <input className="form-check-input" type="radio" name="selectedOption" id="exampleRadios1" value="trackingId" checked={this.state.selectedOption === 'trackingId'} onChange={this.handleChange} />
                                                <label className="form-check-label" for="exampleRadios1">
                                                    Tracking ID
                                            </label>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-check text-center">
                                                <input className="form-check-input" type="radio" name="selectedOption" id="exampleRadios2" value="orderIdFnsku" checked={this.state.selectedOption === 'orderIdFnsku'} onChange={this.handleChange} />
                                                <label className="form-check-label" for="exampleRadios2">
                                                    Order ID + FNSKU
                                            </label>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">BARCODE ID: </span>
                                        </div>
                                        <input type="text" name="barcode" value={this.state.barcode} className="form-control" placeholder="Scan your Barcode" aria-label="Username" onChange={this.handleChange} aria-describedby="basic-addon1" />
                                    </div>

                                    <center>
                                        <button style={{ 'width': '150px' }} type="submit" className="btn btn-primary">Get Details</button>
                                    </center>
                                </form>
                                <br /><br />

                                {/* <form onSubmit={this.handleSubmit} >
                                    <div className="row text-center">

                                        <div className="col">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">Start Date: </span>
                                                </div>
                                                <input type="date" id="start" name="startDate"
                                                    value={this.state.startDate}
                                                    min="" max=""
                                                    onChange={this.handleChange} required />
                                            </div>
                                        </div>

                                        <div className="col">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">End Date: </span>
                                                </div>
                                                <input type="date" id="end" name="endDate"
                                                    value={this.state.endDate}
                                                    min="" max=""
                                                    onChange={this.handleChange} required />
                                            </div>
                                        </div>

                                        <div className="col">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">Product Name: </span>
                                                </div>
                                                <input type="text" name="productName" value={this.state.productName} className="form-control" placeholder="Product Name" aria-label="Username" onChange={this.handleChange} aria-describedby="basic-addon1" />
                                            </div>
                                        </div>

                                    </div>

                                    <center>
                                        <button style={{ 'width': '150px' }} type="submit" className="btn btn-primary">Search</button>
                                    </center>
                                </form>
                                <br /><br /> */}

                                <form className="text-center">
                                    <label ><h5>Tracking Id:</h5></label>
                                    <div class="form-group row justify-content-center">
                                        <label for="RecalledQuantity" class="col-sm-3 col-form-label">Recalled Quantity: </label>
                                        <input style={{ 'width': '100px', 'color': this.state.recalled === this.state.challan ? 'green' : 'red' }} readonly value={this.state.recalled} class="col-sm-1 form-control" id="RecalledQuantity" />
                                        {/* <input  style={{ 'width': '100px', 'color':'' }} readonly value={this.state.recalled} class="col-sm-1 form-control" id="RecalledQuantity" /> */}
                                    </div>
                                    <div class="form-group row justify-content-center">
                                        <label for="Challan" class="col-sm-3 col-form-label">On Delivery Challan: </label>
                                        {this.state.recalled === this.state.challan ? <input style={{ 'width': '100px', 'color': 'green' }} readonly value={this.state.challan} class="col-sm-1 form-control" id="RecalledQuantity" /> : <input style={{ 'width': '100px', 'color': 'red' }} readonly value={this.state.challan} class="col-sm-1 form-control" id="RecalledQuantity" />}

                                        {/* <input style={{ 'width': '100px' }} readonly value={this.state.challan} class="col-sm-1 form-control" id="Challan" /> */}
                                    </div>
                                </form>
                            </div>

                            <br />

                            <ReactTable
                                data={this.state.details}
                                defaultPageSize={5}
                                filterable
                                noDataText="Returns not found"
                                className="-striped -highlight"
                                columns={
                                    [
                                        {
                                            Header: "Sr. No.",
                                            accessor: "sr. no",
                                            Cell: row => (
                                                <div>
                                                    <span>{row.index + 1}</span>
                                                </div>
                                            ),
                                            width: 50,
                                        },
                                        {
                                            Header: "Product Name",
                                            accessor: "product-name"
                                        },
                                        {
                                            Header: "SKU",
                                            accessor: "sku"
                                        },
                                        {
                                            Header: "Quantity",
                                            accessor: "quantity"
                                        },
                                        // {
                                        //     Header: "Fulfillment Center",
                                        //     accessor: "fulfillment-center-id",
                                        // },
                                        {
                                            Header: "Return Date",
                                            accessor: "return-date",
                                            Cell: row => (
                                                <div>{row.original["return-date"].split('T')[0]}</div>
                                            )
                                        },
                                        {
                                            Header: "Order ID",
                                            accessor: "order-id",
                                        },
                                        {
                                            Header: "ASIN",
                                            accessor: "asin",
                                        },
                                        {
                                            Header: "FNSKU",
                                            accessor: "fnsku",
                                        },
                                        // {
                                        //     Header: "Detailed Disposition",
                                        //     accessor: "detailed-disposition",
                                        // },
                                        // {
                                        //     Header: "License Plate No.",
                                        //     accessor: "license-plate-number",
                                        // },
                                        // {
                                        //     Header: "Reason",
                                        //     accessor: "reason",
                                        // },
                                        {
                                            Header: "Status",
                                            accessor: "status",
                                        },
                                        {
                                            Header: "Action",
                                            filterable: false,
                                            Cell: row => (
                                                <div className="text-center">
                                                    {row.original.status === null ?

                                                        <div>
                                                            <button type="button" onClick={() => { this.handleStatus(row.original, "Received") }} className="btn btn-info mx-1" >Received</button>
                                                            <button type="button" onClick={() => { this.handleStatus(row.original, "Not Received") }} className="btn btn-warning mx-1" >Not Received</button>
                                                        </div>

                                                        :

                                                        <button type="button"
                                                            onClick={() =>  { row.original.status === "Received" ? this.handleStatus(row.original, "Not Received") : this.handleStatus(row.original, "Received")  }}
                                                            className={row.original.status === "Received" ? "btn btn-warning mx-1" : "btn btn-info mx-1"}>
                                                            {row.original.status === "Received" ? "Not Received" : "Received"}
                                                        </button>

                                                    }
                                                </div>
                                            ),
                                            width: 245
                                        },
                                        {
                                            Header: "Status Changed On",
                                            accessor: "statusChangedOn",
                                            Cell: row => (
                                                <div className="text-center">{row.original["statusChangedOn"] ? row.original["statusChangedOn"].split('T')[0] : null}</div>
                                            )
                                        },
                                        {
                                            Header: "Scan Barcode",
                                            accessor: "barcode_assigned",
                                            filterable: false,
                                            Cell: row => (

                                                <Tooltip
                                                    // enterDelay={300}
                                                    id="tooltip-controlled"
                                                    // leaveDelay={300}
                                                    // onClose={this.handleTooltipClose}
                                                    // onOpen={this.handleTooltipOpen}
                                                    // open={this.state.open}
                                                    placement="right"
                                                    title="Delete"
                                                >
                                                    <IconButton aria-label="Delete">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                // <div className="text-center">
                                                //     <Tooltip id="tooltip-icon" placement="left" title="Delete">
                                                //         {/* <button
                                                //         type="button"
                                                //         onClick={() => { this.handleScan(row.original) }}
                                                //         class=" btn btn-secondary mx-1"
                                                //         disabled={row.original.barcode_assigned === "true"}
                                                //     >

                                                //         SCAN

                                                //     </button> */}
                                                //         <IconButton aria-label="Delete">
                                                //             <DeleteIcon />
                                                //         </IconButton>
                                                //     </Tooltip>
                                                // </div>
                                            )
                                        },
                                        {
                                            Header: "Customer Comments",
                                            accessor: "customer-comments",
                                            Cell: row => (
                                                <div>
                                                    <a href="#" onClick={() => { this.handleComments(row.value) }}>{row.value}</a>
                                                </div>
                                            )
                                        },
                                    ]
                                }
                            />
                            <br /><br />
                            <div class="form-group row justify-content-center">
                                <label for="Physical" class="col-sm-3 col-form-label">Physical Quantity Received: </label>
                                <input style={{ 'width': '100px' }} readonly class="col-sm-1 form-control" id="Physical" />
                            </div>
                        </TabContainer>}

                    {this.state.value === 1 && <TabContainer></TabContainer>}
                    {this.state.value === 2 && <TabContainer></TabContainer>}

                </div>

            </div>
        );
    }
}

export default Dashboard;
