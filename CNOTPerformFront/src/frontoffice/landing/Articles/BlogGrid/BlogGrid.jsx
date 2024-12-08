import React, { useState } from "react";
import { Card, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";

const BlogGrid = ({ currentEvents }) => {
  ///for the grid view
  const groupEventsInPairs = (events) => {
    const pairs = [];
    for (let i = 0; i < events.length; i += 2) {
      pairs.push(events.slice(i, i + 2));
    }
    return pairs;
  };

  // Assuming blogs is an array of blog objects
  const groupedEvents = groupEventsInPairs(currentEvents);

  return (
    <React.Fragment>
      {groupedEvents?.map((eventPair, index) => (
        <Row key={index}>
          {eventPair?.map((event) => (
            <Col sm={5} key={event?._id} className="event-container">
              <div className="p-3">
                <h5>
                  <Link to={`/articles/${event?._id}`} className="text-white">
                    {event?.title}
                  </Link>
                </h5>
                <p className="text-muted mb-0">
                  <i className="mdi mdi-calendar me-1"></i>
                  {event?.startDate?.substring(0, 10)}{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <i className="mdi mdi-calendar me-1"></i>
                  {event?.endDate?.substring(0, 10)}
                </p>
              </div>

              <div className="position-relative">
                <Link to={`/articles/${event?._id}`}>
                  <img
                    src={event?.imgUrl}
                    alt=""
                    className="img-thumbnail"
                    style={{
                      maxHeight: "350px",
                      minHeight: "100%",
                      textAlign: "center",
                      margin: "auto",
                    }}
                  />
                </Link>
              </div>

              <div className="p-3">
                <ul className="list-inline">
                  <li className="list-inline-item me-3">
                    <Link to="#" className="text-muted">
                      <i className="bx bx-purchase-tag-alt text-muted me-1 align-middle"></i>{" "}
                      {event?.category}
                    </Link>
                  </li>
                  <li className="list-inline-item me-3">
                    <Link to="#" className="text-muted">
                      <i className="bx bx-user text-muted me-1 align-middle"></i>{" "}
                      {event?.participants?.length} Participants
                    </Link>
                  </li>
                </ul>

                <div>
                  <Link to={`/articles/${event?._id}`} className="text-primary">
                    Voir plus <i className="mdi mdi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ))}
    </React.Fragment>
  );
};
export default BlogGrid;
