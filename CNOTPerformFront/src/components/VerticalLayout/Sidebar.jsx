import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

import logo from "../../assets/images/CNOT_logo.svg";

const Sidebar = (props) => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
      <div className="navbar-brand-box">
  <Link to="/" className="logo logo-light">
    <div className="avatar-md profile-user-wid mx-auto mt-4">
      <span className="avatar-title rounded-circle bg-light" >
      <img
          src={logo}
          alt=""
          height="35"
          width="35"
          style={{
            display: "block",
            margin: "auto",
          }}
        />
      </span>
    </div>
  </Link>
</div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
