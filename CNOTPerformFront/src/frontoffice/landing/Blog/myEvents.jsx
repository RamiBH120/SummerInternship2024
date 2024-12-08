import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";

import { participatedEvents } from "../../../service/event-service";
import BlogCard from "./BlogCard";

const MyEvents = () => {
  const [eventList, setEventList] = useState([]);

  const loggedUser = JSON.parse(localStorage?.getItem("authUser"));

  useEffect(() => {
    try {
      let isMounted = true;
      const fetchEvents = async () => {
        const data = await participatedEvents(loggedUser?.user?._id);

        if (isMounted) setEventList(await data.data.events);
      };

      fetchEvents();

      return () => {
        isMounted = false;
      };
    } catch (error) {
      alert(error.message);
    }
  }, []);

  return (
    <React.Fragment>
      <section className="section hero-section">
        <div className="glow-container">
          <div className="glow-circle left"></div>
          <div className="glow-circle right"></div>
        </div>
        <Container>
          <Row className="mt-5">
            <Col lg="12">
              <div className="mb-5 text-center text-white">
                <div className="small-title text-white">Evènements</div>
                <h4>Mes participations</h4>
              </div>
            </Col>
          </Row>

          <Row className=" row-span-3">
            {eventList.reverse().map((evt, key) => (
              <BlogCard evt={evt} key={key} />
            ))}

            <div className="ms-lg-2 mt-2 text-center">
              <Link to="/articles">
                <Button
                  color="primary"
                  className="font-16 btn-block cta-button"
                >
                  Afficher d'autres évènements
                </Button>
              </Link>
            </div>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default MyEvents;
