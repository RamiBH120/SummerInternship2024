import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";

const IADropdownMenu = () => {
  const [menu, setMenu] = useState(false);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          style={{ marginRight: "10px" }}
          id="page-header-ia-dropdown"
          tag="button"
        >
            <Button
                  color="primary"
                  className="font-16 btn-block cta-button"
                >
                  IA
            </Button>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag={Link} to="/tableaudebord">
            <i className="bx bx-chart font-size-16 me-1 align-middle" />
            Tableau de bord
          </DropdownItem>
          <DropdownItem tag={Link} to="/prediction">
            <i className="bx bx-bot font-size-16 me-1 align-middle" />
            Prédicton
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

IADropdownMenu.propTypes = {
  t: PropTypes.any,
};

export default IADropdownMenu;
