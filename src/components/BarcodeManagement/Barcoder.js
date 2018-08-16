import React, { Component } from 'react';
import Barcode from 'react-barcode';
import axios from 'axios';
import { config, baseUrl } from '../../types';

class Barcoder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            barcode: "",
            display: "false"
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
    }

    createBarcode = () => {
        let entry = {
            "inward_id": this.state.barcode,
            "order_id": "34FSD",
            "FSKCU": "jhgcsii3"
        }
        axios.post(`${baseUrl}/savebarcode`, entry, config).then(
            res => {
                console.log("RESPONSE", res);
                if (res.data.code === 200) {
                    console.log("SUCCESS");
                    this.setState({ barcode: "", display: false });
                } else {
                    alert("Already added to database");
                }
            }
        ).catch(err => {
            alert(err.message);
        })
    }

    render() {
        return (
            <div className="container">
                <h1>BARCODE</h1>
                <br /><br />

                {/* <label htmlFor="inwardID">BARCODE ID: </label>
                <input id="inwardID" onChange={this.handleChange}/> */}

                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">BARCODE ID: </span>
                    </div>
                    <input type="text" name="barcode" value={this.state.barcode} class="form-control" placeholder="Scan your Barcode" aria-label="Username" onChange={this.handleChange} aria-describedby="basic-addon1" />
                </div>
                <br />

                {this.state.barcode !== "" ? <Barcode value={this.state.barcode} format="CODE39" /> : null}
                <br />

                <button onClick={this.createBarcode} className="btn btn-primary">Add Barcode</button>

            </div>
        )
    }
}

export default Barcoder;