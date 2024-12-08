import React from "react";
import { Container, Row, Col } from "reactstrap";

const AboutUs = () => {
  return (
    <React.Fragment>
      <section className="section hero-section" id="about">
        <div className="glow-container">
          <div className="glow-circle left"></div>
          <div className="glow-circle right"></div>
        </div>
        <Container>
          <Row className="align-items-center position-relative">
            <img
              src="/assets/images/beats.png"
              alt=""
              className="position-absolute z-n1 inset-0 object-cover"
              style={{ top: 0, left: 0 }}
            />  <h3> Les Axes  </h3>
            <Col lg="5" className="position-relative about-us">
            
  <div className="about-content">
    <h3> Volet  Administratif </h3>
    
    <ul>
  <li style={{ fontSize: "2.0em" }}>• Gestion des Fédérations Nationales </li>
  <li style={{ fontSize: "2.0em" }}>• Gestion des Bourses </li>
  <li style={{ fontSize: "2.0em" }}>• Gestion des événements</li>

</ul>

<h3> Volet  Sportif & IA  </h3>
    
    <ul>
  <li style={{ fontSize: "2.0em" }}>• Prédiction des Médailles</li>
  <li style={{ fontSize: "2.0em" }}>• Prédiction des Bléssures  </li>
  <li style={{ fontSize: "2.0em" }}>• Chat bot Personalisé</li>
  <li style={{ fontSize: "2.0em" }}>• Tableaux de bord Interactif</li>

</ul>

  </div>
</Col>

            <Col lg="6" className="position-relative ms-auto">
              <div className="mt-lg-0 position-relative z-1 mt-4">
                <Row>
                  <Col sm="12" className="mx-auto">
                    <div>
                      <img src="assets/images/runningman.png" alt="" />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <hr className="my-5" />
        </Container>
      </section>
    </React.Fragment>
  );
};

export default AboutUs;
