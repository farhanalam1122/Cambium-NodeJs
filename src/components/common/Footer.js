import React, { Component } from 'react';

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="footer text-muted" >
                &copy; 2018. Mobilize by <a href="http://pankanis.com" target="_blank">Pankanis</a>
            </div>
        );
    }
}

export default Footer;            