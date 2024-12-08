import React from "react";
import { Row, Col } from "reactstrap";

import { Link } from "react-router-dom";

const FooterLink = () => {
  return (
    <React.Fragment>
      <Row>
        <Col lg="6">
          <Row className="mb-4">
            <img
              src="/public/assets/images/logo/CNOT_icon.png"
              alt=""
              style={{ width: "200px", height: "200px", borderRadius: "10px" }}
            />
            <img
              src="/public/assets/images/logo/sli.png"
              alt=""
              style={{
                width: "178px",
                height: "200px",
                backgroundColor: "#fff",
                borderRadius: "0px",
              }}
            />
          </Row>

      
        </Col>
        <Col lg="2"></Col>
        <Col lg="4">
          <div className="mb-lg-0 mb-4">
            <h5 className="footer-list-title mb-3">Contact</h5>
            <div className="blog-post">
              <Link to="#" className="post">
                <div className="badge badge-soft-success font-size-11 mb-3">
               
                </div>
                <h1 className="post-title">
                  Centre Culturel et Sportif de la Jeunesse 
                 
                </h1>
                <h1 className="post-title">
                El Menzah 6 -2091 Tunis 
                </h1>
                <h1 className="post-title">
                 Tél : +(216) 71 767 681 
                </h1>
                <h1 className="post-title">
               E-mail :  president.cnot@cnotunisie.tn
                </h1>
              </Link>
           

            </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FooterLink;
