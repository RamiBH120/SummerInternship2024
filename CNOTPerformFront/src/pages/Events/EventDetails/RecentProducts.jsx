import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { map } from "lodash";
import { getEvents } from "../../../service/event-service";

const RecentProducts = ({ refresh }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    try {
      const fetchEvents = async () => {
        const data = await getEvents();
        setEvents(data.data.message);
      };

      fetchEvents();
    } catch (err) {
      console.log(err.message);
    }
    return () => {};
  }, []);

  // Get current events for pagination
  const startIndex = events?.length > 3 ? events.length - 3 : 0;
  const currentEvents = events?.slice(startIndex, events?.length);

  return (
    <Row className="mt-3">
      <Col lg={12}>
        <div>
          <h5 className="mb-3">Recent events :</h5>
          <Row>
            {map(currentEvents, (evt, key) => (
              <Col xl="4" sm="6" key={"__product__" + key}>
                <Card>
                  <CardBody>
                    <Row className="align-items-center">
                      <Col md="4">
                        <img
                          src={evt?.imgUrl}
                          alt=""
                          className="img-fluid d-block mx-auto h-0.5 w-0.5"
                          style={{ maxHeight: "50px", minHeight: "45px" }}
                        />
                      </Col>
                      <Col md="8">
                        <div className="text-md-start pt-md-0 pt-3 text-center">
                          <h5 className="text-truncate">
                            <Link
                              to={`/events/${evt._id}`}
                              className="text-dark"
                              onClick={refresh}
                            >
                              {evt?.title}
                            </Link>
                          </h5>
                          <h5 className="my-0">
                            <b>{evt?.budget} TND</b>
                          </h5>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Col>
    </Row>
  );
};

RecentProducts.propTypes = {
  recentProducts: PropTypes.array,
};

export default RecentProducts;
