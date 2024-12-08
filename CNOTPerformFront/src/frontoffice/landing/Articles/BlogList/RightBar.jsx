import React from "react";
import { Card, CardBody, Col } from "reactstrap";
import { Link } from "react-router-dom";

// import images
import img1 from "../../../../assets/images/small/img-7.jpg";
import img2 from "../../../../assets/images/small/img-4.jpg";
import img3 from "../../../../assets/images/small/img-6.jpg";

const RightBar = () => {
  return (
    <>
      <Col xl={3} lg={4}>
        <Card>
          <CardBody className="p-4">
            <div className="search-box">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control rounded border-light bg-light"
                  placeholder="Search..."
                />
                <i className="mdi mdi-magnify search-icon"></i>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <p className="text-muted">Categories</p>

              <ul className="list-unstyled fw-medium">
                <li>
                  <Link to="#" className="text-muted d-block py-2">
                    <i className="mdi mdi-chevron-right me-1"></i> Entourage
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted d-block py-2">
                    <i className="mdi mdi-chevron-right me-1"></i> Universalité
                    des jeux olympiques{" "}
                    <span className="badge badge-soft-success rounded-pill font-size-12 float-end ms-1">
                      04
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted d-block py-2">
                    <i className="mdi mdi-chevron-right me-1"></i> Développement
                    du Sport
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted d-block py-2">
                    <i className="mdi mdi-chevron-right me-1"></i> Valeurs
                    olympiques
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted d-block py-2">
                    <i className="mdi mdi-chevron-right me-1"></i> Gestion des
                    CNO
                    <span className="badge badge-soft-success rounded-pill font-size-12 float-end ms-1">
                      12
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <hr className="my-4" />

            <div>
              <p className="text-muted">Archive</p>

              <ul className="list-unstyled fw-medium">
                <li>
                  <Link to="#" className="text-muted d-block py-2">
                    <i className="mdi mdi-chevron-right me-1"></i> 2020{" "}
                    <span className="badge badge-soft-success rounded-pill font-size-12 float-end ms-1">
                      03
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted d-block py-2">
                    <i className="mdi mdi-chevron-right me-1"></i> 2019{" "}
                    <span className="badge badge-soft-success rounded-pill font-size-12 float-end ms-1">
                      06
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-muted d-block py-2">
                    <i className="mdi mdi-chevron-right me-1"></i> 2018{" "}
                    <span className="badge badge-soft-success rounded-pill font-size-12 float-end ms-1">
                      05
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <hr className="my-4" />

            <div>
              <p className="text-muted mb-2">Popular Posts</p>

              <div className="list-group list-group-flush">
                <Link to="#" className="list-group-item text-muted px-2 py-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <img
                        src={img1}
                        alt=""
                        className="avatar-md d-block h-auto rounded"
                      />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <h5 className="font-size-13 text-truncate">
                        Beautiful Day with Friends
                      </h5>
                      <p className="text-truncate mb-0">10 Apr, 2020</p>
                    </div>
                  </div>
                </Link>

                <Link to="#" className="list-group-item text-muted px-2 py-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <img
                        src={img2}
                        alt=""
                        className="avatar-md d-block h-auto rounded"
                      />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <h5 className="font-size-13 text-truncate">
                        Drawing a sketch
                      </h5>
                      <p className="text-truncate mb-0">24 Mar, 2020</p>
                    </div>
                  </div>
                </Link>

                <Link to="#" className="list-group-item text-muted px-2 py-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <img
                        src={img3}
                        alt=""
                        className="avatar-md d-block h-auto rounded"
                      />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <h5 className="font-size-13 text-truncate">
                        Project discussion with team
                      </h5>
                      <p className="text-truncate mb-0">11 Mar, 2020</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <p className="text-muted mb-1">Tags</p>

              <ul className="list-inline widget-tag">
                <li className="list-inline-item">
                  <Link to="#" className="badge font-size-12 mt-2 bg-light">
                    Design
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#" className="badge font-size-12 mt-2 bg-light">
                    Development
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#" className="badge font-size-12 mt-2 bg-light">
                    Business
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#" className="badge font-size-12 mt-2 bg-light">
                    Project
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#" className="badge font-size-12 mt-2 bg-light">
                    Travel
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#" className="badge badge-light font-size-12 mt-2">
                    Lifestyle
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link to="#" className="badge badge-light font-size-12 mt-2">
                    Photography
                  </Link>
                </li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default RightBar;
