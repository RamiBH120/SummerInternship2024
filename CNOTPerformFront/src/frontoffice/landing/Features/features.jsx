import React from "react";
import { Container, Row, Col } from "reactstrap";

//Import Components
import FeatureBox from "./feature-box";

const Features = () => {
  const features1 = [
    { id: 1, desc: "Donec pede justo vel aliquet" },
    { id: 2, desc: "Aenean et nisl sagittis" },
  ];
  const features2 = [
    { id: 1, desc: "Donec pede justo vel aliquet" },
    { id: 2, desc: "Aenean et nisl sagittis" },
  ];

  return (
    <React.Fragment>
      <section className="section hero-section" id="features">
        <div className="glow-container">
          <div className="glow-circle left"></div>
          <div className="glow-circle right"></div>
        </div>
        <Container>
          
          <Row className="align-items-center pt-md-5 mt-5">
     
            <Col md="5">
          
              {/* featurebox */}
              <FeatureBox
                num="01"
                title="Conseils personnalisés"
                features={features2}
                desc="la plateforme fournira des conseils personnalisés aux sportifs pour améliorer leurs performances."
              />
            </Col>
            <Col md="6" sm="8" className="ms-md-auto">
              <div className="me-md-0 mt-4 rounded-md">
                <img
                  src="assets/images/feature1.jpg"
                  alt=""
                  className="img-fluid d-block feature-img mx-auto"
                />
              </div>
            </Col>
          </Row>
          <div className="glow-container">
            <div className="glow-circle left"></div>
            <div className="glow-circle right"></div>
          </div>
          <Row className="align-items-center pt-4 mt-5">
            <Col md="6" sm="8">
              <div>
                <img
                  src="assets/images/feature2.jpg"
                  alt=""
                  className="img-fluid d-block feature-img mx-auto"
                />
              </div>
            </Col>
            <Col md="5" className="ms-auto">
              {/* featurebox */}
              <FeatureBox
                num="02"
                title="Suivi des performances en temps réel"
                features={features1}
                desc="la plateforme permettra aux sportifs de suivre leurs performances en temps réel."
              />
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  );
};

export default Features;
