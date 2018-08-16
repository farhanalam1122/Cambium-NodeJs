import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { logout } from '../Authentication/actions';
import { Link } from 'react-router-dom';
import ExpandMore from '@material-ui/icons/ExpandMore';

class SimpleMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div className="col-6" style={{ 'text-align': 'right' , 'float': 'right'}}>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          color='secondary'
          style={{'color': 'white','font-size': 16}}
        >
          {this.props.user}<ExpandMore />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <Link to='/home'><MenuItem>Home</MenuItem></Link>
          <MenuItem onClick={this.handleClose}>My account</MenuItem>
          <Link to='/ChangePassword'><MenuItem>Change Password</MenuItem></Link>
          <MenuItem onClick={this.props.logout}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
}

function mapStateToProps({ user }) {
  return { user };
}

export default connect(mapStateToProps, { logout })(SimpleMenu);