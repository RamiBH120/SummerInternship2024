import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

import classnames from "classnames";

import { getEvents } from "../../../../service/event-service";
import BlogGrid from "../BlogGrid/BlogGrid";
import BlogStack from "./BlogStack";

const BlogList = () => {
  const [activeTab, toggleTab] = useState("1");

  const [eventList, setEventList] = useState([]);

  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    try {
      let isMounted = true;
      const fetchEvents = async () => {
        const data = await getEvents();
        if (isMounted) setEventList(await data.data.message.reverse());
      };

      fetchEvents();

      return () => {
        isMounted = false;
      };
    } catch (error) {
      alert(error.message);
    }
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6; // Number of events per page

  // Calculate the indices of the first and last events on the current page
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

  // Slice the events list to get only the events for the current page
  const currentEvents = eventList.slice(indexOfFirstEvent, indexOfLastEvent);

  // Calculate total pages
  const totalPages = Math.ceil(eventList.length / eventsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="section hero-section">
      <Col xl={12} lg={12}>
        <ul
          className="nav nav-tabs nav-tabs-custom justify-content-center pt-2"
          role="tablist"
        >
          <NavItem>
            <NavLink
              to="#"
              className={classnames({
                active: activeTab === "1",
              })}
              onClick={() => {
                toggleTab("1");
              }}
            >
              Toutes les publications
            </NavLink>
          </NavItem>
        </ul>

        <TabContent className="p-4" activeTab={activeTab}>
          <TabPane tabId="1">
            <div>
              <Row className="justify-content-center">
                <Col xl={8}>
                  <div>
                    <Row className="align-items-center">
                      <Col xs={4}>
                        <div>
                          <h5 className="mb-0">Evénementssss</h5>
                        </div>
                      </Col>

                      <Col xs={8}>
                        <div className="float-end">
                          <ul className="nav nav-pills">
                            <NavItem>
                              <NavLink
                                className="disabled"
                                to="#"
                                tabIndex="-1"
                              >
                                Affichage :
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <Button
                                className={`nav-link ${
                                  !showGrid ? "active" : ""
                                }`}
                                onClick={() => setShowGrid(false)}
                              >
                                <i className="mdi mdi-format-list-bulleted"></i>
                              </Button>
                            </NavItem>
                            <NavItem>
                              <Button
                                className={`nav-link ${
                                  showGrid ? "active" : ""
                                }`}
                                onClick={() => setShowGrid(true)}
                              >
                                <i className="mdi mdi-view-grid-outline"></i>
                              </Button>
                            </NavItem>
                          </ul>
                        </div>
                      </Col>
                    </Row>

                    <hr className="mb-4" />
                    {currentEvents?.length == 0 && (
                      <h3 className=" text-center">Aucun évènement trouvé</h3>
                    )}

                    {!showGrid ? (
                      <BlogStack currentEvents={currentEvents} />
                    ) : (
                      <BlogGrid currentEvents={currentEvents} />
                    )}

                    <div className="text-center">
                      <ul className="pagination justify-content-center pagination-rounded">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <Link
                            to="#"
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            <i className="mdi mdi-chevron-left"></i>
                          </Link>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                          >
                            <Link
                              to="#"
                              className="page-link"
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </Link>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                          }`}
                        >
                          <Link
                            to="#"
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            <i className="mdi mdi-chevron-right"></i>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </TabPane>

          <TabPane tabId="2">
            <div>
              <Row className="justify-content-center">
                <Col xl={8}>
                  <h5>Archive</h5>

                  <div className="mt-5">
                    <div className="d-flex flex-wrap">
                      <div className="me-2">
                        <h4>2020</h4>
                      </div>
                      <div className="ms-auto">
                        <span className="badge badge-soft-success rounded-pill font-size-12 float-end ms-1">
                          03
                        </span>
                      </div>
                    </div>
                    <hr className="mt-2" />

                    <div className="list-group list-group-flush">
                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Beautiful
                        Day with Friends
                      </Link>

                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Drawing a
                        sketch
                      </Link>

                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Project
                        discussion with team
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="d-flex flex-wrap">
                      <div className="me-2">
                        <h4>2019</h4>
                      </div>
                      <div className="ms-auto">
                        <span className="badge badge-soft-success badge-pill font-size-12 float-right ms-1">
                          06
                        </span>
                      </div>
                    </div>
                    <hr className="mt-2" />

                    <div className="list-group list-group-flush">
                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Coffee
                        with Friends
                      </Link>

                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Neque
                        porro quisquam est
                      </Link>

                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Quis
                        autem vel eum iure
                      </Link>

                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Cras mi
                        eu turpis
                      </Link>

                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Drawing a
                        sketch
                      </Link>

                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Project
                        discussion with team
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="d-flex flex-wrap">
                      <div className="me-2">
                        <h4>2018</h4>
                      </div>
                      <div className="ms-auto">
                        <span className="badge badge-soft-success rounded-pill font-size-12 float-end ms-1">
                          03
                        </span>
                      </div>
                    </div>
                    <hr className="mt-2" />

                    <div className="list-group list-group-flush">
                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Beautiful
                        Day with Friends
                      </Link>

                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Drawing a
                        sketch
                      </Link>

                      <Link
                        to="/blog-details"
                        className="list-group-item text-muted"
                      >
                        <i className="mdi mdi-circle-medium me-1"></i> Project
                        discussion with team
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </TabPane>
        </TabContent>
      </Col>
    </section>
  );
};

export default BlogList;
