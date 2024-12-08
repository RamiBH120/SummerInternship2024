import React from "react";
import { Link } from "react-router-dom";

import { Card, CardBody, Col } from "reactstrap";

const Activity = (props) => {
  return (
    <React.Fragment>
      <Col xl={4}>
        <Card>
          <CardBody>
            <div className="d-flex align-items-start">
              <div className="me-2">
                <h5 className="card-title mb-4">Dashbord</h5>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link to="#" className="btn btn-primary  btn-sm">
                View More <i className="mdi mdi-arrow-right ms-1"></i>
              </Link>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default Activity;
