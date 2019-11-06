import React, { Component } from "react";
import {connect} from 'react-redux'
import Aux from "../Auxalary/Auxalary";
import "./Layout.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

class Layout extends Component {
  state = {
    showSideDrawer: false
  };
  sideDrawerCloseHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  sideDrawerToggleHandler = () => {
    this.setState(prevState => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  render() {
    return (
      <Aux>
        <Toolbar
          isAuth={this.props.isAuthenticated}
         drawToglleClicked={this.sideDrawerToggleHandler} />
        <SideDrawer
        isAuth={this.props.isAuthenticated}
          open={this.state.showSideDrawer}
          closed={this.sideDrawerCloseHandler}
        />
        <main className="Content">{this.props.children}</main>
      </Aux>
    );
  }
}

const mapStateToProps = ({auth}) =>{
  return {
    isAuthenticated: auth.token !== null
  }
}

export default connect(mapStateToProps)(Layout);
