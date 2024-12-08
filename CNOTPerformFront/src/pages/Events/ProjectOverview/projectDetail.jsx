import React from "react";
import PropTypes from "prop-types";
import { map, get } from "lodash";
import { Card, CardBody, Col, Row } from "reactstrap";
import img1 from "../../../assets/images/companies/img-1.png";

const ProjectDetail = ({ event }) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex">
          <img src={img1} alt="" className="avatar-sm me-4" />

          <div className="flex-grow-1 overflow-hidden">
            <h5 className="text-truncate font-size-15">{event?.title}</h5>
            <p className="text-muted">
              Separate existence is a myth. For science, music, sport, etc.
            </p>
          </div>
        </div>

        <h5 className="font-size-15 mt-4">Event Details :</h5>

        <p className="text-muted">{event?.description}</p>

        <Row className="task-dates">
          <Col sm="4" xs="6">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-calendar me-1 text-primary" /> Start Date
              </h5>
              <p className="text-muted mb-0">
                {event?.startDate.substring(0, 10)}
              </p>
            </div>
          </Col>

          <Col sm="4" xs="6">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-calendar-check me-1 text-primary" /> Due
                Date
              </h5>
              <p className="text-muted mb-0">
                {event?.endDate.substring(0, 10)}
              </p>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

ProjectDetail.propTypes = {
  project: PropTypes.object,
};

export default ProjectDetail;
