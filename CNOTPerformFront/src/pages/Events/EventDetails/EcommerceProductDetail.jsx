import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import withRouter from "../../../components/Common/withRouter";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  Table,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import { isEmpty } from "lodash";

//Import Product Images
import { productImages } from "/src/assets/images/product";

//Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";

//Import actions
import {
  getProductDetail as onGetProductDetail,
  getProductComments,
  onAddReply as onAddReplyAction,
  onAddComment as onAddCommentAction,
} from "/src/store/actions";
import RecentProducts from "./RecentProducts";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getEvents } from "../../../service/event-service";
import { getPhotosByEvent } from "../../../service/photo-service";
import TeamMembers from "../ProjectOverview/teamMembers";

const EcommerceProductDetail = (props) => {
  //meta title
  document.title = "Détails évènement | CNOT PERFORM";

  const { id } = useParams();

  const [event, setEvent] = useState([]);

  const [photos, setPhotos] = useState([]);

  const dispatch = useDispatch();

  const { product, productComments } = useSelector((state) => ({
    product: state.ecommerce.product,
    productComments: state.ecommerce.productComments,
  }));

  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const fetchInfos = () => {
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
  };

  useEffect(() => {
    try {
      fetchInfos();
    } catch (err) {
      console.log(err.message);
    }
    return () => {};
  }, []);

  const imageShow = (img, id) => {
    const expandImg = document.getElementById("expandedImg" + id);
    expandImg.src = img;
  };

  const refresh = () => fetchInfos();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Evènements" breadcrumbItem="Détails" />
          {!isEmpty(event) && (
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <Row>
                      <Col xl="5">
                        <div className="product-detai-imgs">
                          <Row>
                            <Col md="2" xs="3">
                              <Nav className="flex-column" pills>
                                {photos?.map((photo, index) => (
                                  <NavItem key={index}>
                                    <NavLink
                                      className={classnames({
                                        active: activeTab === index,
                                      })}
                                      onClick={() => {
                                        toggleTab(index);
                                      }}
                                    >
                                      <img
                                        src={photo?.fileUrl}
                                        alt=""
                                        onClick={() => {
                                          imageShow(photo?.fileUrl, index);
                                        }}
                                        className="img-fluid d-block mx-auto rounded"
                                      />
                                    </NavLink>
                                  </NavItem>
                                ))}
                              </Nav>
                            </Col>
                            <Col md={{ size: 7, offset: 1 }} xs="9">
                              <TabContent activeTab={activeTab}>
                                {photos?.map((photo, index) => (
                                  <TabPane tabId={index}>
                                    <div>
                                      <img
                                        src={photo?.fileUrl}
                                        id={"expandedImg" + index}
                                        alt=""
                                        className="img-fluid d-block mx-auto"
                                      />
                                    </div>
                                  </TabPane>
                                ))}
                              </TabContent>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col xl="4">
                        <div className="mt-xl-3 mt-4">
                          <p className="badge font-size-11 m-1 bg-primary">
                            {event?.category}
                          </p>
                          <p className="badge font-size-11 bg-success m-1">
                            {event?.typeEvent}
                          </p>
                          <h4 className="mb-3 mt-1">{event?.title}</h4>

                          <h5 className="mb-4">
                            Budget: <b>{event?.budget} TND</b>
                          </h5>
                          {event?.description !== "" && (
                            <p className="text-muted mb-4">
                              Description: {event?.description}
                            </p>
                          )}

                          <Row className="task-dates">
                            <Col sm="4" xs="6">
                              <div className="mt-4">
                                <h5 className="font-size-14">
                                  <i className="bx bx-calendar me-1 text-primary" />{" "}
                                  Date Début
                                </h5>
                                <p className="text-muted mb-0">
                                  {event?.startDate.substring(0, 10)}
                                </p>
                              </div>
                            </Col>

                            <Col sm="4" xs="6">
                              <div className="mt-4">
                                <h5 className="font-size-14">
                                  <i className="bx bx-calendar-check me-1 text-primary" />{" "}
                                  Date Fin
                                </h5>
                                <p className="text-muted mb-0">
                                  {event?.endDate.substring(0, 10)}
                                </p>
                              </div>
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col md="6">
                              {product.features &&
                                product.features.map((item, i) => (
                                  <div key={i}>
                                    <p className="text-muted">
                                      <i
                                        className={classnames(
                                          item.icon,
                                          "font-size-16 me-2 align-middle text-primary"
                                        )}
                                      />
                                      {item.type && `${item.type}: `}
                                      {item.value}
                                    </p>
                                  </div>
                                ))}
                            </Col>
                            <Col md="6">
                              {product.features &&
                                product.features.map((item, i) => (
                                  <div key={i}>
                                    <p className="text-muted">
                                      <i
                                        className={classnames(
                                          item.icon,
                                          "font-size-16 me-2 align-middle text-primary"
                                        )}
                                      />
                                      {item.type && `${item.type}:`}
                                      {item.value}
                                    </p>
                                  </div>
                                ))}
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col xl="3">
                        <h3 className="">
                          <i className="bx bx-user"></i>
                          Places: {event?.seats}
                        </h3>
                        <h3 className="">
                          <i className="bx bx-user"></i>
                          Participants: {event?.participants?.length}
                        </h3>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          <RecentProducts refresh={refresh} />
        </Container>
      </div>
    </React.Fragment>
  );
};

EcommerceProductDetail.propTypes = {
  product: PropTypes.object,
  match: PropTypes.any,
  onGetProductDetail: PropTypes.func,
};

export default withRouter(EcommerceProductDetail);
