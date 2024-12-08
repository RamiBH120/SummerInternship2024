import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { getUserProfile } from "../../../service/apiUser"; // Ensure the import path is correct
import withRouter from "../../Common/withRouter";

const ProfileMenu = ({ t }) => {
  const url = process.env.REACT_APP_BACKEND_URL;

  const [menu, setMenu] = useState(false);
  const [user, setUser] = useState({
    username: "Admin",
    profilePicture: "/path/to/default/user1.jpg", // Default image path
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile();
        setUser({
          username: userData.user.name || "Admin",
          profilePicture: userData.user.image
            ? `${url}/${userData.user.image}`
            : "/path/to/default/user1.jpg",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // Auto-logout logic
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (authUser && authUser.token) {
      const token = authUser.token;
      const decodedToken = decodeJWT(token);
      if (decodedToken && decodedToken.exp) {
        const currentTime = Date.now() / 1000; // Current time in seconds
        const tokenExpirationTime = decodedToken.exp; // Expiration time in seconds

        // Calculate the time remaining before the token expires
        const timeRemaining = tokenExpirationTime - currentTime;

        // Set a timeout to auto logout 12 hours before the token expires (43200 seconds = 12 hours)
        if (timeRemaining > 43200) {
          const logoutTime = (timeRemaining - 43200) * 1000; // Convert to milliseconds
          setTimeout(() => {
            logout(); // Auto-logout function
          }, logoutTime);
        } else {
          logout(); // Immediately log out if less than 12 hours remaining
        }
      } else {
        logout(); // Log out if the token can't be decoded or has no expiration time
      }
    }
  }, []);

  // Function to manually decode JWT
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1]; // Get the payload part of the JWT
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null; // Return null on failure
    }
  };

  const logout = () => {
    localStorage.removeItem("authUser"); // Remove the token from localStorage
    localStorage.removeItem("role");
    navigate("/login"); // Redirect to the login page
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user.profilePicture}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block me-1 ms-2">
            {user.username}
          </span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/Chat">
            <i className="bx bx-wallet font-size-16 me-1 align-middle" />
            {t("Messagerie")}
          </DropdownItem>

          <DropdownItem tag="a" href="/Participations">
            <i className="bx bx-task font-size-16 me-1 align-middle" />
            {t("Participation aux Evénements du CNOT ")}
          </DropdownItem>

          <DropdownItem tag="a" href="/demandebourse">
            <i className="bx bx-file font-size-16 me-1 align-middle" />
            {t("Demande de Bourse")}
          </DropdownItem>

          <DropdownItem tag="a" href="/mybourses">
            <i className="bx bx-money font-size-16 me-1 align-middle" />
            {t("Mes Bourses")}
          </DropdownItem>
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item" onClick={logout}>
            <i className="bx bx-power-off font-size-16 text-danger me-1 align-middle" />
            {t("Déconnecter")}
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  t: PropTypes.any,
};

export default withRouter(withTranslation()(ProfileMenu));
