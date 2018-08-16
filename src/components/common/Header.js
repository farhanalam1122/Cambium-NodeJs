import React, { Component } from 'react';


class Header extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="navbar navbar-inverse">
                <div className="navbar-header">
                <div className="navbar-brand">Brand Name<img src={Image} alt="" /></div>
                    <ul className="nav navbar-nav visible-xs-block">
                        <li><a data-toggle="collapse" data-target="#navbar-mobile"><i className="icon-tree5"></i></a></li>
                        <li><a className="sidebar-mobile-main-toggle"><i className="icon-paragraph-justify3"></i></a></li>
                    </ul>
                </div>

                <div className="navbar-collapse collapse" id="navbar-mobile">
                    <ul className="nav navbar-nav">
                        <li><a className="sidebar-control sidebar-main-toggle hidden-xs"><i className="icon-paragraph-justify3"></i></a></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Header;