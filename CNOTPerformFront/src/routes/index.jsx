import React from "react";
import { Navigate } from "react-router-dom";
import Authmiddleware from "./route";

// Profile
import UserProfile from "../pages/Authentication/user-profile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import Calendar from "../pages/Calendar/index";
import Federation from "../pages/Federations/contacts-grid";
import Chat from "../pages/Chat/Chat";
import ChatFederation from "../pages/Chat/ChatFederation";
// Front office pages

import Events from "../pages/Events/projects-grid";

const Articles = React.lazy(() =>
  import("../frontoffice/landing/Articles/BlogList/index")
);

const ArticleDetails = React.lazy(() =>
  import("../frontoffice/landing/Articles/BlogDetails")
);

import EventOverview from "../pages/Events/EventDetails/EcommerceProductDetail";

import EventDetails from "../pages/Events/ProjectOverview/projects-overview";

import AddEvent from "../pages/Events/projects-create";

import Unblock from "../pages/Authentication/Unblock";

import Landing from "../frontoffice/landing/index";
import Footer from "../frontoffice/landing/Footer/footer";
import Unauthorized from "./unauthorized";
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";
import EmailBasicTemplte from "../pages/Email/email-basic-templte";
import EmailAlertTemplte from "../pages/Email/email-template-alert";
import EmailTemplateBilling from "../pages/Email/email-template-billing";
import Navbar_Page from "../frontoffice/landing/Navbar/Navbar";
import MyEvents from "../frontoffice/landing/Blog/myEvents";
const restrictedRoutes = ["/profile", "/dashboard", "/calendar", "/federation"];
import MailAccount from "../pages/Email/mailAccount";
import DemandeBourse from "../pages/Bourse/DemandeBourse";
import BourseList from "../pages/Bourse/BourseList";
import BourseListFront from "../pages/Bourse/BourseListFront";
import AthBlessure from "../pages/AI/Athletisme/AthBlessure";
import AthPerformance from "../pages/AI/Athletisme/AthPerformance";
import BoxeBlessure from "../pages/AI/Boxe/BoxeBlessure";
import BoxePerformance from "../pages/AI/Boxe/BoxePerformance";
import NatationBlessure from "../pages/AI/Natation/NatationBlessure";
import NatationPerformance from "../pages/AI/Natation/NatationPerformance";
import TaekwondoBlessure from "../pages/AI/Taekwondo/TaekwondoBlessure";
import TaekwondoPerformance from "../pages/AI/Taekwondo/TaekwondoPerformance";
import ListAi from "../pages/AI/ListAi";
import PowerBi from "../pages/AI/Dashboard";

const authProtectedRoutes = [
  {
    path: "/dashboard",
    component: (
      <Authmiddleware restrictedRoutes={restrictedRoutes}>
        <Dashboard />
      </Authmiddleware>
    ),
  },
  {
    path: "/calendar",
    component: (
      <Authmiddleware restrictedRoutes={restrictedRoutes}>
        <Calendar />
      </Authmiddleware>
    ),
  },
  {
    path: "/federation",
    component: (
      <Authmiddleware restrictedRoutes={restrictedRoutes}>
        <Federation />
      </Authmiddleware>
    ),
  },
  {
    path: "/chatCnot",
    component: (
      <Authmiddleware restrictedRoutes={restrictedRoutes}>
        <Chat />
      </Authmiddleware>
    ),
  },
  {
    path: "/profile",
    component: (
      <Authmiddleware restrictedRoutes={restrictedRoutes}>
        <UserProfile />
      </Authmiddleware>
    ),
  },

  { path: "/events", component: <Events /> },

  { path: "/events/add", component: <AddEvent /> },

  { path: "/events/:id", component: <EventOverview /> },

  { path: "/event_details/:id", component: <EventDetails /> },

  //email
  { path: "/email-inbox", component: <EmailInbox /> },
  { path: "/email-read/:id", component: <EmailRead /> },
  { path: "/email-template-basic", component: <EmailBasicTemplte /> },
  { path: "/email-template-alert", component: <EmailAlertTemplte /> },
  { path: "/email-template-billing", component: <EmailTemplateBilling /> },
  { path: "/email-account", component: <MailAccount /> },
  { path: "/bourses", component: <BourseList /> },
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  {
    path: "/home",
    component: (
      <>
        <Landing />
      </>
    ),
  },
  {
    path: "/Chat",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <ChatFederation />
        <Footer />
      </>
    ),
  },
  {
    path: "/Participations",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <MyEvents />
        <Footer />
      </>
    ),
  },

  { path: "/articles", component: <Articles /> },

  { path: "/articles/:id", component: <ArticleDetails /> },
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  {
    path: "/demandebourse",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <DemandeBourse />
        <Footer />
      </>
    ),
  },
  {
    path: "/mybourses",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <BourseListFront />
        <Footer />
      </>
    ),
  },
  {
    path: "/prediction",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <ListAi />
        <Footer />
      </>
    ),
  },
  {
    path: "/tableaudebord",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <PowerBi />
        <Footer />
      </>
    ),
  },
  {
    path: "/athletismeblessure",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <AthBlessure />
        <Footer />
      </>
    ),
  },
  {
    path: "/athletismeperformance",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <AthPerformance />
        <Footer />
      </>
    ),
  },
  {
    path: "/boxeblessure",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <BoxeBlessure />
        <Footer />
      </>
    ),
  },
  {
    path: "/boxeperformance",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <BoxePerformance />
        <Footer />
      </>
    ),
  },
  {
    path: "/natationblessure",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <NatationBlessure />
        <Footer />
      </>
    ),
  },
  {
    path: "/natationperformance",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <NatationPerformance />
        <Footer />
      </>
    ),
  },
  {
    path: "/taekwondoblessure",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <TaekwondoBlessure />
        <Footer />
      </>
    ),
  },
  {
    path: "/taekwondoperformance",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <TaekwondoPerformance />
        <Footer />
      </>
    ),
  },
  { path: "/unauthorized", component: <Unauthorized /> },

  { path: "/unblock", component: <Unblock /> },
  {
    path: "/Médiathèque",
    component: (
      <>
        <Navbar_Page isSimple={false} />
        <BourseListFront />
        <Footer />
      </>
    ),
  },
];

export { authProtectedRoutes, publicRoutes };
