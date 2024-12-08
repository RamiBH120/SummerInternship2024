import React from "react";
import { Container, Row, Col, UncontrolledCarousel } from "reactstrap";

const Section = () => {
  return (
    <React.Fragment>
      <section className="section hero-section" id="home">
        <div className="glow-container">
          <div className="glow-circle left"></div>
          <div className="glow-circle right"></div>
        </div>
        <Container>
        <Row className="align-items-center">
        <Col lg="6" md="4">
  <div className="text-white-50">
    <h1 className="fw-semibold hero-title mb-3 text-white">
      CNOT PERFORM
    </h1>
  </div>
  
  <h3 className="text-teal-500" style={{ color: "white", fontStyle: "italic" }}>
    L'Intelligence Artificielle au Service du Sport
  </h3>

  <hr />

  <div style={{ marginTop: "10%" }}>
    <a 
      href="\pdf\rapport cnot perform 2024p.pdf"  // Utilisation du chemin relatif vers le fichier dans 'public'
      className="cta-button mt-5"
      target="_blank"  // Ouvre le PDF dans un nouvel onglet
      rel="noopener noreferrer"  // Sécurité pour l'ouverture dans un nouvel onglet
    >
      Présentation 
    </a>
  </div>
</Col>



  <Col lg="6" md="8" sm="12" className="ms-lg-auto mt-5">
    <div className="hero-img">
      <UncontrolledCarousel
        items={[
          {
            
            key: 1,
            src: "assets/images/fares.jpg",
          },
          {
            
            key: 2,
            src: "assets/images/fight.jpg",
          },
          {
            
            key: 3,
            src: "assets/images/glory.jpg",
          },
          {
            
            key: 4,
            src: "assets/images/firas gatoussi.jpg",
          },
        ]}
      />
    </div>
  </Col>
</Row>

        </Container>
      </section>
      <section className="stats-section hero-section">
        <div className="stats-card">
          <h2>2,500</h2>
          <p>Total Athletes</p>
        </div>
        <div className="stats-card">
          <h2>300</h2>
          <p>Total Coaches</p>
        </div>
        <div className="stats-card">
          <h2>150</h2>
          <p>Total Trainers</p>
        </div>
        <div className="stats-card">
          <h2>10,000</h2>
          <p>Active Sessions</p>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Section;
