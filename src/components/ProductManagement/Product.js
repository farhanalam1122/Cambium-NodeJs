import React, { Component } from 'react';
import testData from "./test_data";
import { baseUrl } from '../../types';
import axios from 'axios';
import { toast } from 'react-toastify';
import FormData from 'form-data';

export default class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: ''
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] })
  }

  onFormSubmit(e) {
    e.preventDefault() 
    let name = this.state.file.name;
    const formData = new FormData();
    formData.append('file', this.state.file);
    axios.post(`${baseUrl}/api/v1/upload/fs/${name}`, formData.get('file'), {
      headers: {
       'Content-Type': 'image/png'
      }
    })
      .then(res => {
        console.log(res);
        if (res.data.code === 200) {
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

  render() {
    return (
      <div>
        <center>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-default">Product Name</span>
            </div>
            <input type="text" class="form-control" value={testData["product-name"]} aria-label="Default" aria-describedby="inputGroup-sizing-default" disabled />
          </div>
          <br /> <br />
          {testData["documentTypes"].map((doctype) => {
            return (
              <div className="container">
                <div class="input-group input-group-sm mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Document Type</span>
                  </div>
                  <input type="text" class="form-control" value={doctype} aria-label="Small" aria-describedby="inputGroup-sizing-sm" disabled />
                </div>
                <center>
                  <form onSubmit={this.onFormSubmit}>
                    <input type="file" accept="image/*" capture="camera" onChange={this.onChange} />
                    <button type="sumbit" className="btn btn-success">Save</button>
                  </form>
                </center>
                <br /> <br /> <br />
              </div>
            )
          })}
        </center>
      </div>
    )
  }
}