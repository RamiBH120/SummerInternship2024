import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import { useCallback } from "react";

const SidebarContent = (props) => {
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <SimpleBar className="h-100" ref={ref}>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          <li className="menu-title">{props.t("Menu")} </li>
          <li>
            <Link to="/dashboard">
              <i className="bx bx-home-circle"></i>
              <span>{props.t("Dashboard")}</span>
            </Link>
          </li>

          <li className="menu-title">{props.t("Apps")}</li>

            <li>
              <Link to="/federation">
                <i className="bx bxs-user-detail"></i>
                <span>{props.t("Féderations")}</span>
              </Link>
            </li>
            

            <li>
              <Link to="/chatCnot">
                <i className="bx bx-chat"></i>
                <span>{props.t("Chat")}</span>
              </Link>
            </li>
           
          <li>
            <Link to="/calendar">
              <i className="bx bx-calendar"></i>
              <span>{props.t("Calendrier")}</span>
            </Link>
          </li>

          <li>
            <Link to="/events">
              <i className="bx bx-task"></i>
              <span>{props.t("Evénements")}</span>
            </Link>
          </li>

          <li>
            <Link to="/#" className="has-arrow ">
              <i className="bx bx-envelope"></i>
              <span>{props.t("Email")}</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/email-inbox">{props.t("Inbox")}</Link>
              </li>
              <li>
                <Link to="/email-account">{props.t("Compte email")} </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/bourses">
              <i className="bx bx-wallet"></i>
              <span>{props.t("Bourses")}</span>
            </Link>
          </li>

         {/* <li className="menu-title">Pages</li>
          <li>
            <Link to="/#" className="has-arrow">
              <i className="bx bx-user-circle"></i>
              <span>{props.t("Authentication")}</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="#">{props.t("Login")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Login 2")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Register")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Register 2")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Recover Password")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Recover Password 2")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Lock Screen")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Lock Screen 2")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Confirm Mail")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Confirm Mail 2")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Email Verification")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Email Verification 2")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Two Step Verification")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Two Step Verification 2")}</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/#" className="has-arrow ">
              <i className="bx bx-file"></i>
              <span>{props.t("Utility")}</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="#">{props.t("Starter Page")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Maintenance")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Coming Soon")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Timeline")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("FAQs")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Pricing")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Error 404")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Error 500")}</Link>
              </li>
            </ul>
          </li>
*/}
         {/*<li className="menu-title">{props.t("Components")}</li>

          <li>
            <Link to="/#">
              <i className="bx bxs-eraser"></i>
              <span className="badge rounded-pill bg-danger float-end">10</span>
              <span>{props.t("Forms")}</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="#">{props.t("Form Elements")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Form Layouts")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Form Validation")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Form Advanced")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Form Editors")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Form File Upload")} </Link>
              </li>
              <li>
                <Link to="#">{props.t("Form Xeditable")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Form Repeater")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Form Wizard")}</Link>
              </li>
              <li>
                <Link to="#">{props.t("Form Mask")}</Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/#" className="has-arrow ">
              <i className="bx bx-share-alt"></i>
              <span>{props.t("Multi Level")}</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/#">{props.t("Level 1.1")}</Link>
              </li>
              <li>
                <Link to="/#" className="has-arrow">
                  {props.t("Level 1.2")}
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link to="/#">{props.t("Level 2.1")}</Link>
                  </li>
                  <li>
                    <Link to="/#">{props.t("Level 2.2")}</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>*/}
        </ul>
      </div>
    </SimpleBar>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
