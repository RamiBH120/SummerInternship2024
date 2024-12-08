import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Nav,
  NavbarToggler,
  NavItem,
  NavLink,
  Container,
  Collapse,
  Button,
  Toast,
  ToastHeader,
  ToastBody,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import ScrollspyNav from "./scrollSpy";
import ProfileMenu1 from "../../../components/CommonForBoth/TopbarDropdown/ProfileMenu1";
import logo from "../../../assets/images/CNOT_logo.svg";
import Seclogo from "../../../../public/assets/images/logo/cnotperformicon.png";
import io from 'socket.io-client';
import IADropdownMenu from "../../../components/CommonForBoth/TopbarDropdown/IADropdownMenu ";

//Import Images

const navItems = [
  { id: 1, idnm: "home", navheading: "Accueil" },
  { id: 2, idnm: "about", navheading: "Fonctionnalités" },
 // { id: 3, idnm: "features", navheading: "Services" },
  { id: 4, idnm: "bourses", navheading: "Bourses" },
  { id: 5, idnm: "news", navheading: "Agenda" },
  { id: 5, idnm: "media", navheading: "Médiathèque" },
];

const Navbar_Page = (props) => {
  const url = process.env.REACT_APP_BACKEND_URL;

  const [bourse, setBourse] = useState(null);

  const [isOpenMenu, setisOpenMenu] = useState(false);

  const [isLoggedIn] = useState(!!localStorage.getItem("authUser"));

  const [toast, setToast] = useState(false);
  const [toastRefuse, setToastRefuse] = useState(false);

  const navigate = useNavigate();

  const toggleToast = () => {
    setToast(!toast);
  };
  const toggleToastRefuse = () => {
    setToastRefuse(!toastRefuse);
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('authUser'))?.token;
    if (token) {
      const socket = io(`${url}`, {
        auth: { token },
        transports: ['websocket', 'polling']
      });
    socket.on('bourseAccepted', (bourse) => {
      const userString = localStorage.getItem('authUser');
      if (userString) {
        const user = JSON.parse(userString);
        const userId = user.user._id;
        if(userId === bourse.Federation_Conserne){
          setToast(true);
          setBourse(bourse);
        }
      }
    });

    socket.on('bourseRefused', (bourse) => {
      const userString = localStorage.getItem('authUser');
      if (userString) {
        const user = JSON.parse(userString);
        const userId = user.user._id;
        if(userId === bourse.Federation_Conserne){
          setToastRefuse(true);
          setBourse(bourse);
        }
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('bourseAccepted');
    };
  }}, []);

  //Store all NavigationbaFr Id into TargetID variable(Used for Scrollspy)
  let TargetId = navItems.map((item) => {
    return item.idnm;
  });

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg navigation fixed-top nav-sticky sticky bg-dark">
        <Container>
          <div className="auth-logo-light d-flex align-items-center mt-5">
            <Link to="/" className="auth-logo-light position-relative">
              <div className="avatar-md profile-user-wid mb-2 ">
                <span className="avatar-title rounded-circle bg-light">
                  <img src={logo} alt="" className="" height="35" width="35" />
                </span>
              </div>
            </Link>

            {/* Second Circle, slightly overlapping the first */}
            <Link
              to="/"
              className="auth-logo-light position-relative"
              style={{ marginLeft: "-15px" }}
            >
              {" "}
              {/* Negative margin to create overlap */}
              <div className="avatar-md profile-user-wid mb-2">
                <span className="avatar-title rounded-circle bg-light">
                  <img
                    src={Seclogo}
                    alt="Second logo"
                    className=""
                    height="75"
                    width="75"
                  />
                </span>
              </div>
            </Link>
          </div>

          <NavbarToggler
            className="p-0"
            onClick={() => {
              setisOpenMenu();
            }}
          >
            <i className="fa fa-fw fa-bars" />
          </NavbarToggler>

          <Collapse id="topnav-menu-content" isOpen={isOpenMenu} navbar>
            {props.isSimple ? (
              <ScrollspyNav
                scrollTargetIds={TargetId}
                scrollDuration="800"
                headerBackground="true"
                activeNavClass="active"
                className="navbar-collapse"
              >
                <Nav className="navbar-nav ms-auto" id="topnav-menu">
                  {navItems.map((item, key) => (
                    <NavItem
                      key={key}
                      className={item.navheading === "Home" ? "active" : ""}
                    >
                      <NavLink
                        className="text-2xl text-white"
                        href={"#" + item.idnm}
                      >
                        {" "}
                        {item.navheading}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </ScrollspyNav>
            ) : (
              <Nav className="navbar-nav ms-auto" id="topnav-menu">
                <NavItem>
                  <NavLink className=" text-white" href="/home">
                    {" "}
                    Accueil
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className=" text-white" href="/articles">
                    {" "}
                  Evénements
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className=" text-white" href="/mybourses">
                    {" "}
                    Bourses
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className=" text-white" href="/Médiathèque">
                    {" "}
                   Médiathèque
                  </NavLink>
                </NavItem>
              </Nav>
            )}
            <div className="ms-lg-2">
              <IADropdownMenu />
              {isLoggedIn ? (
                <ProfileMenu1 />
              ) : (
                <Link to="/login">
                  <Button
                    color="primary"
                    className="font-16 btn-block cta-button"
                  >
                    Se connecter
                  </Button>
                </Link>
              )}
            </div>
          </Collapse>
        </Container>
      </nav>
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: "1005" }}>
        <Toast isOpen={toast} className='text-white' style={{ border: '2px solid #28a745', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
          <ToastHeader toggle={toggleToast} className="bg-success text-white">
          <span className="mr-2"><i class='bx bx-check-circle'></i></span>
            Demande de bourse
          </ToastHeader>
          <ToastBody className="text-success font-weight-bold bg-dark" style={{ fontSize: '1.1rem' }}>
            La demande de bourse intitulée "{bourse?.nature}" est acceptée. <a href="" className="text-light" onClick={() => navigate('/mybourses')}> plus de détails</a>
          </ToastBody>
        </Toast>
      </div>
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: "1005" }}>
        <Toast isOpen={toastRefuse} className='text-white' style={{ border: '2px solid #ff0000', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
          <ToastHeader toggle={toggleToastRefuse} className="bg-danger text-white">
          <span className="mr-2"><i class='bx bx-x-circle'></i></span>
            Demande de bourse
          </ToastHeader>
          <ToastBody className="text-danger font-weight-bold bg-dark" style={{ fontSize: '1.1rem' }}>
            La demande de bourse intitulée "{bourse?.nature}" est refusée. <a href="" className="text-light" onClick={() => navigate('/mybourses')}> plus de détails</a>
          </ToastBody>
        </Toast>
      </div>
    </React.Fragment>
  );
};

Navbar_Page.propTypes = {
  isSimple: PropTypes.bool,
};

export default Navbar_Page;
