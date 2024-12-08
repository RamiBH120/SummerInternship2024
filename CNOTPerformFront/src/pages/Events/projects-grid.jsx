import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  PaginationItem,
  PaginationLink,
  Row,
} from "reactstrap";
import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";

//Import Cards
import CardProject from "./card-project";

import AddEvent from "./Modals/AddEvent";
import { getEvents } from "../../service/event-service";
import EditEvent from "./Modals/EditEvent";

const ProjectsGrid = (props) => {
  //meta title
  document.title = "Cartes des évènements | CNOT PERFORM";

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [showEvent, setShowEvent] = useState(false);
  const handleShowEvent = () => setShowEvent(true);
  const handleCloseEvent = () => setShowEvent(false);

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

  const refreshEvents = async () => {
    try {
      const data = await getEvents();
      setEventList(await data.data.message);
    } catch (error) {
      alert(error.message);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(eventList);
  const [page, setPage] = useState(1);
  const eventsPerPage = 6;

  // Filter events based on search query
  useEffect(() => {
    setFilteredEvents(
      eventList.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, eventList]);

  // Calculate total pages
  const totalPage = Math.ceil(filteredEvents.length / eventsPerPage);

  // Get current events for pagination
  const startIndex = (page - 1) * eventsPerPage;
  const currentEvents = filteredEvents.slice(
    startIndex,
    startIndex + eventsPerPage
  );

  // Handle page click
  const handlePageClick = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPage) {
      setPage(pageNumber);
    }
  };
  const [eventData, setEventData] = useState({});

  const handleShowEdit = (event) => {
    setEventData(event);
    if (Object.keys(eventData).length !== 0) handleShowEvent();
  };
  return (
    <div className="page-content">
      <AddEvent show={show} handleClose={handleClose} refresh={refreshEvents} />
      <EditEvent
        show={showEvent}
        handleClose={() => setShowEvent(false)}
        refresh={refreshEvents}
        eventData={eventData}
      />

      <Container fluid>
        {/* Render Breadcrumbs */}
        <Breadcrumbs
          title="Evénements"
          breadcrumbItem="Cartes des évènements"
        />

        <Row>
          <Col lg="6">
            <form
              className="app-search d-none d-lg-block"
              style={{
                backgroundColor: "#fff",
                borderRadius: "25px",
                padding: "5px",
                boxShadow: "0 0 10px",
              }}
            >
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="bx bx-search-alt" />
              </div>
            </form>
          </Col>
          <Col lg="6">
            <div className="d-grid mb-2" style={{ justifyContent: "end" }}>
              <Button
                color="primary"
                className="font-16 btn-block cta-button"
                onClick={handleShow}
              >
                <i className="mdi mdi-plus-circle-outline w1/4 me-1" />
                Créer un Evènement
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          {/* Import Cards */}
          {currentEvents?.length == 0 && (
            <h3 className=" text-center">Aucun évènement trouvé</h3>
          )}
          <CardProject
            events={currentEvents}
            refresh={refreshEvents}
            handleShowEdit={handleShowEdit}
          />
        </Row>

        <Row>
          <Col lg="12">
            <ul className="pagination pagination-rounded justify-content-center mb-5 mt-2">
              <PaginationItem disabled={page === 1}>
                <PaginationLink
                  previous
                  href="#"
                  onClick={() => handlePageClick(page - 1)}
                />
              </PaginationItem>
              {Array.from({ length: totalPage }, (_, i) => (
                <PaginationItem active={i + 1 === page} key={i}>
                  <PaginationLink
                    onClick={() => handlePageClick(i + 1)}
                    href="#"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem disabled={page === totalPage}>
                <PaginationLink
                  next
                  href="#"
                  onClick={() => handlePageClick(page + 1)}
                />
              </PaginationItem>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withRouter(ProjectsGrid);
