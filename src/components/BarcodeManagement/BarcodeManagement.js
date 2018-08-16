import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllBarcodes, searchBarcodes, statusBarcodes, clearBarcodes, handleMultipleStatus, handleSingleStatus } from './actions';
import Barcode from 'react-barcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-toastify';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import ReactTable from "react-table";
import "react-table/react-table.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";

const CheckboxTable = checkboxHOC(ReactTable);

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

class BarcodeManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,

            //value0:
            barcodes: '',

            //value1:
            status: true,
            entity_type: "",
            entity_id: '',
            noOfBarcodes: '',
            id: '',

            //value2:
            status2: "used",
            barcodes2: '',
            selection: [],
            selectAll: false,
            mode: ''
        }
    }

    handleChangeTabs = (event, value) => {
        this.setState({ value });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
    }

    onGetBarcodes = (e) => {
        e.preventDefault();
        this.props.getAllBarcodes(this.state.barcodes);
        this.setState({ barcodes: '' })
        console.log(this.props.all_barcodes);
    }

    handleChangeStatus = (e) => {
        this.setState({ status: e.target.value === "true" ? true : false });
    }

    handleSearchSubmit = (e) => {
        e.preventDefault();
        let searchData = {
            status: this.state.status,
            entity_type: this.state.entity_type,
            entity_id: this.state.entity_id,
            noOfBarcodes: this.state.noOfBarcodes,
            id: this.state.id
        }
        this.props.searchBarcodes(searchData);
        this.setState({
            status: true,
            entity_type: "",
            entity_id: '',
            noOfBarcodes: '',
            id: ''
        })
        console.log(this.state.entity_id);
    }

    handleStatusSubmit = (e) => {
        e.preventDefault();
        let statusData = {
            "status": this.state.status2,
            "noOfBarcodes": this.state.barcodes2
        }
        let mode = this.state.status2;
        this.props.statusBarcodes(statusData);
        this.setState({
            status2: "used",
            barcodes2: '',
            mode: mode
        })
    }

    clearBarcodes = () => {
        this.props.clearBarcodes();
    }

    display = () => {
        return this.props.all_barcodes.map(
            (barcode, i) => {
                return (
                    <div className="col-lg-6">
                        <Barcode value={barcode.value}
                            format="CODE39" width={1.3}
                            height={50}
                        />
                    </div>
                )
            }
        )
    }

    downloadDocument = () => {
        this.props.handleDrawerClose();
        const form = document.getElementById('divToPrint');
        html2canvas(form)
            .then((canvas) => {
                const pdf = new jsPDF("portrait", "pt", "a4");
                for (var i = 0; i < form.clientHeight / 842; i++) {  //1 mm = 2.83465 pts 297*2.83465=842
                    //! This is all just html2canvas stuff
                    var srcImg = canvas;
                    var sX = 0;
                    var sY = 970 * i // start 970 pixels down for every new page
                    var sWidth = 700;
                    var sHeight = 970;
                    var dX = 0;
                    var dY = 0;
                    var dWidth = 700;
                    var dHeight = 970;

                    let onePageCanvas = document.createElement("canvas");

                    onePageCanvas.setAttribute('width', 700);
                    onePageCanvas.setAttribute('height', 970);
                    var ctx = onePageCanvas.getContext('2d');
                    // details on this usage of this function:
                    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
                    ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

                    var canvasDataURL = onePageCanvas.toDataURL("image/png");

                    //! If we're on anything other than the first page,
                    // add another page
                    //if(parseInt(form.clientHeight/842) === i ){
                    if (i > 0) {
                        pdf.addPage(595, 842);  //8.5" x 11" in pts (in*72)
                    }
                    //}
                    //! now we declare that we're working on that page
                    pdf.setPage(i + 1);
                    //! now we add content to that page!
                    pdf.addImage(canvasDataURL, 'PNG', 45, 28);
                }
                pdf.save('Barcodes.pdf');
                this.props.handleDrawerOpen();
            })
    }

    toggleSelection = (key, shift, row) => {
        /*
          Implementation of how to manage the selection state is up to the developer.
          This implementation uses an array stored in the component state.
          Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */
        // start off with the existing state
        let selection = [...this.state.selection];
        const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) {
            // it does exist so we will remove it using destructing
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
        } else {
            // it does not exist so add it
            selection.push(key);
        }
        // update the state
        this.setState({ selection });
    };

    toggleAll = () => {
        /*
          'toggleAll' is a tricky concept with any filterable table
          do you just select ALL the records that are in your data?
          OR
          do you only select ALL the records that are in the current filtered data?

          The latter makes more sense because 'selection' is a visual thing for the user.
          This is especially true if you are going to implement a set of external functions
          that act on the selected information (you would not want to DELETE the wrong thing!).

          So, to that end, access to the internals of ReactTable are required to get what is
          currently visible in the table (either on the current page or any other page).

          The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
          ReactTable and then get the internal state and the 'sortedData'.
          That can then be iterrated to get all the currently visible records and set
          the selection state.
        */
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.checkboxTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array
            currentRecords.forEach(item => {
                selection.push(item._original._id);
            });
        }
        this.setState({ selectAll, selection });
    };

    // logSelection = () => {
    //     console.log("selection:", this.state.selection);
    // };

    isSelected = key => {
        /*
          Instead of passing our external selection state we provide an 'isSelected'
          callback and detect the selection state ourselves. This allows any implementation
          for selection (either an array, object keys, or even a Javascript Set object).
        */
        return this.state.selection.includes(key);
    };

    handleMultipleStatus = () => {
        console.log(this.state.selection);
        if (this.state.selection.length === 0)
            toast.warn("Select atleast one barcode");
        else {
            this.props.handleMultipleStatus(this.state.selection, this.state.mode);
            this.setState({ selection: [] });
        }
    }

    handleSingleStatus(id) {
        this.props.handleSingleStatus(id, this.state.mode);
    }

    render() {
        console.log(this.props.all_barcodes);
        const { toggleSelection, toggleAll, isSelected } = this;
        const { selectAll } = this.state;

        const checkboxProps = {
            selectAll,
            isSelected,
            toggleSelection,
            toggleAll,
            selectType: "checkbox",
            getTrProps: (s, r) => {
                // example of a background color change
                if (r) {
                    const selected = this.isSelected(r.original._id);
                    return {
                        style: {
                            backgroundColor: selected ? "lightgreen" : "inherit"
                            // color: selected ? 'white' : 'inherit',
                        }
                    };
                }
                return [];
            }
        };

        return (
            <div>
                <div className="tabs">

                    <AppBar position="static" color="inherit" style={{ 'box-shadow': '0px 0px' }}>
                        <Tabs value={this.state.value}
                            onChange={this.handleChangeTabs}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="GENERATE BARCODES" onClick={this.clearBarcodes} style={{ 'outline-style': 'none' }} />
                            <Tab label="SEARCH BARCODES" onClick={this.clearBarcodes} style={{ 'outline-style': 'none' }} />
                            <Tab label="CHANGE STATUS" onClick={this.clearBarcodes} style={{ 'outline-style': 'none' }} />
                        </Tabs>
                    </AppBar>


                    {this.state.value === 0 &&
                        <TabContainer>
                            <form onSubmit={this.onGetBarcodes}>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroup-sizing-default">No. of barcodes</span>
                                    </div>
                                    <input type="text" name="barcodes" class="form-control" value={this.state.barcodes} onChange={this.handleChange} aria-label="Default" aria-describedby="inputGroup-sizing-default" required />
                                </div>
                                <center>
                                    <button type="sumbit" className="btn btn-primary mx-2">Generate Barcode</button>
                                    {this.props.all_barcodes.length !== 0 &&
                                        <button type="button" className="btn btn-warning mx-2" onClick={this.downloadDocument}>Download Barcode</button>}
                                </center>
                            </form>
                            <br /><br />
                            <div>
                                <div className="container">
                                    <div className="col-lg-8 offset-lg-2" id="divToPrint">
                                        <div className="row">
                                            {this.display()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </TabContainer>}


                    {this.state.value === 1 &&
                        <TabContainer>
                            <div>
                                <form onSubmit={this.handleSearchSubmit}>
                                    <div className="row">
                                        <div className="col-lg-6 my-1">
                                            <label className="mr-sm-2" for="inlineFormCustomSelect">Status</label>
                                            <select className="custom-select mr-sm-2" id="inlineFormCustomSelect" name="status" value={this.state.status} onChange={this.handleChangeStatus}>
                                                <option value="true">Used</option>
                                                <option value="false">Unused</option>
                                            </select>
                                        </div>
                                        <div className="col-lg-6 my-1">
                                            <label className="mr-sm-2" for="inlineFormCustomSelect">Entity Type</label>
                                            <select className="custom-select mr-sm-2" id="inlineFormCustomSelect" name="entity_type" value={this.state.entity_type} onChange={this.handleChange}>
                                                <option value="">All</option>
                                                <option value="first">First</option>
                                                <option value="second">Second</option>
                                                <option value="return">Return</option>
                                                <option value="reimbursement">Reimbursement</option>
                                            </select>
                                        </div>
                                    </div>
                                    <br />

                                    <div className="row">
                                        <div className="col-lg-6 my-1">
                                            <label className="mr-sm-2" for="inlineFormCustomSelect">Entity ID</label>
                                            <input type="text" className="form-control" placeholder="Entity ID" name="entity_id" value={this.state.entity_id} onChange={this.handleChange} />
                                        </div>
                                        <div className="col-lg-6 my-1">
                                            <label className="mr-sm-2" for="inlineFormCustomSelect">ID</label>
                                            <input type="text" className="form-control" placeholder="ID" name="id" value={this.state.id} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <br />

                                    <center>
                                        <button type="submit" className="btn btn-info mx-2" >Search</button>
                                        {this.props.all_barcodes.length !== 0 &&
                                            <button type="button" className="btn btn-warning mx-2" onClick={this.downloadDocument}>Download Barcode</button>}
                                    </center>

                                </form>
                                <br /> <br />
                                <div className="container">
                                    <div className="col-lg-8 offset-lg-2" id="divToPrint">
                                        <div className="row">
                                            {this.display()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabContainer>}


                    {this.state.value === 2 &&
                        <TabContainer>
                            <form onSubmit={this.handleStatusSubmit}>
                                <div className="row">
                                    <div className="col-lg-6 my-1">
                                        <label className="mr-sm-2" for="inlineFormCustomSelect">Status</label>
                                        <select className="custom-select mr-sm-2" id="inlineFormCustomSelect" name="status2" value={this.state.status2} onChange={this.handleChange}>
                                            <option value="used">Used</option>
                                            <option value="unused">Unused</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-6 my-1">
                                        <label className="mr-sm-2" for="inlineFormCustomSelect">No. of barcodes</label>
                                        <input type="text" className="form-control" placeholder="Enter the no. of barcodes" name="barcodes2" value={this.state.barcodes2} onChange={this.handleChange} required />
                                    </div>
                                </div>
                                <br />

                                <center>
                                    <button type="submit" className="btn btn-info mx-2" >Search</button>
                                </center>
                            </form>
                            <br />

                            <div>
                                {/* <button onClick={logSelection}>Log Selection</button> */}
                                {this.props.all_barcodes.length !== 0 &&
                                    // <span style={{'text-align':'right'}}>
                                    <button type="button" onClick={this.handleMultipleStatus} className="btn btn-warning mx-2" >Mark selected as {this.state.mode === "used" ? "unused" : "used"}</button>
                                    // </span>
                                }
                                <br /><br />
                                <CheckboxTable
                                    ref={r => (this.checkboxTable = r)}
                                    data={this.props.all_barcodes}
                                    columns={
                                        [
                                            {
                                                Header: "Barcode",
                                                accessor: "value",
                                                Cell: row => (
                                                    <center>
                                                        <div><Barcode value={row.original.value}
                                                            format="CODE39" width={1.3}
                                                            height={50}
                                                        /></div>
                                                    </center>
                                                )
                                            },
                                            {
                                                Header: "Action",
                                                filterable: false,
                                                Cell: row => (
                                                    <div>
                                                        <button type="button" onClick={() => { this.handleSingleStatus(row.original._id) }} className="btn btn-warning mx-2" >Mark as {this.state.mode === "used" ? "unused" : "used"}</button>
                                                    </div>
                                                ),
                                                width: 300
                                            },
                                        ]
                                    }
                                    defaultPageSize={5}
                                    className="-striped -highlight"
                                    filterable
                                    {...checkboxProps}
                                />
                            </div>

                        </TabContainer>}

                </div>
            </div >
        );
    }
}

function mapStateToProps({ all_barcodes }) {
    return { all_barcodes };
}

export default connect(mapStateToProps, { getAllBarcodes, searchBarcodes, statusBarcodes, clearBarcodes, handleMultipleStatus, handleSingleStatus })(BarcodeManagement);
