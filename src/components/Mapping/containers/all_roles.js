import React, { Component } from 'react';

export default class AllRoles extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
       selected:'',
       selData: []
    };
    this.handleClickSingle=this.handleClickSingle.bind(this);
    this.handleClickAll=this.handleClickAll.bind(this);
  }
  
  handleClickOption(i){
    this.setState({selected: i});
  }

  handleClickSingle(){
    this.state.selData.push(this.props.options[this.state.selected]);
    this.setState({selData: this.state.selData});
    this.props.func(this.state.selected,this.state.selData);
  }

  handleClickAll(){
    this.state.selData.push(...this.props.options);
    this.setState({selData: this.state.selData});
    this.props.func(-1,this.state.selData);
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-around">
          <button onClick={this.handleClickAll} type="button" className="btn btn-light">>></button>
          <button onClick={this.handleClickSingle} type="button" className="btn btn-light">></button>
        </div>   
        <div>
        <select multiple="multiple" size="9" id="bootstrap-duallistbox-nonselected-list_roleFunctions" className="form-control" name="roleFunctions_helper1">
        {this.props.options.map((option,i) =>
        <option key={i} onClick={()=>this.handleClickOption(i)} value={i}>{option}</option>
        )}
        </select>
        </div>     
      </div>
    );
  }
}
