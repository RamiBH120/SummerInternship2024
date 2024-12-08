import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Col,
  Form,
  Input,
  Label,
  Row,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

// import images

import Footer from "../Footer/footer";
import {
  cancelParticipation,
  getEvents,
  hasParticipated,
  participate,
} from "../../../service/event-service";
import { getPhotosByEvent } from "../../../service/photo-service";
import Navbar_Page from "../Navbar/Navbar";

import Joinus from "../Contact/Joinus";

const BlogDetails = () => {
  //meta title
  const { id } = useParams();

  const [event, setEvent] = useState([]);

  const [photos, setPhotos] = useState([]);

  const [buttonState, setButtonState] = useState(true);

  useEffect(() => {
    try {
      const fetchEvent = async () => {
        const data = await getEvents(id);
        setEvent(data.data.message);
      };

      const fetchEventPhotos = async () => {
        const data = await getPhotosByEvent(id);
        setPhotos(data.data.message);
      };

      fetchEvent();
      fetchEventPhotos();
    } catch (err) {
      console.log(err);
    }
    return () => {};
  }, []);

  document.title = `Evènement: ${event?.title} | CNOT PERFORM`;

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === photos?.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? photos?.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = photos?.map((photo, index) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={index}
      >
        <img
          src={photo?.fileUrl}
          alt={photo?.fileName}
          style={{
            textAlign: "center",
            maxHeight: "400px",

            minHeight: "400px",
            margin: "auto",
            objectFit: "cover",
          }}
        />
        <CarouselCaption
          className="carousel-dark"
          captionText={photo?.fileName}
          captionHeader={photo?.fileName}
        />
      </CarouselItem>
    );
  });

  const [isLoggedIn] = useState(!!localStorage.getItem("authUser"));

  const loggedUser = JSON.parse(localStorage.getItem("authUser"));

  useEffect(() => {
    const isParticipation = async () => {
      try {
        const response = await hasParticipated(id, loggedUser?.user?._id);
        setButtonState(response.data.hasParticipated);
      } catch (error) {
        console.error("Error fetching participation status:", error);
      }
    };
    isParticipation();
  }, [id, loggedUser?.user?._id]);

  const handleParticipation = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (buttonState) {
      await handleCancelEvent();
    } else {
      await handleAddEvent();
    }
  };

  const handleAddEvent = async () => {
    try {
      const result = await participate(id, loggedUser?.user?._id);
      if (result.status === 200) {
        alert(result.data.message);
        setButtonState(true); // Participation successful
      } else {
        setErrors(result.data.error);
      }
    } catch (error) {
      console.error("Error adding participation:", error);
    }
  };

  const handleCancelEvent = async () => {
    try {
      const result = await cancelParticipation(id, loggedUser?.user?._id);
      if (result.status === 200) {
        alert(result.data.message);
        setButtonState(false); // Participation canceled
      } else {
        setErrors(result.data.error);
      }
    } catch (error) {
      console.error("Error canceling participation:", error);
    }
  };

  const [errors, setErrors] = useState("");

  return (
    <React.Fragment>
      <Navbar_Page isSimple={false} />
      <section className="page-content section hero-section">
        <div className="glow-container">
          <div className="glow-circle left"></div>
          <div className="glow-circle right"></div>
        </div>
        <Container fluid>
          <Breadcrumbs title="Evènement" breadcrumbItem="Evènement Details" />
          <Row>
            <div className="pt-3">
              <div className="justify-content-center row">
                <div className="col-xl-8">
                  <div>
                    <div className="text-center">
                      <div className="mb-4">
                        <Link to="#" className="badge font-size-12 bg-light">
                          <i className="bx bx-purchase-tag-alt text-muted me-1 align-middle"></i>{" "}
                          {event?.category}
                        </Link>
                      </div>
                      <h4>{event?.title}</h4>
                      <p className="text-muted mb-4">
                        <i className="mdi mdi-calendar me-1"></i>
                        {event?.startDate?.substring(0, 10)}{" "}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i className="mdi mdi-calendar me-1"></i>
                        {event?.endDate?.substring(0, 10)}
                      </p>
                    </div>

                    <hr />
                    <div className="text-center">
                      <Row>
                        <Col sm={4}>
                          <div>
                            <p className="text-muted mb-2  text-white">Type</p>
                            <h5 className="font-size-15">{event?.typeEvent}</h5>
                          </div>
                        </Col>
                        <Col sm={4}>
                          <div className="mt-sm-0 mt-4">
                            <p
                              className="text-muted mb-2  text-white"
                              style={{ color: "white" }}
                            >
                              Participants
                            </p>
                            <h5 className="font-size-15">
                              <i className="bx bx-user"></i>{" "}
                              {event?.participants?.length}
                            </h5>
                          </div>
                        </Col>
                        <Col sm={4}>
                          <div className="mt-sm-0 mt-4">
                            <p className="text-muted mb-2  text-white">
                              Publié par
                            </p>
                            <h5 className="font-size-15">CNOT</h5>
                          </div>
                        </Col>
                      </Row>
                      {new Date(event?.endDate) < new Date() && (
                        <p className=" mx-auto" style={{ color: "red" }}>
                          Evènement terminé
                        </p>
                      )}
                    </div>
                    <hr />
                    <div
                      className="my-5"
                      style={{ maxHeight: "500px", minHeight: "480px" }}
                    >
                      <Carousel
                        activeIndex={activeIndex}
                        next={next}
                        previous={previous}
                      >
                        <CarouselIndicators
                          items={photos}
                          activeIndex={activeIndex}
                          onClickHandler={goToIndex}
                        />
                        {slides}
                        <CarouselControl
                          className="carousel-white"
                          direction="prev"
                          directionText="Previous"
                          onClickHandler={previous}
                        />
                        <CarouselControl
                          className="carousel-white"
                          direction="next"
                          directionText="Next"
                          onClickHandler={next}
                        />
                      </Carousel>
                    </div>

                    <hr />

                    <div className="mt-4">
                      <div className="text-muted font-size-14 p-3">
                        {event?.description?.length > 0 && (
                          <p className=" text-white">
                            Description: {event?.description}
                          </p>
                        )}

                        <p className=" position-absolute end-0  text-white">
                          <i className="bx bx-task"></i> Nombre de places:{" "}
                          {event?.seats}
                        </p>
                      </div>

                      <hr />

                      {isLoggedIn ? (
                        <div className="mt-4">
                          <h5 className="font-size-16 mb-3  text-white">
                            Participation
                          </h5>

                          <Form className="login-card">
                            <Row>
                              <Col md={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="commentname-input "
                                    className="text-white"
                                  >
                                    Nom
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    value={loggedUser?.user?.name}
                                    disabled={true}
                                    id="commentname-input"
                                    placeholder="Enter name"
                                  />
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="mb-3">
                                  <Label
                                    htmlFor="commentemail-input"
                                    className="text-white"
                                  >
                                    Email
                                  </Label>
                                  <Input
                                    type="email"
                                    className="form-control"
                                    value={loggedUser?.user?.email}
                                    disabled={true}
                                    id="commentemail-input"
                                    placeholder="Enter email"
                                  />
                                </div>
                              </Col>
                            </Row>

                            <div className="text-end">
                              <button
                                type="submit"
                                className={`cta-button ${
                                  buttonState ? "btn btn-danger" : ""
                                }`}
                                onClick={handleParticipation}
                                disabled={new Date(event?.endDate) < new Date()}
                              >
                                {buttonState
                                  ? "Annuler Participation"
                                  : "Participer"}
                              </button>
                            </div>
                            <h1 style={{ color: "red" }}>{errors}</h1>
                          </Form>
                        </div>
                      ) : (
                        <Joinus />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </section>
      <Footer />
    </React.Fragment>
  );
};

export default BlogDetails;
