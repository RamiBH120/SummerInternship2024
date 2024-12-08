import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";

import { getEvents } from "../../../service/event-service";
import BlogCard from "./BlogCard";

const Blog = () => {
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    try {
      let isMounted = true;
      const fetchEvents = async () => {
        const data = await getEvents();
        if (isMounted) setEventList(await data.data.message);
      };

      fetchEvents();

      return () => {
        isMounted = false;
      };
    } catch (error) {
      alert(error.message);
    }
  }, []);

  // Get current events for pagination
  const startIndex = eventList?.length > 6 ? eventList.length - 6 : 0;
  const currentEvents = eventList?.slice(startIndex, eventList?.length);

  return (
    <React.Fragment>
      <section className="section hero-section" id="news">
        <div className="glow-container">
          <div className="glow-circle left"></div>
          <div className="glow-circle right"></div>
        </div>
        <Container>
          <Row>
            <Col lg="12">
              <div className="mb-5 text-left text-white">
                <div className="small-title text-white"></div>
                <h3>Evénements </h3>
              </div>
            </Col>
          </Row>

          <Row className=" row-span-3">
            {currentEvents.reverse().map((evt, key) => (
              <BlogCard evt={evt} key={key} />
            ))}

            <div className="ms-lg-2 mt-2 text-center">
              <Link to="/articles">
                <Button
                  color="primary"
                  className="font-16 btn-block cta-button"
                >
                  Afficher plus d'évènements
                </Button>
              </Link>
            </div>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Blog;
