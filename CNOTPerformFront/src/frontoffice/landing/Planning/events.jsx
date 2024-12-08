import React, { useEffect, useState } from "react";

import { Container, Row, Col, Card, Spinner } from "reactstrap";
import "@fullcalendar/bootstrap/main.css";

import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import { getEvents } from "../../../service/event-service";
import frLocale from "@fullcalendar/core/locales/fr";

import {
  getCategories as onGetCategories,
  getEvents as onGetEvents,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

const events = () => {
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);

  /*const dispatch = useDispatch();

  const { events, categories } = useSelector((state) => ({
    events: state.calendar.events,
    categories: state.calendar.categories,
  }));

  useEffect(() => {
    dispatch(onGetCategories());
    dispatch(onGetEvents());
  }, [dispatch]);*/

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      setLoading(true); // Set loading to true before starting the fetch
      try {
        const data = await getEvents();
        let events = [];
        if (isMounted && data.data && data.data.message) {
          data.data.message.forEach((event) => {
            let cn = "";
            switch (event.category) {
              case "Entourage":
                cn = "bg-success text-white";
                break;
              case "Universalité des jeux olympiques":
                cn = "bg-primary text-white";
                break;
              case "Développement du Sport":
                cn = "bg-warning text-white";
                break;
              case "Valeurs olympiques":
                cn = "bg-danger text-white";
                break;
              default:
                cn = "bg-dark text-white";
                break;
            }
            let evt = {
              id: event._id,
              title: event.title + " | " + event.category,
              start: new Date(event.startDate).getTime(), // Use getTime() for date comparison
              end: new Date(event.endDate).getTime(), // Use getTime() for date comparison

              className: cn,
            };
            events.push(evt);
          });
          setEventList(events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        if (isMounted) {
          setLoading(false); // Set loading to false only if the component is still mounted
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false when the component unmounts
    };
  }, []);

  if (loading) return <Spinner color="info"></Spinner>;

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
                <div className="small-title text-white">Evénements</div>
                <h4> Planning</h4>
              </div>
            </Col>
          </Row>

          <Row>
            <Card className="bg-black">
              <FullCalendar
                plugins={[BootstrapTheme, dayGridPlugin, interactionPlugin]}
                slotDuration={"00:15:00"}
                handleWindowResize={true}
                themeSystem="bootstrap"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek,dayGridDay",
                }}
                locale={frLocale}
                events={eventList}
                editable={false}
                droppable={false}
                selectable={false}
              />
            </Card>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default events;
